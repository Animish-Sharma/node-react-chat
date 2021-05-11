import React, { Fragment, useState } from 'react';
import './ChatHeader.scss';
import { userStatus } from '../../../../utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatService from '../../../../services/chatService';
import { useSelector } from 'react-redux';
import Modal from '../../../Modal/Modal';
const ChatHeader = ({ chat }) => {

    const [showChatOptions,setShowChatOptions] = useState(false);
    const [showAddFriendModal,setShowAddFriendModal] = useState(false);
    const [showLeaveChatModal,setShowLeaveChatModal] = useState(false);
    const [showDeleteChat,setShowDeleteChat] = useState(false);
    const [suggestions,setSuggestions] = useState([]);

    const socket = useSelector(state=> state.chatReducer.socket)

    const searchFriends = (e) =>{
        ChatService.searchUsers(e.target.value)
        .then(res=> setSuggestions(res))
    }
    const addNewFriend = (id) => {
        try {
            ChatService.addFriendToGroupChat(id,chat.id)
            .then(data=>{
                socket.emit('add-user-to-group', data);
                setShowAddFriendModal(false);
            })
            .catch(e=>{
                console.log(e)
            })
        } catch (err) {
            console.log(err);
        }
    }

    const leaveChat=()=>{
        ChatService.leaveCurrentChat(chat.id)
        .then(data=>{
            socket.emit('leave-current-chat',data);
        })
        .catch(err=>{
            console.log(err)
        })
    };

    const deleteChat=()=>{
        ChatService.deleteChat(chat.id)
        .then(data=>{
            console.log(data);
            socket.emit('delete-chat',data);
        })
    }

    return (
        <Fragment>
            <div id='chatter'>
                {
                    chat.Users.map(user=>{
                        return <div key={user.id} className="chatter-info">
                            <h3>{user.firstName} {user.lastName}</h3>
                            <div className="chatter-status">
                                <span className={`online-status ${userStatus(user)}`}></span>
                            </div>
                        </div>
                    })
                }
                <FontAwesomeIcon onClick={()=>setShowChatOptions(!showChatOptions)} icon={['fas','ellipsis-v']} className='fa-icon'/>
                
            </div>
            {
                showChatOptions ? <div id="settings">

                    <div id="icon-div" onClick={()=> setShowAddFriendModal(true)}>
                        <FontAwesomeIcon style={{"color":"#793EDD"}} icon={['fas','user-plus']} className='fa-icon' />
                        <p>Add user to chat.</p>
                    </div>
                    {
                        chat.type === 'group'?
                        <div id="icon-div" onClick={()=>leaveChat()}>
                            <FontAwesomeIcon style={{"color":"#793EDD"}} icon={['fas','sign-out-alt']} className='fa-icon' />
                            <p>Leave Chat</p>
                        </div>:null
                    }
                    {
                        chat.type==='dual'?
                        <div id="icon-div" onClick={()=> deleteChat()}>
                        <FontAwesomeIcon style={{"color":"#793EDD"}} icon={['fas','trash']} className='fa-icon' />
                        <p>Delete Chat</p>
                    </div> : null
                    }

                </div>:null
            }
            {
                showAddFriendModal && 
                <Modal click={()=> setShowAddFriendModal(false)}>
                    <Fragment key="header">
                        <h3 className="m-0">Add friend to group chat</h3>
                    </Fragment>
                    <Fragment key="body">
                        <p>Add Friend to group chat</p>
                        <input
                        onInput={e=> searchFriends(e)}
                            type="text"
                            placeholder="Search.."
                        />
                        <div id="suggestions">
                            {
                                suggestions.map(user=>{
                                    return <div className="suggestion">
                                            <p className="m-0">{user.firstName} {user.lastName}</p>
                                            <button onClick={()=>addNewFriend(user.id)}>Add</button>
                                        </div>
                                })
                            }
                        </div>
                    </Fragment>
                </Modal>
            }
        </Fragment>
    )
}

export default ChatHeader
