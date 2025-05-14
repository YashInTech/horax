// src/utils/sendEmail.ts
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import dotenv from 'dotenv';
import { IOrder } from '../models/Order';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
  },
});

// HTML OTP Email Template Function
export const generateEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background-color: #1a1a1a;">
        <h1 style="color: #fff;">HORAX</h1>
        <p style="font-size: 16px; color: #ccc;">Premium Gym Apparel</p>
      </div>
      <div style="padding: 20px; background-color: #fff; border-radius: 10px; margin-top: 20px;">
        <h2 style="text-align: center; color: #333;">Your Verification Code</h2>
        <p style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #f8f8f8; border-radius: 5px;">${otp}</p>
        <p style="font-size: 16px; color: #555; text-align: center;">Use this code to verify your email address. This code will expire in 10 minutes.</p>
      </div>
      <div style="text-align: center; margin-top: 30px; padding: 20px; color: #777; font-size: 14px; background-color: #f8f8f8;">
        <p>If you did not request this verification code, please ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} HORAX Gym Apparel</p>
      </div>
    </div>
  `;
};

// HTML Order Confirmation Email Template
export const generateOrderTemplate = (
  order: IOrder,
  forAdmin: boolean = false
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f8f8f8;">
      <div style="text-align: center; padding: 20px; background-color: #fff; border-radius: 5px;">
        <h1 style="color: #333;">HORAX</h1>
        <p style="font-size: 16px; color: #555;">Fashion for everyone</p>
      </div>
      
      <h2 style="color: #333; text-align: center; margin-top: 20px;">${
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

      <div style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
        <p><strong>Order ID:</strong> ${order._id.toString()}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleDateString()}</p>
        ${
          forAdmin
            ? `<p><strong>Customer Name:</strong> ${order.address.deliveryName}</p>
               <p><strong>Customer Contact:</strong> ${order.address.deliveryNumber}</p>`
            : ''
        }
        <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>

        <h3 style="color: #333; margin-top: 15px;">Delivery Address:</h3>
        <p>${order.address.streetAddress}, ${order.address.city}, ${
    order.address.state
  }, ${order.address.zip}</p>

        <h3 style="color: #333; margin-top: 15px;">Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #eee;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: center;">Quantity</th>
            <th style="padding: 8px; text-align: right;">Price</th>
            <th style="padding: 8px; text-align: right;">Total</th>
          </tr>
          ${order.items
            .map(
              (item) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                  item.name
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
                  item.quantity
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(
                  2
                )}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(
                  item.price * item.quantity
                ).toFixed(2)}</td>
              </tr>`
            )
            .join('')}
          <tr>
            <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 8px;"><strong>₹${order.totalAmount.toFixed(
              2
            )}</strong></td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; color: #555; margin-top: 20px;">
        ${
          forAdmin
            ? 'Please process this order as soon as possible.'
            : 'We will update you once your order is shipped.'
        }
      </p>

      <div style="text-align: center; margin-top: 30px; padding: 20px; color: #777; font-size: 14px; background-color: #fff; border-radius: 5px;">
        <p>Thank you for shopping with us!</p>
        <p>&copy; ${new Date().getFullYear()} HORAX Fashion</p>
      </div>
    </div>
  `;
};

// Send Email Function
export const sendEmail = async (options: Mail.Options): Promise<void> => {
  try {
    await transporter.sendMail(options);
    console.log('📧 Email sent:', options.to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

// Send Order Confirmation Email to User
export const sendOrderConfirmation = async (
  userEmail: string,
  order: IOrder
) => {
  try {
    const mailOptions = {
      from: `"HORAX Fashion" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Order Confirmation - Your Order is Placed!',
      html: generateOrderTemplate(order),
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
  }
};

// Send New Order Notification to Admin
export const notifyAdmin = async (order: IOrder) => {
  try {
    const mailOptions = {
      from: `"HORAX System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🚀 New Order Received!',
      html: generateOrderTemplate(order, true),
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ New order notification email sent to Admin');
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
  }
};
