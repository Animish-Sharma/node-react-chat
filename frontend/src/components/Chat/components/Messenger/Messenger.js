import React from 'react';
import { useSelector } from 'react-redux';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageBox from '../MessageBox/MessageBox';
import MessageInput from '../MessageInput/MessageInput';
import './Messenger.scss';
const Messenger = () => {

    const chat = useSelector(state=>state.chatReducer.currentChat);

    const activeChat = ()=>{
        return Object.keys(chat).length > 0;
    }

    return (
        <div id="messenger" className="shadow-light">
            {
                activeChat()
                ? <div id='messenger-wrap'>
                    <ChatHeader chat={chat} />
                    <hr/>
                    <MessageBox chat={chat}/>
                    <MessageInput chat={chat} />
                </div>
                : <div>
                    <h1>No Active Chat</h1>
                </div>
            }
        </div>
    )
}

export default Messenger;