import { CategoryModel } from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import fs from "fs"
import {
  uploadOnCloudinary,
  deleteFromCludinary,
} from "../utils/upload.cloudinary.js";


// --------------------Create Category -----------------------------------------------------------------

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      throw new ApiError(400, `Category (${name}) already exists`);
    }
    let cloudinaryPublicURL = undefined;
    if (req.file || req.file?.length) {
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
    if(cloudinaryPublicURL)data.image=cloudinaryPublicURL
    if (description) data.description = description;
    if (isActive==false) data.isActive = isActive;

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
    fs.unlinkSync(req.file.path)
    next(error);
  }
};


// --------------------get All Categories -----------------------------------------------------------------


