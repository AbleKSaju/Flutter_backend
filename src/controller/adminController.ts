import Category from "../models/categoryModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import { verifyPassword } from "../utils/hashPassword";

export const adminLogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    let adminData: any = await User?.findOne({ email });
    if (adminData?.isAdmin == true) {
      let verified = await verifyPassword(password, adminData.password);
      console.log(verified, "vero");
      if (verified) {
        let token=await generateToken(res, adminData._id);
        console.log(token,"token");
        res.json({
            token,
          _id: adminData?._id,
          name: adminData?.name,
          email: adminData?.email,
          mobile: adminData?.mobile,
        });
      } else {
        res.json("Password is wrong");
      }
    } else {
      res.json("You are not a Admin");
    }
  } catch (error) {
    res.json("adminData not exist");
  }
};

export const addCategory = async (req: any, res: any) => {
  try {
    console.log("success");
    
    const { name } = req?.body;
    let categoryData = await Category?.findOne({ name });
    if (categoryData) {
      return res.json("category already exist");
    }
    await Category?.create({
      name: name,
    });
    res.json("category created");
  } catch (error) {
    res.json("Error Occur");
  }
};

export const addProduct = async (req: any, res: any) => {
  const { name, description, price, stock, category } = req.body;
  const productData = await Product?.findOne({ name });
  if (productData) {
    return res.json("Product exist");
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
    res.json("Product added");
  } else {
    res.json("Category not found");
  }
};
