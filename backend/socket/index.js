const socketIo = require('socket.io');
const { sequelize } = require('../models');
const users = new Map();
const userSockets = new Map();
const Message = require('../models').Message;
const SocketServer = (server)=>{
    const io = socketIo(server,{
        cors:{
            origin:'*'
        }
    });
    io.on('connection', (socket)=>{
        socket.on('join',async(user)=>{

            let sockets = []

            if(users.has(user.id)){
                const existingUser = users.get(user.id);
                existingUser.sockets = [...existingUser.sockets,[...socket.id]];
                users.set(user.id,existingUser);
                sockets = [...existingUser.sockets,[...socket.id]];
                userSockets.set(socket.id,user.id)
            }else{
                users.set(user.id,{id:user.id,sockets:[socket.id]});//socket are here if user logs in to our application from different devices or web browsers
                sockets.push(socket.id);
                userSockets.set(socket.id,user.id)
            }

            const onlineFriends = []; //ids
            const chatters = await getChatters(user.id) //all the users our user is talking to. type:query

            // notify user's friend that user is online
            for (let i = 0; i < chatters.length; i++) {
                if (users.has(chatters[i])) {
                    const chatter = users.get(chatters[i])
                    chatter.sockets.forEach(socket => {
                        try {
                            io.to(socket).emit('online', user)
                        } catch (e) { }
                    })
                    onlineFriends.push(chatter.id)
                }
            }
            //notify user that which friend is online

            sockets.forEach(socket=>{
                try{
                    io.to(socket).emit('friends',onlineFriends);
                }catch(e){
                    io.send(e)
                }
            });

            console.log("New User Joined: ",user.firstName);
        });
        
        socket.on("message", async (message)=>{
            let sockets = [];

            if(users.has(message.fromUser.id)){
                sockets = users.get(message.fromUser.id).sockets;
            };

            message.toUserId.forEach(id=>{
                if(users.has(id)){
                    sockets = [...sockets,...users.get(id).sockets];
                }

            });

            try {
                const msg = {
                    type: message.type,
                    fromUserId:message.fromUser.id,
                    chatId:message.chatId,
                    message: message.message
                }
                const savedMessage = await Message.create(msg);

                message.User = message.fromUser;
                message.fromUserId = message.fromUser.id;
                message.id = savedMessage.id;
                message.message = savedMessage.message;
                delete message.fromUser;

                sockets.forEach(socket=>{
                    io.to(socket).emit("recieved",message)
                })
            } catch (e) {
                
            }
        })

        socket.on('disconnect',async ()=>{
        //     users.forEach((user,key)=>{
        //         user.socket.forEach(socket=>{
        //             if(socketUser === socket.id){

        //             }
        //         })
        //     })
        // });

        if(userSockets.has(socket.id)){
            const user = await users.get(userSockets.get(socket.id));

            if(user.sockets.length > 1){
                user.sockets = user.sockets.filter(sock=>{
                    if(sock !== socket.id) return true;

                    userSockets.delete(sock)
                    return false;
                    //when we return true the item has is being filter will be returned and when 
                    // we return false it will be removed from return
                });
                users.set(user.id,user)

            }else{
                const chatters = await getChatters(user.id);
                for( let i = 0;i < chatters.length;i++) {
                    if(users.has(chatters[i])){
                        users.get(chatters[i]).sockets.forEach(socket=>{
                            try{
                                io.to(socket).emit('offline',user)
    
                            }catch(e){
    
                            }
                        })
                    }
                };

                userSockets.delete(socket.id);
                users.delete(user.id)
            }
        
        }

    });
    socket.on('typing',(message)=>{
        message.toUserId.forEach(id=>{
            if(users.has(id)){
                users.get(id).sockets.forEach(socket=>{
                    io.to(socket).emit('typing',message)
                })
            }
        })
    });

    socket.on('add-friend',chats=>{
        try {
            let online = 'offline';
            if(users.has(chats[1].Users[0].id)){
                online = 'online';
                chats[0].Users[0].status = 'online';
                users.get(chats[1].Users[0].id).sockets.forEach(socket=>{
                    io.to(socket).emit('new-chat',chats[0])
                })
            }

            if(users.has(chats[0].Users[0].id)){
                online = 'online';
                chats[1].Users[0].status = online;
                users.get(chats[0].Users[0].id).sockets.forEach(socket=>{
                    io.to(socket).emit('new-chat', chats[1])
                })
            }
        } catch (e) {
            console.log(e)
        }
    });

    socket.on('add-user-to-group',({ chat,newChatter })=>{
        if(users.has(newChatter.id)){
            newChatter.status = 'online'
        }

        //? old users
        chat.Users.forEach((user,index)=>{
            if(users.has(user.id)){
                users.has(user.id)  ? user.status = 'online' : user.status = 'offline'
                users.get(user.id).sockets.forEach(socket=>{
                    try {
                        io.to(socket).emit('added-user-to-group',{ chat,chatters:[newChatter] })
                    } catch (e) {
                        
                    }
                })
            }
        });

        //? send to new chatter

        if(users.has(newChatter.id)){
            users.get(newChatter.id).sockets.forEach(socket=>{
                try {
                    io.to(socket).emit('added-user-to-group',{ chat,chatters:chat.Users })
                } catch (e) {
                    
                }
            })
        }
    });

    socket.on('leave-current-chat',(data)=>{
        const{ chatId,userId,currentUserId,notifyUsers } = data

        notifyUsers.forEach(id=>{
            if(users.has(id)){
                users.get(id).sockets.forEach(socket=>{
                    try {
                        io.to(socket).emit('remove-user-from-chat',{ chatId,userId,currentUserId })
                    } catch (error) {
                        
                    }
                })
            }
        })
    });

    socket.on('delete-chat',(data)=>{
        const { chatId,notifyUsers } = data;

        notifyUsers.forEach(id=>{
            if(users.has(id)){
                users.get(id).sockets.forEach(socket=>{
                    try {
                        // this + symbol here is shorthand for parseInt
                        io.to(socket).emit('deleted-chat', parseInt(chatId))
                    } catch (e) {
                        console.log(e)
                    }
                })
            }
        })
    })
    
})};
const getChatters = async (userId) => {
    try {

        const [results, metadata] = await sequelize.query(`
        select "cu"."userId" from "ChatUsers" as cu
        inner join (
            select "c"."id" from "Chats" as c
            where exists (
                select "u"."id" from "Users" as u
                inner join "ChatUsers" on u.id = "ChatUsers"."userId"
                where u.id = ${parseInt(userId)} and c.id = "ChatUsers"."chatId"
            )
        ) as cjoin on cjoin.id = "cu"."chatId"
        where "cu"."userId" != ${parseInt(userId)}
    `)

        return results.length > 0 ? results.map(el => el.userId) : []

    } catch (e) {
        console.log(e);
        return []
    }
}

module.exports = SocketServer;