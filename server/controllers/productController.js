import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// ===============================
// CREATE PRODUCT
// ===============================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      stock,
      isFeatured,
    } = req.body;

    if (
      !name ||
      !brand ||
      !description ||
      !price ||
      !category ||
      !sizes ||
      !colors ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    let imageUrls = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "shoe-store/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          Readable.from(file.buffer).pipe(stream);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      discountPrice,
      category,
      sizes:
        typeof sizes === "string"
          ? JSON.parse(sizes)
          : sizes,
      colors:
        typeof colors === "string"
          ? JSON.parse(colors)
          : colors,
      images: imageUrls,
      stock,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// ===============================
// GET ALL PRODUCTS
// ===============================

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      filter.category = category;
    }

    // Brand
    if (brand) {
      filter.brand = brand;
    }

    // Price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price_asc") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price_desc") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ===============================
// GET PRODUCT BY ID
// ===============================

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      stock,
      isFeatured,
    } = req.body;

    const updateData = {
      name,
      brand,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      stock,
      isFeatured,
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};