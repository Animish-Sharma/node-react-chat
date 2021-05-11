import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { fetchChats,
    onlineFriends,
    onlineFriend,
    offlineFriend,
    setSocket,
    receivedMessage,
    senderTyping,
    createChat,
    addUserToGroup,
    leaveCurrentChat,
    deleteChat
} from '../../../store/actions/chat';

function useSocket(user,dispatch){
    useEffect(()=>{
        
        dispatch(fetchChats())
        .then(res=> {
            const socket = socketIOClient.connect('http://localhost:3000/');


            dispatch(setSocket(socket))

            socket.emit('join',user)
            socket.on('typing',(sender)=>{
                dispatch(senderTyping(sender))
            });

            socket.on('friends',(friends)=>{
                console.log("Friends",friends);
                dispatch(onlineFriends(friends));
            });

            socket.on('online',(online)=>{
                console.log("Online",online);
                dispatch(onlineFriend(online));
            });

            socket.on('offline',(offline)=>{
                console.log("Offline",offline);
                dispatch(offlineFriend(offline));
            });

            socket.on('recieved',(message)=>{
                dispatch(receivedMessage(message,user.id))
            })
            
            socket.on('new-chat',(chat)=>{
                dispatch(createChat(chat));
            });

            socket.on('added-user-to-group',(group)=>{
                dispatch(addUserToGroup(group))
            });

            socket.on('remove-user-from-chat',(data)=>{
                data.currentUserId = user.id;
                dispatch(leaveCurrentChat(data))
            });

            socket.on('deleted-chat',(chatId)=>{
                dispatch(deleteChat(chatId))
            })
            console.log(res);
        })
        .catch(err=>console.log(err));

        
    },[dispatch,user])
}

export default useSocket