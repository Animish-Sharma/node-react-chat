const User = require('../models').User;
const sequelize = require('sequelize');


exports.update=async(req,res)=>{

    if(req.file){
        req.body.avatar = req.file.filename;
    };
    if(typeof req.body.avatar !== 'undefined' && req.body.avatar.length ===0) delete req.body.avatar;

    try{
        const [rows,result]=await User.update(req.body,{
            where:{
                id:req.user.id,
            },
            returning:true,
            individualHooks:true
        });

        const user = result[0].get({ raw:true });
        user.avatar = result[0].avatar;
        delete user.password;

        return res.send(user);

    }catch(e){
        res.status(500).json({ error:e.message });
    };

    res.send("User Updated Succesfully");
};

exports.search =async (req,res)=>{
    try {
        const users = await User.findAll({
            where:{
                // by using sequelize Op or we can search the user by first name, last name and email
                [sequelize.Op.or]:{
                    // namesConcated will join first and last name for eg if someone's first and last name is 'Animish' and 'Sharma' it will concat it as 'Animish Sharma'
                    namesConcated: sequelize.where(
                        // sequelize fn means function concat and sequelize col means column in database
                        sequelize.fn('concat',sequelize.col('firstName') , ' ', sequelize.col('lastName')),
                        {
                            // in these brackets operators will perform to find user
                            // sequelize.Op.iLike is the function which does not care for upper aur lowercase for iLike animish = Animish = ANIMISH
                            [sequelize.Op.iLike]: `%${req.query.term}%`
                        }
                    ),
                    email:{
                        // there are % beacuse it will be a get request and data will be in url surrounded with %
                        [sequelize.Op.iLike]: `%${req.query.term}%` 
                    }
                },
                [sequelize.Op.not]:{
                    // OP not is used to exclude us (user who is sending search requests)
                    id: `${req.user.id}`
                }
            },
            limit:10
        })

        return res.status(200).json(users)
        
    } catch (e) {
        return res.status(500).json({ error:e.message });
    }
}