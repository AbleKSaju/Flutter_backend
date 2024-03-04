import express from "express";
import authMiddleware from "../utils/authMiddleware";
import { addToCart, addWishList, deleteCart, getCart, getProductDetail, getWishLists, logOut, registerUser, userLogin, verifyOtp } from "../controller/userController";
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Enter");
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

router.delete("/deleteWishList/:id", authMiddleware, deleteCart);

router.get("/getProductDetail/:id", getProductDetail);

router.get('/logout',logOut)

export default router;
