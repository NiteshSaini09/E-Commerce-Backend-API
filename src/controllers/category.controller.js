import { CategoryModel } from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import fs from "fs";
import {
  uploadOnCloudinary,
  deleteFromCludinary,
} from "../utils/upload.cloudinary.js";
import mongoose from "mongoose";
import isEmpty from "../utils/isObjectEmpty.js";
import extractPublicId from "../utils/extractPublicIdFromCloudinaryURL.js";

// --------------------Create Category -----------------------------------------------------------------

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      throw new ApiError(400, `Category (${name}) already exists`);
    }
    let cloudinaryPublicURL = undefined;
    if (req.file) {
      let imageLocalPath = req.file.path;
      const result = await uploadOnCloudinary(imageLocalPath, "categoryimages");
      if (!result) {
        throw new ApiError(500, "Category image upload failure");
      }
      cloudinaryPublicURL = result.url;
    }

    const data = {
      name,
    };
    if (cloudinaryPublicURL) data.image = cloudinaryPublicURL;
    if (description) data.description = description;
    if (isActive == false) data.isActive = isActive;

    const category = await CategoryModel.create(data);
    if (!category) {
      throw new ApiError(500, "New Category not created");
    }
    res.status(200).json({
      success: true,
      message: "New Category Added Successfully",
      category,
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// --------------------get All Categories -----------------------------------------------------------------

export const getAllCategories = async (req, res, next) => {
  try {
    const categorys = await CategoryModel.find();
    res.status(200).json({
      success: true,
      message: "All Categorys are Retrived",
      categorys,
    });
  } catch (error) {
    next(error);
  }
};

//-------------------get Category By id-------------------------------------------------------------

export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params?.id;
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new ApiError(400, "Invalid Category id");
    }
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    res.status(200).json({
      success: true,
      message: "Category found",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------Update Category------------------------------------------------

export const updateCategory = async (req, res, next) => {
  try {
    const isBodyEmpty=isEmpty(req.body)
    if (isBodyEmpty && !req.file) {
      throw new ApiError(400, "Provide at least one field to update");
    }
    const { name, description, isActive } = req.body;
    const categoryId = req.params?.id;
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new ApiError(400, "Invalid Category id");
    }
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found for Update category");
    }
    const data = {};
    if (name) {
      if (name === category.name) {
        console.log("Category name is same as current name");
      } else {
        data.name = name;
      }
    }
    if (description) {
      if (description === category.description) {
        console.log("Description is same as current description");
      } else {
        data.description = description;
      }
    }
    if (isActive != undefined) {
      if (isActive == category.isActive) {
        console.log("isActive is same as current isActive");
      } else {
        data.isActive = isActive;
      }
    }
    let cloudinaryPublicURL = undefined;
    if (req.file) {
      const imageLocalPath = req.file.path;
      const result = await uploadOnCloudinary(imageLocalPath, "categoryimages");
      if (!result) {
        throw new ApiError(
          500,
          "Cloudinary upload error while updating category image",
        );
      }
      cloudinaryPublicURL = result.url;
    }
    if (cloudinaryPublicURL) data.image = cloudinaryPublicURL;

    const isDataEmpty = isEmpty(data);
    if (isDataEmpty) {
      throw new ApiError(400, "Nothing to update");
    }

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: categoryId },
      { $set: data },
      { returnDocument: "after" },
    );
    if (!updatedCategory) {
      throw new ApiError(500, "Can't update category");
    }
    res.status(200).json({
      success: true,
      message: "Category Update Success",
      updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------Delete Category -----------------------------------------

export const deleteCategory=async (req,res,next)=>{
  try {
     const categoryId = req.params?.id;
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new ApiError(400, "Invalid Category id");
    }
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found for delete");
    }
    if(category.image!=null){
      const publicId=extractPublicId(category.image)
      console.log(publicId)
      const cloudinaryImageDeleteStatus= await deleteFromCludinary(publicId)
      console.log(cloudinaryImageDeleteStatus)
    }
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId,{returnDocument:"after"});
    if (!deletedCategory) {
      throw new ApiError(500, "Category is not Deleted");
    }

    res.status(200).json({

      success:true,
      message:"Category Deleted Successfully",
      deletedCategory
    })

  } catch (error) {
    next(error)
  }
}

