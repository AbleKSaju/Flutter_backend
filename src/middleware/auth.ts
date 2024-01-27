import jwt from "jsonwebtoken";

const verifyToken = (token: any) => {
  try {
    const decoded = jwt.verify(token, "jwtSecret");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const authMiddleware = async (req: any, res: any, next: any) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error: any) {
      res.status(401).json({ status: false, message: error.message });
    }
  } else {
    res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
