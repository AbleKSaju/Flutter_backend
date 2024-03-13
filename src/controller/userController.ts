import { Request } from "express";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
import sentOtp from "../utils/nodemailer";
import Product from "../models/productModel";

export const registerUser = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    let userData: any = await User.findOne({ email });
    if (userData) {
      return res.json({ status: false, message: "user already exist" });
    } else {
      await sentOtp(req, res);
    }
  } catch (error) {
    res.json({ status: false, message: "Invalid Data" });
  }
};

export const verifyOtp = async (req: any, res: any) => {
  const { otp, oldotp } = req.body;
  if (otp == oldotp) {
    const { firstname, lastname, email, password, mobile }: any = req.body;
    let name = firstname + " " + lastname;
    const hashpassword: any = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashpassword,
      mobile,
    });
    await newUser.save();
    res.status(200).json({ status: true, newUser, message: "Otp verified" });
  } else {
    res.json({ status: false, message: "Otp not match" });
  }
};

export const userLogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    let userData: any = await User.findOne({ email });
    if (userData) {
      let verified = await verifyPassword(password, userData.password);
      if (verified) {
        let token = await generateToken(res, userData);
        res.json({
          status: true,
          token: token,
          message: "Login success",
          // _id: userData._id,
          // name: userData.name,
          // email: userData.email,
          // mobile: userData.mobile,
        });
      } else {
        res.json({ status: false, message: "Password is wrong" });
      }
    } else {
      res.json({ status: false, message: "User Not Found" });
    }
  } catch (error) {
    res.json({ status: false, message: "userData not exist" });
  }
};

export const addToCart = async (req: any, res: any) => {
  try {
    const { id, size } = req.params;
    const user: any = await User.findById(req.user.payload.id);

    const itemExists = user.cart.some((item: any) => item.id === id);

    if (itemExists) {
      return res.json({ status: false, message: "Item already exists" });
    }
    const response = await User.findByIdAndUpdate(
      req.user.payload.id,
      { $addToSet: { cart: { id: id, size: size } } },
      { new: true }
    );

    if (response) {
      res.json({ status: true, message: "Product added to cart" });
    } else {
      res.json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const getProductDetail = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const productData = await Product.findById(id);
    if (productData) {
      res.json({ status: true, data: productData });
    } else {
      res.json({ status: false, message: "Product Not Found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const getProductsOfCategory = async (req: any, res: any) => {
  try {
    const { category } = req.params;
    console.log(category, "Catttt");
    const productData = await Product.find({ category: category });
    console.log(productData, "productDataproductData");

    if (productData) {
      res.json({ status: true, data: productData });
    } else {
      res.json({ status: false, message: "Product Not Found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const getCart = async (req: any, res: any) => {
  try {
    let datas: any[] = [];
    const userResponse: any = await User?.findOne({ _id: req.user.payload.id });

    await Promise.all(
      userResponse?.cart?.map(async (cartItem: any) => {
        const productResponse: any = await Product?.findOne({
          _id: cartItem.id,
        });
        const productDetails: any = { ...productResponse };
        if (cartItem?.size) {
          productDetails._doc.size = cartItem.size;
        }
        datas.push(productDetails._doc);
      })
    );

    if (datas) {
      res.status(200).json({ status: true, datas });
    } else {
      res.json({ status: false, message: "Cart not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const addWishList = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user: any = await User.findById(req.user.payload.id);
    const response = await User.findByIdAndUpdate(
      req.user.payload.id,
      { $addToSet: { wishlist: id } },
      { new: true }
    );
    if (response) {
      res.json({ status: true, message: "Product added to wishlist" });
    } else {
      res.json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const getWishLists = async (req: any, res: any) => {
  console.log("getWishLists");

  const userResponse: any = await User.findOne({ _id: req.user.payload.id });
  console.log(userResponse.wishlist, "userResponseuserResponse");
  let datas: any = [];
  await Promise.all(
    userResponse?.wishlist?.map(async (items: any) => {
      const productResponse: any = await Product?.findOne({ _id: items });
      let productDetails: any = { ...productResponse };
      datas.push(productDetails._doc);
    })
  );
  console.log(datas, "DATAASS");

  if (datas.length) {
    res.json({ statue: true, data: datas });
  } else {
    res.json({ status: false, message: "Wishlist not found" });
  }
};

export const addAddress = async (req: any, res: any) => {
  try {
    console.log(req.body, "BODY");

    const response = await User.findByIdAndUpdate(
      req.user.payload.id,
      { $push: { address: req.body } },
      { new: true }
    );
    if (response) {
      res.json({ status: true, message: "Address Created Success" });
    } else {
      res.json({ status: false, message: "Address Error" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const getAddress = async (req: any, res: any) => {
  try {
    const userResponse: any = await User.findOne({ _id: req.user.payload.id });
    console.log(userResponse.address, "userResponseuserResponse");

    if (userResponse.length) {
      res.json({ statue: true, data: userResponse.address });
    } else {
      res.json({ status: false, message: "Address not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const deleteWishlist = async (req: any, res: any) => {
  console.log("I am deleteWishlist");

  console.log(req.params, "iddd");
  const { id } = req.params;
  console.log(req.user.payload.id, "req.user.payload.id");

  await User.findByIdAndUpdate(
    req.user.payload.id,
    { $pull: { cart: { id: id } } },
    { new: true }
  )
    .then((data) => {
      console.log(data, "dtaaaaa");

      res.json({ status: true, message: "Wishlist deleted" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const deleteCart = async (req: any, res: any) => {
  console.log("I am deleteCart");

  console.log(req.params, "iddd");
  const { id } = req.params;
  console.log(req.user.payload.id, "req.user.payload.id");

  await User.findByIdAndUpdate(
    req.user.payload.id,
    { $pull: { wishlist: id } },
    { new: true }
  )
    .then((data) => {
      console.log(data, "dtaaaaa");

      res.json({ status: true, message: "Wishlist deleted" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const logOut = (req: any, res: any) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: false,
      expires: new Date(0),
    });
    res.json({ message: "logout success" });
  } catch (error) {
    res.json({ message: "logout failed" });
  }
};
