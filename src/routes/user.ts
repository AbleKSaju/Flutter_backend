import express from "express";
import authMiddleware from "../utils/authMiddleware";
import { addAddress, addToCart, addWishList, cancelOrder, createOrder, createSingleProductOrder, deleteAddress, deleteCart, deleteWishlist, editAddress, editQuantityInCart, getAddress, getCart, getOrderDetails, getOrders, getProductDetail, getProductsOfCategory, getWishLists, logOut, registerUser, userLogin, verifyOtp } from "../controller/userController";
 const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello World");
});

router.post("/register",registerUser);

router.post("/verifyOtp", verifyOtp);

router.post("/login", userLogin);

router.post("/addToCart/:id/:size", authMiddleware, addToCart);

router.delete("/deleteCart/:id", authMiddleware, deleteCart);

router.get("/getCart",authMiddleware, getCart);

router.post("/addWishList/:id",authMiddleware, addWishList);

router.get("/getWishList",authMiddleware, getWishLists);

router.post("/addAddress",authMiddleware, addAddress);

router.put("/editAddress",authMiddleware, editAddress);

router.get("/getAddress",authMiddleware, getAddress);

router.delete("/deleteAddress/:id",authMiddleware, deleteAddress);

router.delete("/deleteWishList/:id", authMiddleware, deleteWishlist);

router.get("/getProductDetail/:id", getProductDetail);

router.get("/getProducts/:category", getProductsOfCategory);

router.post("/editQuantity",authMiddleware, editQuantityInCart);

router.post("/placeOrder",authMiddleware, createOrder);

router.post("/cancelOrder/:id",authMiddleware, cancelOrder);

router.post("/placeSingleProductOrder",authMiddleware, createSingleProductOrder);

router.get("/getOrders",authMiddleware, getOrders);

// router.get("/getAllOrders",authMiddleware, getAllOrders);

router.get('/getOrderDetails/:id',authMiddleware,getOrderDetails)

router.get('/logout',logOut)

export default router;