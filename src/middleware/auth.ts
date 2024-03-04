import jwt from "jsonwebtoken";

const verifyToken = async(token: any) => {
  console.log("Enter to ver tojeken");
  
  try {
    const decoded = await jwt.verify(token, "abc123");
    console.log(decoded ,"from verify token");
    
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const authMiddlewareForAdmin = async (req: any, res: any, next: any) => {
  console.log("Enter to auth");
  
  const authorizationHeader = req.headers.authorization;
const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : null;
console.log(token,"TOKKKK");
  
  if (token) {
    try {
      const decoded = await verifyToken(token);
      console.log(decoded,"deed");
      
      req.user = decoded;
      next();
    } catch (error: any) {
      res.status(401).json({ status: false, message: error.message });
    }
  } else {
    res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

export default authMiddlewareForAdmin;
