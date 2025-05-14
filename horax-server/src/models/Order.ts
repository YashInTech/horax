import mongoose, { Schema, Document, Types } from "mongoose";
import type { IUser } from "./User";

export interface IOrderItem {
	productId: Types.ObjectId;
	name: string;
	price: number;
	quantity: number;
}

export interface IOrder extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	items: IOrderItem[];
	totalAmount: number;
	address: {
		deliveryName: string;
		deliveryNumber: string;
		streetAddress: string;
		city: string;
		state: string;
		zip: string;
	};
	status: "pending" | "shipped" | "delivered" | "cancelled"; // delivery status
	paymentStatus: "pending" | "paid" | "failed";
	createdAt: Date;
	updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				name: { type: String, required: true },
				price: { type: Number, required: true },
				quantity: { type: Number, required: true },
			},
		],
		totalAmount: { type: Number, required: true },
		address: {
			deliveryName: { type: String, required: true },
			deliveryNumber: { type: String, required: true },
			streetAddress: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: true },
			zip: { type: String, required: true },
		},
		status: {
			type: String,
			enum: ["pending", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

export default mongoose.model<IOrder>("Order", OrderSchema);
