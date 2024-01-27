import jwt from 'jsonwebtoken';

const generateToken = async(res: any, userData: any) => {
    
    const payload={
        id:userData._id,
        email:userData.email,
        name:userData.name,
    }
    const token = await jwt.sign({payload}, 'jwtSecret', {
        expiresIn: '30d'
    });
    
    await res.cookie('jwt', token, {
        httpOnly: false,
        secure: false,
        sameSite:'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token
};

export default generateToken;
