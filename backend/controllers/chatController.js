const models = require('../models');
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;
const { sequelize } = require('../models');
const { Op } = require('sequelize');
exports.index = async(req,res)=>{

    const user = await User.findOne({
        where: {
            id:req.user.id
        },
        include:[
            {
                model: Chat,
                include:[
                    {
                        model:User,
                        where:{
                            // Op not is a method of sequelize that stand here for include not what or do not include. In simple words that should not be included
                            [Op.not]:{
                                id:req.user.id
                            }
                        }
                    },
                    {
                        model:Message,
                        include:[
                            {
                                model:User
                            }
                        ],
                        limit: 20,
                        // DESC: Descending. That means here that message will be in descending order of id.
                        order:[["id","DESC"]]
                    }
                ]
            }
        ]
    });
    return res.json(user.Chats);
};

exports.create = async(req,res)=>{

    const { partnerId } = req.body;
    const t = await sequelize.transaction();
    //* transaction is used to rollback any changes if the situation goes wrong.

    try{
        // we are checking if user already has chat with this partner
        const user = await User.findOne({
            where:{
                id:req.user.id
            },
            include:[
                {
                    model:Chat,
                    where:{
                        type:"dual"
                    },
                    include:[
                        {
                            model:ChatUser,
                            where:{
                                userId:partnerId
                            }
                        }
                    ]
                }
            ]
        });
        if(user && user.Chats.length > 0) 
            return res.status(403).json({ status:"Error",message:"Chat with this User already exists" });

        const chat = await Chat.create({ type:'dual' },{ transaction:t });

        await ChatUser.bulkCreate([
            {
                chatId:chat.id,
                userId:req.user.id
            },
            {
                chatId:chat.id,
                userId:partnerId
            }
        ],{ transaction:t });

        await t.commit();

        // const chatNew = await Chat.findOne({
        //     where:{
        //         id:chat.id,
        //     },
        //     include:[
        //         {
        //             model:User,
        //             where:{
        //                 [Op.not]:{
        //                     id:req.user.id
        //                 }
        //             }
        //         },
        //         {
        //             model:Message,
        //             include:[
        //                 {
        //                     model:User
        //                 }
        //             ],
        //         }
        //     ]
        // });

        const creator= await User.findOne({
            where:{
                id:req.user.id
            }
        })
        const partner = await User.findOne({
            where:{
                id: partnerId
            }
        })

        const forCreator={
            id:chat.id,
            type:'dual',
            Users:[partner],
            Messages:[]
        }

        const forReceiver = {
            id:chat.id,
            type:'dual',
            Users:[creator],
            Messages:[]
        }
        
        return res.json([forCreator, forReceiver])

    }catch(e){
        await t.rollback();
        return res.status(500).json({ status:"Error", message:e.message})
    }

};

exports.messages = async(req,res)=>{
    const limit = 10;
    const page = req.query.page || 1;
    //*! offset will be the number of messages to be loaded accoding to page.
    const offset = page > 1 ? page * limit : 0;
    const messages = await Message.findAndCountAll({
        where:{
            chatId:req.query.id
        },
        limit,
        offset,
        order:[["id","DESC"]]
    });
    const totalPages = Math.ceil(messages.count / limit);

    if(page > totalPages) return res.json({data:{ messages:[] }});

    const result = {
        messages:messages.rows,
        pagination:{
            page,
            totalPages
        }
    }
    return res.json(result);
};

exports.imageUpload = async(req,res)=>{
    if(req.file){
        return res.json({url: req.file.filename})
    };
    return res.status(500).json("No image uploaded");
}

exports.addUserToGroup = async(req,res)=>{
    try {

        const { chatId,userId } = req.body

        const chat = await Chat.findOne({
            where:{
                id:chatId,
            },
            include: [
                {
                    model:User
                },
                {
                    model:Message,
                    include:[
                        {
                            model:User
                        }
                    ],
                    limit:20,
                    order:[["id","DESC"]]
                }
            ]
        });

        // check if user is already in group

        chat.Users.forEach(user=>{
            if(user.id === userId){
                return res.status(401).json({message:"User is already in the group"});
            }
        });

        await ChatUser.create({chatId,userId});

        const newChatter = await User.findOne({
            where:{
                id:userId
            }
        });

        if(chat.type === 'dual'){
            chat.type = 'group';
            chat.save();
        }

        return res.json({chat,newChatter});
        
    } catch (e) {
        return res.status(500).json({error:e.message})
    }
}

exports.deleteChat = async(req,res)=>{

    const { id } = req.params;

    try{
        const chat = await Chat.findOne({

            where:{
                id
            },

            include: [
                {
                    model:User
                }
            ]

        });

        const notifyUsers = chat.Users.map(user=>user.id);


        await chat.destroy()

        return res.json({ chatId:id,notifyUsers });

    }catch(e){
        return res.status(500).json({ status:'Error',message:e.message });
    }
}


exports.leaveCurrentChat = async(req,res)=>{

    try {
        const { chatId } = req.body;
    
        const chat = await Chat.findOne({
            where:{
                id:chatId
            },
            include:[
                {
                    model:User
                }
            ]
        });
    
        if(chat.Users.length === 2){
            return res.status(403).json({error:"You cant leave this chat"})
        }
        if(chat.Users.length === 3){
            chat.type='dual';
            await chat.save();
        }

        await ChatUser.destroy({
            where:{
                chatId,
                userId:req.user.id
            }
        });

        await Message.destroy({
            where:{
                chatId,
                fromUserId:req.user.id
            }
        });

        const notifyUsers = chat.Users.map(user=> user.id);

        return res.json({ chatId:chat.id,userId:req.user.id,currentUserId:req.user.id,notifyUsers })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'Error',error:e.message })
    }
}