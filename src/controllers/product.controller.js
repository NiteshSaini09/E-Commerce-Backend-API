import mongoose from "mongoose";
import { ProductModel } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCludinary,
} from "../utils/upload.cloudinary.js";
import fs from "fs";
import { CategoryModel } from "../models/category.model.js";
import isEmpty from "../utils/isObjectEmpty.js";

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
    const files = req.files;
    const data = {
      user: req.user?._id,
      name,
      // productimages: imageURLs,
    };
    if (description) data.description = description;
    if (brand) data.brand = brand;
    if (price === 0 || price > 0) data.price = price;
    if (discount === 0 || discount > 0) data.discount = discount;
    if (stock === 0 || stock > 0) data.stock = stock;
    if (category) {
      const isCategoryExists = await CategoryModel.findOne({ name: category });
      // console.log(isCategoryExists)
      if (isCategoryExists) {
        if (isCategoryExists.isActive != false) {
          data.category = isCategoryExists._id;
        } else {
          throw new ApiError(400, `${category} Category is Not Active`);
        }
      } else {
        throw new ApiError(404, "No Such Category Found");
      }
    }
    if (status) data.status = status;
    if (!files || files.length === 0) {
      throw new ApiError(400, "At least one product image is required");
    }
    const imageURLs = [];
    for (const file of files) {
      const result = await uploadOnCloudinary(
        file.path,
        process.env.CLOUDINARY_FOLDER,
      );
      if (!result) {
        throw new ApiError(500, "Product image Upload failed");
      }
      imageURLs.push({
        publicURL: result.url,
        publicId: result.public_id,
      });
    }
    if (imageURLs.length > 0) data.productimages = imageURLs;

    const product = await ProductModel.create(data);
    if (!product) {
      throw new ApiError(500, "Error while adding product");
    }
    const createdProduct = await ProductModel.findById(product._id).populate(
      "category",
    );
    // console.log(req.files)
    res.status(200).json({
      success: true,
      message: "Product added successfully",
      createdProduct,
    });
  } catch (error) {
    for (const file of req.files ?? []) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
    next(error);
  }
};

// ----------Get all products-------------

export const getAll = async (req, res, next) => {
  try {
    const search = req.query?.search;
    const category = req.query?.category;
    const minPrice = Number(req.query?.minPrice);
    const maxPrice = Number(req.query?.maxPrice);
    const query = {};
    const price = {};
    if (minPrice>=0) {
      price.$gte = minPrice;
    }
    if (maxPrice>=0) {
      if(minPrice>maxPrice){
        throw new ApiError(400,"Max Price Should Greater Than Min Price")
      }
      price.$lte = maxPrice;
    }
    const isPriceEmpty = isEmpty(price);
    if (!isPriceEmpty) {
      query.price = price;
    }
    console.log(query);

    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        throw new ApiError(400, "Invalid category Id in query");
      }
      query.category = category;
    }

    if (search?.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }
    const products = await ProductModel.find(query)
      .populate("category", "name")
      .populate("user", "name email");
    const totalProducts = await ProductModel.countDocuments(query);
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
    if (!req.files || req.files?.length <= 0) {
      throw new ApiError(400, "Give at least one product image");
    }
    const product = await ProductModel.findById(req.params?.id);
    if (!product) {
      throw new ApiError(404, "can't find product for upload product image");
    }
    if (req.files.length == 0) {
      throw new ApiError(400, "No files for upload");
    }
    if (product.productimages.length + req.files.length > 5) {
      for (const img of req.files) {
        // console.log(img)
        fs.unlinkSync(img.path);
      }
      throw new ApiError(
        400,
        `Maximum 5 images can be stored for a product, product already have ${product.productimages.length},you can add ${5 - product.productimages.length} images`,
      );
    }

    for (let i = 0; i < req.files.length; i++) {
      const result = await uploadOnCloudinary(
        req.files[i].path,
        process.env.CLOUDINARY_FOLDER,
      );
      if (result != null || result != undefined) {
        product.productimages.push({
          publicURL: result.url,
          publicId: result.public_id,
        });
      }
    }
    if (product.isModified("productimages")) {
      await product.save();
      res.status(201).json({
        success: true,
        message: "Product images uploaded successfully",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No Changes",
      });
    }

    // console.log("product image uploaded successfully")
  } catch (error) {
    next(error);
  }
};

// ------------------Delete Product Image--------------------
export const deleteProductImage = async (req, res, next) => {
  try {
    const productId = req.params?.id;
    const { publicId } = req.body;
    if (!mongoose.isValidObjectId(productId)) {
      throw new ApiError(400, "Invalid product id");
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new ApiError(404, "product not found");
    }
    // console.log(product.productimages)
    const productimages = product.productimages;
    const productimageObject = productimages.find(
      (item) => item.publicId === publicId,
    );
    if (!productimageObject) {
      throw new ApiError(404, "Can't find image with provided publicId");
    }

    const result = await deleteFromCludinary(publicId);
    let rmv = undefined;
    if (result.result === "ok") {
      rmv = await ProductModel.updateOne(
        { _id: productId },
        { $pull: { productimages: { publicId: publicId } } },
      );
      rmv = rmv.acknowledged;
    } else {
      rmv = false;
    }
    res.status(200).json({
      success: true,
      Cloudinary_Delete_Status: result.result,
      Database_delete_status: rmv,
    });
  } catch (error) {
    next(error);
  }
};
