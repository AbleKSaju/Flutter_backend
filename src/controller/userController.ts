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
  console.log("ENTER TO VERIFY");  
    const { otp} = req.body;
    if (otp) {
        const { firstname, lastname, email, password, mobile } = req.body.data;
        let name = firstname + " " + lastname;
        const hashpassword = await hashPassword(password);
        const newUser = new User({
          name,
          email,
          password: hashpassword,
          mobile,
        });
        await newUser.save();
        res.status(200).json(newUser);
      } else {
        res.json("Otp not match");
      }
  }

  export const userLogin=async (req:any, res:any) => {
    try {
      const { email, password } = req.body;
      let userData:any = await User.findOne({ email });
      if (userData) {
        let verified = await verifyPassword(password, userData.password);
        if (verified) {
          let token=await generateToken(res, userData);          
          res.json({
            token:token,
            message:"Login success"
            // _id: userData._id,
            // name: userData.name,
            // email: userData.email,
            // mobile: userData.mobile,
          });
        } else {
          res.json({status:false , message:"Password is wrong"});
        }
      } else {
        res.json({status:false , message:"User Not Found"});
      }
    } catch (error) {
      res.json({status:false , message:"userData not exist"});
    }
  }


export const logOut = (req:any, res:any) => {
  try {
    
    res.cookie('jwt','',{
      httpOnly:false,
      expires:new Date(0)
    })
    res.json({message:'logout success'})

    
} catch (error) {
    res.json({message:"logout failed"})
}
  };