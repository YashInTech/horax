import mongoose, { Schema, Document, Types } from 'mongoose';

interface IProduct extends Document {
  productName: string;
  description: string;
  price: number;
  images: string[]; // Support multiple images
  imageIds: string[]; // For storing the Cloudinary public IDs
  category: string;
  type: 'Tops' | 'Bottoms' | 'Accessories' | 'Equipment';
  sizes: string[];
  colors: string[];
  material: string;
  features: string[];
  stock: number;
  discount: number;
  bestseller: boolean;
  featured: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema: Schema = new Schema(
  {
    productName: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    imageIds: { type: [String], required: false },
    category: {
      type: String,
      required: true,
      default: 'Gym Wear',
    },
    type: {
      type: String,
      required: true,
      enum: ['Tops', 'Bottoms', 'Accessories', 'Equipment'],
      default: 'Tops',
    },
    sizes: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one size must be provided',
      },
    },
    colors: { type: [String], default: [] },
    material: { type: String, required: false },
    features: { type: [String], default: [] }, // e.g., "Moisture-wicking", "4-way stretch"
    stock: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Add text index for search
ProductSchema.index({ productName: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
