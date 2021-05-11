import React from 'react';
import './Message.scss';
import { useSelector } from 'react-redux';
const Message = ({ message,index,user,chat }) => {
    const determineMargin = () =>{
        if(index + 1 === chat.Messages.length) return null;

        return message.fromUserId === chat.Messages[index + 1].fromUserId ? 'mb-5' : 'mb-10'
    }

    return (
        <div className={`message ${determineMargin()} ${message.fromUserId === user.id ? 'creator' : ''}`}>
            <div className={message.fromUserId===user.id ? 'owner' :'other-person'}>
                {
                    message.fromUserId !== user.id?
                    <h6 className="m-0">
                        {message.User ? message.User.firstName : chat.Users[0].firstName} {message.User ? message.User.lastName : chat.Users[0].lastName}
                    </h6>:null
                }
                {
                    message.type ==='text'?
                    <p className="m-0">{message.message}</p>:
                    <img src={message.message} alt="user sent "/>
                }
            </div>
        </div>
    )
}

export default Message
