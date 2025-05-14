import axios from "axios";
import { Request, Response } from "express";
import Order from "../models/Order";
import User, { IUser } from "../models/User";
import { sendOrderConfirmation, notifyAdmin } from "./emailService";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const BASE_URL = process.env.CASHFREE_BASE_URL || "https://api.cashfree.com/pg";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Define TypeScript interfaces for Cashfree API responses
interface CashfreeOrderResponse {
	cf_order_id: string;
	order_id: string;
	entity: string;
	order_currency: string;
	order_amount: number;
	order_status: string;
	payment_session_id: string;
	order_note?: string;
	order_meta?: {
		return_url?: string;
		notify_url?: string;
		payment_methods?: string;
	};
	settlements?: any;
	payments?: any;
	refunds?: any;
	customer_details: {
		customer_id: string;
		customer_name?: string;
		customer_email: string;
		customer_phone: string;
	};
	created_at: string;
}

interface CashfreeOrderStatusResponse {
	cf_order_id: string;
	order_id: string;
	order_status: string;
	order_amount: number;
	order_currency: string;
	payments?: any;
	refunds?: any;
}

// Create a simple interface for Axios errors
interface AxiosErrorResponse {
	response?: {
		data?: any;
		status?: number;
		headers?: any;
	};
	request?: any;
	message?: string;
}

// Create a Cashfree order with hosted checkout
export const createCashfreeOrder = async (req: any, res: Response) => {
	const userId = req.user?._id;
	const { addressId } = req.body;

	try {
		// Fetch user with cart items
		const user = await User.findById(userId).populate(
			"cart.productId",
			"productName price",
		);

		if (!user) return res.status(404).json({ message: "User not found" });
		if (!user.cart || user.cart.length === 0)
			return res.status(400).json({ message: "Cart is empty" });

		// Find the selected address
		const selectedAddress = user.addresses.find(
			(addr) => addr._id?.toString() === addressId,
		);

		if (!selectedAddress)
			return res.status(400).json({ message: "Invalid address ID" });

		// Create order items from cart
		const items = user.cart.map((item) => ({
			productId: item.productId._id,
			name: (item.productId as any).productName,
			price: (item.productId as any).price,
			quantity: item.quantity,
		}));

		const totalAmount = items.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);

		// Create a new order in pending state
		const order = await Order.create({
			user: userId,
			items,
			totalAmount,
			address: {
				deliveryName: selectedAddress.deliveryName,
				deliveryNumber: selectedAddress.deliveryNumber,
				streetAddress: selectedAddress.streetAddress,
				city: selectedAddress.city,
				state: selectedAddress.state,
				zip: selectedAddress.zip,
			},
			status: "pending",
			paymentStatus: "pending",
		});

		// Create a Cashfree payment session
		const response = await axios.post<CashfreeOrderResponse>(
			`${BASE_URL}/orders`,
			{
				order_id: order._id.toString(),
				order_amount: totalAmount,
				order_currency: "INR",
				customer_details: {
					customer_id: userId.toString(),
					customer_email: user.email,
					customer_phone: selectedAddress.deliveryNumber,
					customer_name: selectedAddress.deliveryName,
				},
				order_meta: {
					return_url: `${FRONTEND_URL}/payment-status?order_id=${order._id}`, // Corrected return_url without order_token
				},
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"x-client-id": CASHFREE_APP_ID || "",
					"x-client-secret": CASHFREE_SECRET_KEY || "",
					"x-api-version": "2022-09-01",
				},
			},
		);

		// Clear the user's cart after creating order
		user.cart = [];
		await user.save();

		// Return the payment session ID to the frontend
		return res.status(200).json({
			orderId: order._id,
			paymentSessionId: response.data.payment_session_id,
			cfOrderId: response.data.cf_order_id,
		});
	} catch (error) {
		console.error("❌ Error creating Cashfree order:", error);

		// Type guard with safe type casting
		const axiosError = error as unknown as AxiosErrorResponse;
		if (
			axiosError &&
			typeof axiosError === "object" &&
			axiosError.response &&
			axiosError.response.data
		) {
			console.error("Cashfree API error:", axiosError.response.data);
		}

		res.status(500).json({ message: "Payment setup failed" });
	}
};

