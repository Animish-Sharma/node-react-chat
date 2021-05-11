const jwt = require('jsonwebtoken');
const config = require('../config/app');


exports.auth=(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        res.status(401).json({error:"Missing Token"});
    };
    jwt.verify(token,config.appKey,(err,user)=>{
        if(err) return res.status(401).json({ error:err });
        req.user = user;
    });
    next();
}