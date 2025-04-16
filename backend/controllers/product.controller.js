// import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { Op, Sequelize } from "sequelize";

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll(); // no filtering
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let imageUrl = "";
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
      imageUrl = cloudinaryResponse?.secure_url || "";
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: imageUrl,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Deleted image from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary", error);
      }
    }

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ RECOMMENDED PRODUCTS
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [Sequelize.literal("RAND()")],
      limit: 4,
      attributes: ["id", "name", "description", "image", "price"],
    });

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ PRODUCTS BY CATEGORY (Case-insensitive for MySQL)
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log("Requested category:", category);

    const products = await Product.findAll({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("category")),
        Op.like,
        category.toLowerCase()
      ),
    });

    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ TOGGLE FEATURED (kept for admin control, but not used in filtering)
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, image, category } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
      product.image = cloudinaryResponse?.secure_url || product.image;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