// Verify payment status from Cashfree
export const verifyCashfreeOrder = async (req: Request, res: Response) => {
	const { orderId } = req.params;

	try {
		// Verify the order status with Cashfree
		const response = await axios.get<CashfreeOrderStatusResponse>(
			`${BASE_URL}/orders/${orderId}`,
			{
				headers: {
					Accept: "application/json",
					"x-client-id": CASHFREE_APP_ID || "",
					"x-client-secret": CASHFREE_SECRET_KEY || "",
					"x-api-version": "2022-09-01",
				},
			},
		);

		const orderStatus = response.data.order_status;
		let paymentStatus: "pending" | "paid" | "failed" = "pending";

		// Map Cashfree status to our payment status
		if (orderStatus === "PAID") {
			paymentStatus = "paid";
		} else if (["EXPIRED", "FAILED"].includes(orderStatus)) {
			paymentStatus = "failed";
		}

		// Update the order in our database
		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{ paymentStatus },
			{ new: true },
		).populate("user");

		// Send email notifications if payment was successful
		if (paymentStatus === "paid" && updatedOrder) {
			if (updatedOrder.user && typeof updatedOrder.user === "object") {
				const userEmail = (updatedOrder.user as IUser).email;
				// Send emails asynchronously without awaiting
				sendOrderConfirmation(userEmail, updatedOrder).catch((error) => {
					console.error("❌ Error sending order confirmation email:", error);
				});

				notifyAdmin(updatedOrder).catch((error) => {
					console.error("❌ Error sending admin notification email:", error);
				});
			}
		}

		// Return the status to the frontend
		res.json({
			status: orderStatus,
			order: {
				id: updatedOrder?._id || orderId,
				amount: response.data.order_amount,
				currency: response.data.order_currency,
			},
		});
	} catch (error) {
		console.error("❌ Error verifying payment status:", error);

		// Type guard with safe type casting
		const axiosError = error as unknown as AxiosErrorResponse;
		if (
			axiosError &&
			typeof axiosError === "object" &&
			axiosError.response &&
			axiosError.response.data
		) {
			console.error("Cashfree API error:", axiosError.response.data);
		}

		res.status(500).json({ message: "Failed to verify order" });
	}
};

// Add webhook handler for Cashfree notifications
export const cashfreeWebhook = async (req: Request, res: Response) => {
	try {
		const data = req.body;

		// Verify the webhook signature if provided
		// TODO: Add signature verification logic

		console.log("Received webhook from Cashfree:", data);

		if (data.data && data.data.order && data.data.order.order_id) {
			const orderId = data.data.order.order_id;
			const orderStatus = data.data.order.order_status;

			let paymentStatus: "pending" | "paid" | "failed" = "pending";

			if (orderStatus === "PAID") {
				paymentStatus = "paid";
			} else if (["EXPIRED", "FAILED"].includes(orderStatus)) {
				paymentStatus = "failed";
			}

			// Update order status in the database
			const updatedOrder = await Order.findByIdAndUpdate(
				orderId,
				{ paymentStatus },
				{ new: true },
			).populate("user");

			// Send notifications if payment was successful
			if (paymentStatus === "paid" && updatedOrder) {
				if (updatedOrder.user && typeof updatedOrder.user === "object") {
					const userEmail = (updatedOrder.user as IUser).email;
					sendOrderConfirmation(userEmail, updatedOrder).catch(console.error);
					notifyAdmin(updatedOrder).catch(console.error);
				}
			}
		}

		// Always return 200 to acknowledge receipt of webhook
		res.status(200).json({ status: "Webhook received" });
	} catch (error) {
		console.error("❌ Error processing webhook:", error);
		// Still return 200 to avoid Cashfree retrying
		res.status(200).json({ status: "Webhook received with errors" });
	}
};
