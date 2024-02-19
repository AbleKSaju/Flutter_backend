import express from "express";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
import sentOtp from "../utils/nodemailer";
import { logOut, registerUser, userLogin, verifyOtp } from "../controller/userController";
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Enter");
  res.json("Hello World");
});

router.post("/register",registerUser);

router.post("/verifyOtp", verifyOtp);

router.post("/login", userLogin);

router.get('/logout',logOut)

export default router;
