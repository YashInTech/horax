import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { IOrder } from '../models/Order'; // Import Order model interface

dotenv.config();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate modern email template
const generateEmailTemplate = (order: IOrder, forAdmin: boolean = false) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f8f8f8;">
      <h2 style="color: #8B4513; text-align: center;">${
        forAdmin ? 'New Order Notification' : 'Order Confirmation'
      }</h2>

      <p style="font-size: 16px; color: #333;">Hello ${
        forAdmin ? 'Admin' : order.address.deliveryName
      },</p>
      <p style="font-size: 14px; color: #555;">
          ${
            forAdmin
              ? 'A new order has been placed with the following details:'
              : 'Thank you for your order! Here are your order details:'
          }
      </p>

      <div style="border-top: 2px solid #8B4513; padding-top: 10px; margin-top: 10px;">
          <p><strong>Order ID:</strong> ${order._id.toString()}</p>
          ${
            forAdmin
              ? `<p><strong>Customer Name:</strong> ${order.address.deliveryName}</p>`
              : ''
          }
          ${
            forAdmin
              ? `<p><strong>Customer Contact:</strong> ${order.address.deliveryNumber}</p>`
              : ''
          }
          <p><strong>Total Amount:</strong>₹${order.totalAmount.toFixed(2)}</p>

          <h3 style="color: #8B4513; margin-top: 15px;">Delivery Address:</h3>
          <p>${order.address.streetAddress}, ${order.address.city}, ${
    order.address.state
  }, ${order.address.zip}</p>

          <h3 style="color: #8B4513; margin-top: 15px;">Items Ordered:</h3>
          <ul>
              ${order.items
                .map(
                  (item) => `
                  <li style="margin-bottom: 8px;">
                      <strong>${item.name}</strong> - ${
                    item.quantity
                  } x ₹${item.price.toFixed(2)}
                  </li>`
                )
                .join('')}
          </ul>
      </div>

      <p style="font-size: 14px; color: #555; margin-top: 20px;">
          ${
            forAdmin
              ? 'Please process this order as soon as possible.'
              : 'We will update you once your order is shipped.'
          }
      </p>

      <p style="font-size: 14px; color: #333; text-align: center;">Thank you for shopping with us!</p>
  </div>
  `;
};

// Send Order Confirmation Email to User
export const sendOrderConfirmation = async (
  userEmail: string,
  order: IOrder
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmation - Your Order is Placed!',
      html: generateEmailTemplate(order),
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
  }
};

// Send New Order Notification to Admin with Full Order Details
export const notifyAdmin = async (order: IOrder) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Set Admin email in .env file
      subject: '🚀 New Order Received!',
      html: generateEmailTemplate(order, true),
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ New order notification email sent to Admin.');
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
  }
};
