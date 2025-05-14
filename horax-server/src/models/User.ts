import mongoose, { Document, Schema, Types } from "mongoose";

// Define Address Interface
export interface IAddress {
	_id?: Types.ObjectId; // Optional because Mongoose adds this automatically
	tag: "home" | "work" | "other";
	deliveryName: string; // Delivery name
	deliveryNumber: string; // Delivery number
	streetAddress: string;
	city: string;
	state: string;
	zip: string;
}

// Define Cart Item Interface
export interface ICartItem {
	productId: Types.ObjectId;
	quantity: number;
}

// Define User Interface
export interface IUser extends Document {
	_id: Types.ObjectId;
	fullName: string;
	email: string;
	phone: string;
	password?: string;
	isVerified: boolean;
	otp?: string; // For registration/verification (if used)
	otpExpiry?: Date; // For registration/verification (if used)
	// New fields for forgot password feature:
	resetOtp?: string;
	resetOtpExpiry?: Date;
	googleId?: string;
	role: string;
	cart: ICartItem[];
	addresses: IAddress[];
	profileImg?: string;
}

// Define Address Schema
const AddressSchema: Schema = new Schema<IAddress>({
	tag: { type: String, enum: ["home", "work", "other"], required: true },
	deliveryName: { type: String, required: true },
	deliveryNumber: { type: String, required: true },
	streetAddress: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zip: { type: String, required: true },
});

// Define User Schema
const UserSchema: Schema = new Schema<IUser>({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	password: { type: String },
	isVerified: { type: Boolean, default: false },
	otp: { type: String },
	otpExpiry: { type: Date },
	resetOtp: { type: String },
	resetOtpExpiry: { type: Date },
	googleId: { type: String },
	role: { type: String, enum: ["user", "admin"], default: "user" },
	cart: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: { type: Number, default: 1 },
		},
	],
	addresses: { type: [AddressSchema], default: [] },
	profileImg: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);
