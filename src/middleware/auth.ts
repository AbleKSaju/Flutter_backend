import jwt from "jsonwebtoken"

const verifyToken = (token:any) => {
    try {
        const decoded = jwt.verify(token, "jwtSecret");
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};


const authMiddleware = async (req:any, res:any, next:any) => {
    console.log("enter");
    console.log(req.cookie,"req");
    console.log(req.cookie,"req");
    console.log(req.cookie.jwt,"reqJJJ");
    
    
    let token = req.cookies.jwt;    

    if (token) {
        try {
            const decoded = verifyToken(token);
          
            req.user = decoded;
            console.log("next()");
            
            next();
        } catch (error:any) {
            res.status(401).json({ message: 'Unauthorized', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized', error: 'No token provided' });
    }
};

export default authMiddleware
