import jwt from 'jsonwebtoken';

const generateToken = (res: any, userData: any) => {
    console.log("Enter");
    
    const payload={
        id:userData._id,
        email:userData.email,
        name:userData.name,
        mobile:userData.mobile
    }
    const token = jwt.sign(payload, 'jwtSecret', {
        expiresIn: '30d'
    });
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token
};

export default generateToken;
