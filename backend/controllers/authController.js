const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const { validationResult } = require('express-validator')

exports.login = async(req, res, next)=>{
    const {email,password}= req.body;

    try{
        
        const secret = require('crypto').randomBytes(64).toString('hex'); //this is our secret key containing of 64 random numbers and letters

        //? find the user
        const user = await User.findOne({
            where:{
                email:email
            }
        });
        //! check if user exists

        if(!user) return res.status(404).json({message:"No user exists with this email"});

        //* check if password matches

        if(!bcrypt.compareSync(password,user.password)) return res.status(401).json({message:"Incorrect Password"})

        // generate auth tokens

        const userWithToken = generateToken(user.get({raw:true})); // because our user is a sequelized model the payload cannot take it that's why we have to convert into raw so that payload can accept it.It can be done by .get({raw:true}) method
        userWithToken.user.avatar = user.avatar;//because we are using raw:True it returns plain JS Object that's why it cant sequelize the custom get in user model. So we have to set avatar manually.
        return res.send(userWithToken);
    }catch(e){
        return res.status(500).json({message:e.message})

    }
}
exports.register = async(req, res, next)=>{

    
    try{
        const user = await User.create(req.body);
        const userWithToken = generateToken(user.get({ raw:true })); // because our user is a sequelized model the payload cannot take it that's why we have to convert into raw so that payload can accept it.It can be done by .get({raw:true}) method
        return res.send(userWithToken);

    }catch(e){
        return res.send(500).json({message:e.message});
    }
}

const generateToken = (user)=>{
    delete user.password;
    const token = jwt.sign(user,config.appKey,{
        expiresIn: 8640000
    })

    return {...{ user },...{ token } }
}