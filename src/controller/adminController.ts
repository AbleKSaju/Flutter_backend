import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import { verifyPassword } from "../utils/hashPassword";
import Order from "../models/orderModel";

export const adminLogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    let adminData: any = await User?.findOne({ email });
    if (adminData?.isAdmin == true) {
      let verified = await verifyPassword(password, adminData.password);
      if (verified) {
        let token = await generateToken(res, adminData);
        res.cookie("jwt", token, { httpOnly: true });
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

export const getSearchedProducts = async (req: Request, res: Response) => {
  const { product } = req.params;
  const searchData = await Product.find({
    $or: [
      {
        name: { $regex: new RegExp("^" + product, "i") },
      },
    ],
  }).then((data: any) => {
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

export const toggleCategoryBlockedStatus = async (req: Request,res: Response) => {
  const { id } = req.params;
  try {
    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Brand not found" });
    }
    // Toggle the blocked status
    const newBlockedStatus = !category.blocked;
    // Update the category's blocked status
    await Category.findByIdAndUpdate(id, { blocked: newBlockedStatus });

    res.status(200).json({
      message: "Brand status updated",
      blocked: newBlockedStatus,
    });
  } catch (err) {
    res.json({ status: false, data: err, message: "Error occurred" });
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

export const toggleProductBlockedStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }
    // Toggle the blocked status
    const newBlockedStatus = !product.blocked;
    // Update the product's blocked status
    await Product.findByIdAndUpdate(id, { blocked: newBlockedStatus });
    res.status(200).json({ message: "Product status updated", blocked: newBlockedStatus });
  } catch (err) {
    res.json({ status: false, data: err, message: "Error occurred" });
  }
};

export const editProduct = async (req: any, res: Response) => {
  try {
    const { id, name, description, price, stock, category } = req.body;
    const data = await Product.findOne({ _id: id }).lean();
    if (data) {
      if (req.files) {
        const data = await Product.findByIdAndUpdate(
          id,
          {
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
          },
          { new: true }
        );
        res.json({ status: true, message: "Prodict Edited" });
      } else {
        await Category.findByIdAndUpdate(
          id,
          { name, description, price, stock, category },
          { new: true }
        );
        res.status(200).json({ status: true, message: "Prodict Edited" });
      }
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Error occur" });
  }
};

export const getAllOrders = async (req: any, res: any) => {
  const orders: any = await Order.find();
  let datas: any = {};
  let AllDatas: any = [];
  // let addressData: any;
  const all = await Promise.all(
    orders?.map(async (order: any) => {
      const productPromises = await order.productDetails.map(
        async (product: any) => {
          return await Product.findOne({ _id: product.id });
        }
      );
      const productResponses: any[] = await Promise.all(productPromises);
      const validProducts: any = productResponses.filter(
        (product) => product !== null
      );
      const addressData: any = await User.find({
        _id: order.userId,
        "address._id": order.addressId,
      });

      const selectedAddress = await addressData?.address?.find(
        (val: any) => val._id == order.addressId
      );
      const totalPrice = validProducts.reduce(
        (tot: any, val: any) => tot + val.price,
        0
      );

      const userData: any = await User.findOne({ _id: order.userId });

      datas.products = [];
      datas.products.push(validProducts[0]);
      datas.userName = userData.name;
      datas.email = userData.email;
      datas.mobile = userData.mobile;
      datas._id = order._id;
      datas.curentStatus = order.status;
      datas.paymentMethod = order.paymentMethod;
      datas.totalPrice = totalPrice;
      AllDatas.push(datas);
      datas = {};
    })
  );

  if (AllDatas) {
    AllDatas.sort(
      `(a: any, b: any) => a.products.createdAt - b.products.createdAt
    );
    res.json({ status: true, data: AllDatas });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};

export const changeStatus = async (req: any, res: any) => {
  const { orderStatus }: any = req.body;
  const { id }: any = req.body;
  const orderData = await Order.findByIdAndUpdate(id, { status: orderStatus });

  if (orderData) {
    res.json({ status: true, message: "Status changed" });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};
