import nodemailer from "nodemailer";
import hashPassword from "./hashPassword";

function generateotp() {
  var digits = "1234567890";
  var otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
const sentOtp = async (req: any, res: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
  const otp = generateotp();
  console.log(otp);

  const info = await transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to: req.body.email,
    subject: "Verify Your Account  ✔",
    text: `Your OTP is : ${otp}`,
    html: `<b>
          <h2 style="color: #3498db;">Verify Your Account</h2>
          <p style="font-size: 16px;">Thank you for creating an account! To complete the verification process, use the following OTP:</p>
          <p style="font-size: 24px; font-weight: bold; color: #2ecc71;">Your OTP is: ${otp}</p>
          <p style="font-size: 14px; margin-top: 20px;">Click the button below to verify your email:</p>
          <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #2ecc71; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
        </b>
        `,
  });
  if (info) {
    res.status(200).json({otp:otp, data:req.body, message:"Verify your OTP on your Email"});
  } else {
    res.json({message:"email error"});
  }
};
export default sentOtp;
