import jwt from 'jsonwebtoken';

const generateToken = async(res: any, userData: any) => {
    
    const payload={
        id:userData._id,
        email:userData.email,
        name:userData.name,
    }

    const token = jwt.sign({payload} , 'abc123', {
        expiresIn:'30d'
    })

    await res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token
};

export default generateToken;
