import jwt from "jsonwebtoken";

const authMiddleware = (req: any, res: any, next: any) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    try {
      // Step 4: Token Retrieval and Verification
      const decoded = jwt.verify(authToken, "abc123");

      req.user = decoded; // Attach user information to the request objectlog

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
export default authMiddleware;
