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
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
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
    const productData = await Product.find({ category: category });

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

    if (datas) {
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
  const userResponse: any = await User.findById(req.user.payload.id);
  let datas: any = [];
  await Promise.all(
    userResponse?.wishlist?.map(async (items: any) => {
      const productResponse: any = await Product?.findOne({ _id: items });
      let productDetails: any = { ...productResponse };
      datas.push(productDetails._doc);
    })
  );
  if (datas.length) {
    res.json({ statue: true, data: datas });
  } else {
    res.json({ status: false, message: "Wishlist not found" });
  }
};

export const addAddress = async (req: any, res: any) => {
  try {
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
      res.json({ status: true, message: "Cart item removed" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const editQuantityInCart = async (req: any, res: any) => {
  const productData = await Product.findById(req.body.id);

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

      res.json({ status: true, message: "Quantity Changed" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const deleteWishlist = async (req: any, res: any) => {
  const { id } = req.params;

  await User.findByIdAndUpdate(
    req.user.payload.id,
    { $pull: { wishlist: id } },
    { new: true }
  )
    .then((data) => {
      res.json({ status: true, message: "Wishlist item removed" });
    })
    .catch((err) => {
      res.json({ status: false, data: err, message: "Error Found" });
    });
};

export const createOrder = async (req: any, res: any) => {
  const { addressId, paymentMethod } = req.body;
  const userResponse: any = await User?.findOne({ _id: req.user.payload.id });

  const newOrder = await Order?.create({
    productDetails: userResponse.cart,
    userId: req.user.payload.id,
    addressId: addressId,
    paymentMethod: paymentMethod,
    status: "pending",
  });

  if (newOrder) {
    await User.findByIdAndUpdate(req.user.payload.id, { cart: [] });
    res.json({ status: true, message: "Order Created" , orderId:newOrder._id });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};

export const createSingleProductOrder = async (req: any, res: any) => {
  const { addressId, productId, paymentMethod, size } = req.body;

  const productData = {
    id: productId,
    size: size,
    quantity: 1,
  };

  const newOrder = await Order?.create({
    productDetails: productData,
    userId: req.user.payload.id,
    addressId: addressId,
    paymentMethod: paymentMethod,
    status: "pending",
  });

  if (newOrder) {
    res.json({ status: true, message: "Order Created" });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};

export const cancelOrder = async (req: any, res: any) => {
  const { id } = req.params;
  const orderCanelled: any = await Order?.findByIdAndUpdate(
    { _id: id },
    { $set: { status: "cancelled" } }
  );

  if (orderCanelled) {
    res.json({ status: true, message: "Order Cancelled" });
  } else {
    res.json({ status: false, message: "Order Error" });
  }
};

export const getOrders = async (req: any, res: any) => {
  try {
    const orderResponse: any = await Order.find({
      userId: req.user.payload.id,
    }).sort({ createdAt: -1 });
    if (!orderResponse) {
      return res.json({ status: false, message: "Order not found" });
    }
    let datas: any = {};
    let AllDatas: any = [];
    let addressData: any;

    const all = await Promise.all(
      orderResponse?.map(async (order: any) => {
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
        const selectedAddress = await addressData[0].address.find(
          (val: any) => val._id == order.addressId
        );
        await Promise.all(
          validProducts.map(async (product) => {
            await datas.products.push(product);
          })
        );
        datas._id = order._id;
        datas.curentStatus = order.status;
        datas.createdAt = order.createdAt;
        datas.paymentMethod = order.paymentMethod;
        datas.totalPrice = addressData[0]?.totalPriceInCart;
        AllDatas.push(datas);
        datas = {};
      })
    );

    if (AllDatas) {
      AllDatas.sort(
        (a: any, b: any) => a.products.createdAt - b.products.createdAt
      );

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
  await Promise.all(
    order.productDetails.map(async (product: any) => {
      let productDetails = await Product.findOne({ _id: product.id });
      if (productDetails) {
        productDetails = {
          ...productDetails.toObject(),
          deliveryDate: order.deliveryDate,
          status: order.status,
          size: product.size,
          quantity: product.quantity,
        };
        orderDetails.push(productDetails);
      }
    })
  );

  const addressData: any = await User.find(
    {
      _id: order.userId,
      "address._id": order.addressId,
    },
    { "address.$": 1 }
  );
  const address = addressData[0].address[0];
  orderDetails.push(addressData[0].address[0]);
  // orderDetails.hai = "oiii"
  // orderDetails.address.push(address)

  if (orderDetails) {
    res.json({ status: true, message: "Order details", data: orderDetails });
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
