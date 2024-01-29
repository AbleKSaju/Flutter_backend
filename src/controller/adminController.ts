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
          status:true,
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

    const { name } = req?.body;
    let categoryData = await Category?.findOne({ name });
    if (categoryData) {
      return res.json({ status: false, message: "category already exist" });
    }
    await Category?.create({
      name: name,
    });
    res.json({ status: true, message: "category created" });
  } catch (error) {
    res.json({ status: false, message: "Error Occur" });
  }
};

export const addProduct = async (req: any, res: any) => {
  const { name, description, price, stock, category } = req.body;
  const productData = await Product?.findOne({ name });
  if (productData) {
    return res.json({ status: false, message: "Product exist" });
  }
  let categoryData = await Category.findOne({ name: category }).lean();
  if (categoryData) {
    await Product?.create({
      name,
      description,
      price,
      stock,
      category,
    });
    res.json({ status: true, message: "Product added" });
  } else {
    res.json({ status: false, message: "Category not found" });
  }
};
