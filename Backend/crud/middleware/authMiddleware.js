const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

const protect = async(req,res,next) => {
    let token;
    if(
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await Auth.findById(decoded.id).select('-password');
            next();
        } catch(err) {
            res.status(401).json({message:"token failed"});
        }
    }
    if(!token) {
         res.status(401).json({message:"token failed"});
    }
};
module.exports = protect;