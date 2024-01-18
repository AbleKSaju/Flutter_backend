import jwt from 'jsonwebtoken';

const generateToken = (res: any, userid: string) => {
    const token = jwt.sign({ userid }, 'abc123', {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;
