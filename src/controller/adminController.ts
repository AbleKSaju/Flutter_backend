import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import { verifyPassword } from "../utils/hashPassword";

export const adminLogin = async (req: any, res: any) => {
  try {
    console.log("ENter to admin");
    const { email, password } = req.body;
    let adminData: any = await User?.findOne({ email });
    if (adminData?.isAdmin == true) {
      let verified = await verifyPassword(password, adminData.password);
      console.log(verified, "vero");
      if (verified) {
        let token = await generateToken(res, adminData);
        console.log(token, "token");
        res.json({
          status: true,
          token: token,
          message: "Login success",
          // _id: adminData?._id,
          // name: adminData?.name,
          // email: adminData?.email,
          // mobile: adminData?.mobile,
        });
      } else {
        res.json({ status: false, message: "Password is wrong" });
      }
    } else {
      res.json({ status: false, message: "You are not a Admin" });
    }
  } catch (error) {
    res.json({ status: false, message: "adminData not exist" });
  }
};

export const addCategory = async (req: any, res: any) => {
  try {
    console.log("success");
    console.log(req.file);

    const { name } = req?.body;
    let categoryData = await Category?.findOne({ name });
    if (categoryData) {
      return res.json({ status: false, message: "category already exist" });
    }
    await Category?.create({
      name: name,
      image: req.file.filename,
    });
    res.json({ status: true, message: "category created" });
  } catch (error) {
    res.json({ status: false, message: "Error Occur" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  await Category.find()
    .lean()
    .then((data: any) => {
      if (data.length) {
        data.reverse();
        res.json({ status: true, data: data });
      } else {
        res.json({ status: false, message: "No categories found" });
      }
    });
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;
    let image;
    const data = await Category.findById(id).lean();
    if (data) {
      if (req.file) {
        image = req.file.filename;
        await Category.findByIdAndUpdate(id, { name, image }, { new: true });
        res
          .status(200)
          .json({ status: true, message: "Category data changed" });
      } else {
        await Category.findByIdAndUpdate(id, { name }, { new: true });
        res
          .status(200)
          .json({ status: true, message: "Category data changed" });
      }
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error occur" });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.body;
  await Category.findByIdAndDelete({ _id: id })
    .then(() => {
      res.json({ status: true, message: "Category deleted" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Occur" });
    });
};

export const addProduct = async (req: any, res: any) => {
  const { name, description, price, stock, category } = req.body;
  const productData = await Product?.findOne({ name });
  if (productData) {
    return res.json({ status: false, message: "Product exist" });
  }
  let categoryData = await Category.findOne({ name: category }).lean();
  if (categoryData) {
    console.log(req.files, "FILE");

    await Product?.create({
      name,
      description,
      price,
      stock,
      category,
      image: [
        req.files[0].filename,
        req.files[1].filename,
        req.files[2].filename,
        req.files[3].filename,
      ],
    });
    res.json({ status: true, message: "Product added" });
  } else {
    res.json({ status: false, message: "Category not found" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  await Product.find()
    .lean()
    .then((data: any) => {
      if (data.length) {
        data.reverse();
        res.json({ status: true, data: data });
      } else {
        res.json({ status: false, message: "No Products found" });
      }
    });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.body;
  await Product.findByIdAndDelete({ _id: id })
    .then((data) => {
      res.json({ status: true, message: "Product deleted" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Occur" });
    });
};
