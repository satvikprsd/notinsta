import jwt from 'jsonwebtoken';

export const isauthenticated = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: 'No token, authorization denied', success: false});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: 'Token is not valid', success: false});
        req.id = decoded.id;
        next();
    }
    catch(err){
        console.error(err);
    }
};


