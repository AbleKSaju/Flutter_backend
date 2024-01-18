import express from "express";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Enter");
  res.json("Hello World");
});

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, mobile } = req.body;
    let name = firstname + " " + lastname;
    let userData: any = await User.findOne({ email });
    if (userData) {
      return res.json("user already exist");
    } else {
      const hashedPassword = await hashPassword(password);
      const user: any = await User.create({
        name,
        email,
        password: hashedPassword,
        mobile,
      });
      if (user) {
        await generateToken(res, user._id);
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      } else {
        throw new Error("Invalid user data");
      }
    }
  } catch (error) {
    res.json("Invalid Data");
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log(req.body, "body");

    const { email, password } = req.body;
    let userData: any = await User.findOne({ email });
    if (userData) {
      let verified = await verifyPassword(password, userData.password);
      console.log(verified, "vero");
      if (verified) {
        await generateToken(res, userData._id);
        res.json({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          profileImage: userData.mobile,
        });
      } else {
        res.json("Password is wrong");
      }
    } else {
      res.json("User Not Found");
    }
  } catch (error) {
    res.json("userData not exist");
  }
});

export default router;
