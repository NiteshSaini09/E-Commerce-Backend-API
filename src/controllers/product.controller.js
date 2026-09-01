import mongoose from "mongoose";
import { ProductModel } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/upload.cloudinary.js";

// ----------Create product-----------------

export const create = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      price,
      discount,
      stock,
      category,
      status,
    } = req.body;
    const data = {
      user: req.user?._id,
      name,
    };
    if (description) data.description = description;
    if (brand) data.brand = brand;
    if (price === 0 || price > 0) data.price = price;
    if (discount === 0 || discount > 0) data.discount = discount;
    if (stock === 0 || stock > 0) data.stock = stock;
    if (category) data.category = category;
    if (status) data.status = status;
    const product = await ProductModel.create(data);
    if (!product) {
      throw new ApiError(500, "Error while adding product");
    }
    res.status(200).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ----------Get all products-------------

export const getAll = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    const totalProducts = await ProductModel.countDocuments();
    res.status(200).json({
      success: true,
      message: "Products retrived",
      totalProducts,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// -------------get product  by id---------

export const getProduct = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "invalid product id");
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    res.status(200).json({
      success: true,
      message: "Product retrived",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// --------------Update Product---------------

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "invalid product id");
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found for update");
    }
    const {
      description,
      name,
      brand,
      price,
      discount,
      stock,
      category,
      status,
    } = req.body;
    const data = {};
    if (description) data.description = description;
    if (name) data.name = name;
    if (brand) data.brand = brand;
    if (price) data.price = price;
    if (discount === 0 || discount > 0) data.discount = discount;
    if (stock < 0 || stock) {
      const newStock = product.stock + stock;
      if (newStock >= 0) {
        data.stock = newStock;
      }
    }
    if (stock === 0) {
      data.stock = stock;
    }
    if (category) data.category = category;
    if (status) data.status = status;
    if (discount >= 0 && price) {
      const finalPrice = price - (price * discount) / 100;
      data.finalprice = finalPrice;
    } else if (discount >= 0 && !price) {
      const finalPrice = product.price - (product.price * discount) / 100;
      data.finalprice = finalPrice;
    } else if (!discount && price) {
      const finalPrice = price - (price * product.discount) / 100;
      data.finalprice = finalPrice;
    }
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { returnDocument: "after" },
    );
    if (!updatedProduct) {
      throw new ApiError(500, "Can't update product");
    }
    res.status(200).json({
      success: true,
      message: "Product updated Successfully",
      updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ---------delete------------

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid Product id");
    }
    const product = await ProductModel.findOne({
      _id: id,
    });
    if (!product) {
      throw new ApiError(404, "Product not found for delete");
    }
    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: id,
    });
    if (!deletedProduct) {
      throw new ApiError(500, "can't delete product");
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ---------Upload image---------

export const uploadImage = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "invalid prduct id to upload product image");
    }
    const product = await ProductModel.findById(req.params?.id);
    if (!product) {
      throw new ApiError(404, "can't find product for upload product image");
    }
    if(req.files.length==0){
      console.log("No files provided to upload")
    }
    for (let i = 0; i < req.files.length; i++) {
      const publicURL = await uploadOnCloudinary(req.files[i].path);
      if(publicURL!=null){
        product.productimages.push(publicURL)
      }
    }
    await product.save()
    res.status(201).json({
      success:true,
      message:"Product images uploaded successfully"
    })
  } catch (error) {
    next(error);
  }
};
