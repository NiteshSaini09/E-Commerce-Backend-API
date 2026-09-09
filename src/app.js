import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ProductModel } from "./models/product.model.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'))

app.set("view engine", "ejs");

app.get("/", (req, res) => {
//   console.log(path.__dirname);
//   console.log(path)
//   console.log(path.join(__dirname, 'views'))
//   res.send("e commerse app is running");
const data={
    username:"nitesh saini",
    posts:20,
    followers:3,
    following:32
}
const followers=["Amit","Vishal","Mohit"]
// const ap=12
res.render("home.ejs",{data,followers})
});
app.get('/learn',(req,res)=>{
    res.render("learnEJS")
})
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get('/register',(req,res)=>{
    res.render("register")
})
app.get("/store",async(req,res)=>{
    let products=await ProductModel.find().populate("user","name")
    // console.log(products)
    res.render("productList",{products})
})

app.use(errorHandler);
export { app };
