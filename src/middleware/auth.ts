import jwt from "jsonwebtoken";

const verifyToken = async(token: any) => {  
  try {
    const decoded = await jwt.verify(token, "abc123");    
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const authMiddlewareForAdmin = async (req: any, res: any, next: any) => {  
  const authorizationHeader = req.headers.authorization;
const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : null;  
  if (token) {
    try {
      const decoded = await verifyToken(token);      
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
