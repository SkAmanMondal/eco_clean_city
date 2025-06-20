const Auth = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//token generate
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
};
//register
exports.registeruser = async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const userexists = await Auth.findOne({email});
        if(userexists) return res.status(400).json({message:"user already exists"});

        const hashedpassword = await bcrypt.hash(password,10);

        const user = await Auth.create({name,email,password:hashedpassword});
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        });
    } catch(err) {
        res.status(500).json({message:"server error"});
    }
}
//login
exports.loginuser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await Auth.findOne({email});
        if(!user) return res.status(400).json({message:"invalid credential"});

    const isMatch = await bcrypt.compare(password,user.password);
     if(!isMatch) return res.status(400).json({message:"invalid credential"});

        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        });
    } catch(err) {
        res.status(500).json({message:"server error"});
    }
}
//protected
exports.getme = async(req,res)=>{
    const user = await Auth.findById(req.user.id).select('-password');
    res.status(201).json(user);
}











