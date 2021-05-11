import React,{ useEffect } from 'react';
import './Chat.scss';
import useSocket from './hooks/socketConnect';
import { useDispatch,useSelector } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import Messenger from './components/Messenger/Messenger';
import FriendList from './components/FriendList/FriendList';
function Chat() {
    const dispatch = useDispatch();
    const user = useSelector(state=> state.authReducer.user);

    useSocket(user,dispatch)
    // useEffect(()=>{
    //     dispatch(fetchChats())
    //     .then(res=> console.log(res))
    //     .catch(err=>console.log(err))
    // },[dispatch])
    return (
        <div id='chat-container'>
            <Navbar/>
            <div id="chat-wrap">
                <FriendList />
                <Messenger />
                
            </div>
        </div>
    )
}

export default Chat;
