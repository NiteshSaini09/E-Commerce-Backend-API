import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      throw new ApiError(400, "User already exists with this email");
    }
    const user = await UserModel.create({ name, email, password });
    if (!user) {
      throw new ApiError(500, "error while registration");
    }
    const registeredUser = await UserModel.findById(user?._id).select(
      "-password -createdAt -updatedAt",
    );
    res.status(201).json({
      success: true,
      message: "registration success",
      registeredUser,
    });
  } catch (error) {
    next(error);
  }
};
//  -------------login--------------

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "Invalid email or password");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid email or password");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    const options = {
      httpOnly: true,
      secure: true,
    };
    await user.save();
    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        message: "User Loged in successfully",
        refreshToken,
        accessToken,
      });
  } catch (error) {
    next(error);
  }
};

//------------profile--------------
export const profile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user?._id).select(
      "-password -refreshToken",
    );
    res.status(200).json({
      success: true,
      message: "User Profile Fatched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const adminPannel = async (req, res, next) => {
  res.send("I am admin");
};

export const logOut = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user?._id);
    user.refreshToken = undefined;
    await user.save();
    res
      .status(200)
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .json({
        success: true,
        message: "User loged out successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new ApiError(400, "can't get Refresh Token, Please login first");
    }
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken?._id);
    if (!user || token !== user.refreshToken) {
      throw new ApiError(400, "Invalid Token");
    }
    const newAccessToken = await user.generateAccessToken();
    const options = {
      httpOnly: true,
    };
    res.status(200).cookie("accessToken", newAccessToken, options).json({
      success: true,
      message: "access token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};
