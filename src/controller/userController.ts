import { Request } from "express";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
import sentOtp from "../utils/nodemailer";
import Product from "../models/productModel";
import Order from "../models/orderModel";

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
      { $addToSet: { cart: { id: id, size: size, quantity: 1 } } },
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
    let totalPrice = 0;
    const userResponse: any = await User?.findOne({ _id: req.user.payload.id });

    await Promise.all(
      userResponse?.cart?.map(async (cartItem: any) => {
        const productResponse: any = await Product?.findOne({
          _id: cartItem.id,
        });
        console.log(productResponse, "productResponseproductResponse");
        const productDetails: any = { ...productResponse };
        let total = cartItem.quantity * productDetails._doc.price;
        totalPrice += total;

        if (cartItem?.size) {
          productDetails._doc.size = cartItem.size;
          productDetails._doc.quantity = cartItem.quantity;
        }
        datas.push(productDetails._doc);
      })
    );
    const total = await User.findByIdAndUpdate(req.user.payload.id, {
      $set: { totalPriceInCart: totalPrice },
    });
    console.log(total, "TTTTT");

    if (datas) {
      console.log("I AM GET CART TESPONS");

      res.status(200).json({ status: true, datas: datas, totalPrice });
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

export const editAddress = async (req: any, res: any) => {
  try {
    const response: any = await User.findByIdAndUpdate(
      req.user.payload.id,
      { $pull: { address: { _id: req.body._id } } },
      { new: true }
    );
    response.address.push(req.body);
    console.log(response.address, "New response");
    await response.save();
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

    if (userResponse.address) {
      res.json({ statue: true, data: userResponse.address });
    } else {
      res.json({ status: false, message: "Address not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const deleteAddress = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userResponse: any = await User.findOneAndUpdate(
      { _id: req.user.payload.id },
      { $pull: { address: { _id: id } } }
    );
    console.log(userResponse, "userResponseuserResponse");

    if (userResponse) {
      res.json({ statue: true, message: "Address removed" });
    } else {
      res.json({ status: false, message: "Address not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const deleteCart = async (req: any, res: any) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(
    req.user.payload.id,
    { $pull: { cart: { id: id } } },
    { new: true }
  )
    .then((data) => {
      console.log(data, "dtaaaaa");

      res.json({ status: true, message: "Cart item removed" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const editQuantityInCart = async (req: any, res: any) => {
  const productData = await Product.findById(req.body.id);
  console.log(productData, "productDataproductData");

  const stock = productData?.stock;
  if (stock < req.body.value) {
    return res.json({ status: false, message: "0 Stock left" });
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user.payload.id,
    { $set: { "cart.$[element].quantity": req.body.value } },
    { new: true, arrayFilters: [{ "element.id": req.body.id }] }
  )
    .then(async (data) => {
      const UserData = await User.findById(req.user.payload.id);

      console.log(data, "dtaaaaa");
      res.json({ status: true, message: "Quantity Changed" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const deleteWishlist = async (req: any, res: any) => {
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

      res.json({ status: true, message: "Wishlist item removed" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const createOrder = async (req: any, res: any) => {
  const { addressId, paymentMethod } = req.body;
  const userResponse: any = await User?.findOne({ _id: req.user.payload.id });
  console.log(userResponse, "userResponse");

  const newOrder = await Order?.create({
    productDetails: userResponse.cart,
    userId: req.user.payload.id,
    addressId: addressId,
    paymentMethod: paymentMethod,
    status: "pending",
  });

  if (newOrder) {
    await User.findByIdAndDelete(req.user.payload.id, { cart: 1 });
    res.json({ status: true, message: "Order Created" });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};

export const cancelOrder = async (req: any, res: any) => {
  const { orderId } = req.body;
  const orderCanelled: any = await Order?.findByIdAndUpdate(
    { _id: orderId },
    { $set: { status: "cancelled" } }
  );

  if (orderCanelled) {
    res.json({ status: true, message: "Order Cancelled" });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};

export const getOrders = async (req: any, res: any) => {
  console.log("I AM getOrders");

  try {
    const userResponse: any = await Order.find({ userId: req.user.payload.id });
    let datas: any = {};
    let AllDatas: any = [];
    let addressData: any;

    const all = await Promise.all(
      userResponse?.map(async (order: any) => {
        const productPromises = await order.productDetails.map(
          async (product: any) => {
            return await Product.findOne({ _id: product.id });
          }
        );
        const productResponses: any[] = await Promise.all(productPromises);
        const validProducts = productResponses.filter(
          (product) => product !== null
        );
        addressData = await User.find({
          _id: req.user.payload.id,
          "address._id": order.addressId,
        });
        datas.products = [];
        console.log(addressData, "addressDataaddressData");

        const selectedAddress = await addressData[0].address.find(
          (val: any) => val._id == order.addressId
        );
        await Promise.all(
          validProducts.map(async (product) => {
            console.log(product, "productproduct");
            await datas.products.push(product);
          })
        );

        console.log(order.status, "order.status");
        datas._id = order._id;
        datas.curentStatus = order.status;
        datas.paymentMethod = order.paymentMethod;
        datas.totalPrice = addressData[0]?.totalPriceInCart;
        datas.address = selectedAddress;
        AllDatas.push(datas);
        datas = {};
      })
    );

    if (AllDatas) {
      res.json({ statue: true, data: AllDatas });
    } else {
      res.json({ status: false, message: "Address not found" });
    }
  } catch (error) {
    res.json({ status: false, message: error });
  }
};

export const getOrderDetails = async (req: any, res: any) => {
  const { id } = req.params;
  const order: any = await Order.findById(id);
  
  const orderDetails: any = [];
  await Promise.all(order.productDetails.map(async (product: any) => {
      let productDetails = await Product.findOne({ _id: product.id });
      if (productDetails) {
          productDetails = {
              ...productDetails.toObject(),
              status: order.status,
              size: product.size,
              quantity: product.quantity,
          };
          orderDetails.push(productDetails);
      }
  }));

  const addressData: any = await User.find(
    {
      _id: req.user.payload.id,
      "address._id": order.addressId,
    },
    { "address.$": 1 }
  );  
  orderDetails.address = addressData[0].address;
  
  if (orderDetails) {
    console.log(orderDetails,"orderDetailsorderDetails");
    res.json({ status: true, message: "Status changed", data: orderDetails });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
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
