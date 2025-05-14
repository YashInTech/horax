import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { IUser } from '../models/User';
import { uploadImages, deleteImage } from '../utils/imageUpload';

// Get product form fields for frontend
export const getProductFields = (req: Request, res: Response) => {
  try {
    const fields = [
      {
        name: 'productName',
        label: 'Product Name',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        required: true,
      },
      {
        name: 'type',
        label: 'Product Type',
        type: 'select',
        options: ['Tops', 'Bottoms', 'Accessories', 'Equipment'],
        required: true,
      },
      {
        name: 'sizes',
        label: 'Available Sizes',
        type: 'multiselect',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        required: true,
      },
      {
        name: 'colors',
        label: 'Available Colors',
        type: 'multiselect',
        options: [
          'Black',
          'White',
          'Grey',
          'Blue',
          'Red',
          'Green',
          'Yellow',
          'Purple',
          'Camo',
        ],
        required: false,
      },
      {
        name: 'material',
        label: 'Material',
        type: 'text',
        required: false,
      },
      {
        name: 'features',
        label: 'Features',
        type: 'multiselect',
        options: [
          'Moisture-wicking',
          '4-way stretch',
          'Anti-odor',
          'Breathable',
          'Seamless',
          'Compression',
        ],
        required: false,
      },
      {
        name: 'stock',
        label: 'Stock Quantity',
        type: 'number',
        required: true,
      },
      {
        name: 'discount',
        label: 'Discount (%)',
        type: 'number',
        required: false,
      },
      {
        name: 'bestseller',
        label: 'Bestseller',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'featured',
        label: 'Featured',
        type: 'checkbox',
        required: false,
      },
    ];

    res.json(fields);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(500).json({
      message: 'Failed to generate product fields',
      error: errorMessage,
    });
  }
};

// Add a new product (Admin only)
export const addProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'Product images are required' });
    }

    const files = req.files as Express.Multer.File[];

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.mimetype)
    );
    if (invalidFiles.length > 0) {
      return res
        .status(400)
        .json({ message: 'Only JPEG, PNG, and WEBP images are allowed' });
    }

    // Upload all images to Cloudinary
    const uploadPromises = files.map((file) => uploadImages(file));
    const uploadResults = await Promise.all(uploadPromises);

    // Parse arrays if they come as strings
    let parsedData = { ...req.body };
    if (typeof parsedData.sizes === 'string') {
      try {
        parsedData.sizes = JSON.parse(parsedData.sizes);
      } catch (e) {
        parsedData.sizes = [parsedData.sizes];
      }
    }

    if (typeof parsedData.colors === 'string') {
      try {
        parsedData.colors = JSON.parse(parsedData.colors);
      } catch (e) {
        parsedData.colors = [parsedData.colors];
      }
    }

    if (typeof parsedData.features === 'string') {
      try {
        parsedData.features = JSON.parse(parsedData.features);
      } catch (e) {
        parsedData.features = [parsedData.features];
      }
    }

    const newProduct = new Product({
      ...parsedData,
      images: uploadResults.map((result) => (result as any).secure_url),
      imageIds: uploadResults.map((result) => (result as any).public_id),
      category: 'Gym Wear', // Default category
      createdBy: (req.user as IUser)._id,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json({
      message: 'Product successfully added',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({
      message: 'Failed to add product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all products with filtering and pagination
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      minPrice,
      maxPrice,
      bestseller,
      featured,
      search,
      sort = 'createdAt',
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};
    if (type) filter.type = type;
    if (bestseller) filter.bestseller = bestseller === 'true';
    if (featured) filter.featured = featured === 'true';

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search as string };
    }

    // Sort logic
    const sortOption: any = {};
    if (sort === 'price') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else sortOption.createdAt = -1; // Default sort by newest

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination info
    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      message: 'Failed to fetch products',
    });
  }
};

// Get a single product by ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Update a product (Admin only)
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process images if new ones are uploaded
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Validate file types
      const files = req.files as Express.Multer.File[];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const invalidFiles = files.filter(
        (file) => !allowedTypes.includes(file.mimetype)
      );
      if (invalidFiles.length > 0) {
        return res
          .status(400)
          .json({ message: 'Only JPEG, PNG, and WEBP images are allowed' });
      }

      // Delete old images from Cloudinary
      if (product.imageIds && product.imageIds.length > 0) {
        const deletePromises = product.imageIds.map((imageId) =>
          deleteImage(imageId).catch((err) =>
            console.error(`Failed to delete image ${imageId}:`, err)
          )
        );
        await Promise.all(deletePromises);
      }

      // Upload new images
      const uploadPromises = files.map((file) => uploadImages(file));
      const uploadResults = await Promise.all(uploadPromises);

      product.images = uploadResults.map(
        (result) => (result as any).secure_url
      );
      product.imageIds = uploadResults.map(
        (result) => (result as any).public_id
      );
    }

    // Parse arrays if they come as strings
    let parsedData = { ...req.body };
    if (typeof parsedData.sizes === 'string') {
      try {
        parsedData.sizes = JSON.parse(parsedData.sizes);
      } catch (e) {
        parsedData.sizes = [parsedData.sizes];
      }
    }

    if (typeof parsedData.colors === 'string') {
      try {
        parsedData.colors = JSON.parse(parsedData.colors);
      } catch (e) {
        parsedData.colors = [parsedData.colors];
      }
    }

    if (typeof parsedData.features === 'string') {
      try {
        parsedData.features = JSON.parse(parsedData.features);
      } catch (e) {
        parsedData.features = [parsedData.features];
      }
    }

    // Update remaining fields
    Object.keys(parsedData).forEach((key) => {
      if (key !== 'images' && key !== 'imageIds' && key !== 'createdBy') {
        (product as any)[key] = parsedData[key];
      }
    });

    const updatedProduct = await product.save();
    return res.status(200).json({
      message: 'Product successfully updated',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete a product (Admin only)
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.imageIds && product.imageIds.length > 0) {
      const deletePromises = product.imageIds.map((imageId) =>
        deleteImage(imageId).catch((err) =>
          console.error(`Failed to delete image ${imageId}:`, err)
        )
      );
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Product successfully deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const featuredProducts = await Product.find({ featured: true })
      .limit(8)
      .sort({ createdAt: -1 });

    return res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch featured products' });
  }
};

// Get bestseller products
export const getBestsellerProducts = async (req: Request, res: Response) => {
  try {
    const bestsellerProducts = await Product.find({ bestseller: true })
      .limit(8)
      .sort({ createdAt: -1 });

    return res.status(200).json(bestsellerProducts);
  } catch (error) {
    console.error('Error fetching bestseller products:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch bestseller products' });
  }
};
