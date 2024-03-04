
import jwt from 'jsonwebtoken';

 const authMiddleware=(req:any, res:any, next:any)=>{
    console.log("IAAA UUUU");
    
    const authToken = req.headers.authorization;
    console.log(authToken,"authToken");
    if (authToken) {
        try {
          // Step 4: Token Retrieval and Verification
          const decoded = jwt.verify(authToken, "abc123");
          console.log(decoded,"decoded");
          
          req.user = decoded; // Attach user information to the request objectlog
          console.log(req.user,"req.user");
          
          next();
        } catch (err) {
          res.status(401).json({ message: 'Invalid token' });
        }
      } else {
        res.status(401).json({ message: 'No token provided' });
      }
}
export default authMiddleware
