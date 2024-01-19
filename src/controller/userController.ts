import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
import sentOtp from "../utils/nodemailer";

export const registerUser=async (req:any, res:any) => {
    try {
      const { email } = req.body;
      let userData: any = await User.findOne({ email });
      if (userData) {
        return res.json({message:"user already exist"});
      } else {
        await sentOtp(req, res);
      }
    } catch (error) {
      res.json({message:"Invalid Data"});
    }
  }

export const verifyOtp=async (req: any, res:any) => {
    const { otp } = req.body;
    if (otp) {
      if (otp == req.session.userOTP) {
        const { firstname, lastname, email, password, mobile } =
          req.session.userData;
        let name = firstname + " " + lastname;
        const hashpassword = await hashPassword(password);
        const newUser = new User({
          name,
          email,
          password: hashpassword,
          mobile,
        });
  
        await newUser.save();
        res.status(201).json(newUser);
      } else {
        res.json("Otp not match");
      }
    } else {
      res.json("Otp Not Found");
    }
  }

  export const userLogin=async (req:any, res:any) => {
    try {
      const { email, password } = req.body;
      let userData:any = await User.findOne({ email });
      if (userData) {
        let verified = await verifyPassword(password, userData.password);
        console.log(verified, "vero");
        if (verified) {
          let token=await generateToken(res, userData);
          console.log(token,"tokn");
          
          res.json({
            token,
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
          });
        } else {
          res.json({message:"Password is wrong"});
        }
      } else {
        res.json("User Not Found");
      }
    } catch (error) {
      res.json("userData not exist");
    }
  }






export const logOut = (req:any, res:any) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json("User is loged OUT");
  };