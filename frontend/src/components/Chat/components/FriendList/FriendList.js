import React,{ useState,Fragment } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Friend from '../Friend/Friend';
import ChatService from '../../../../services/chatService';
import { setCurrentChat } from '../../../../store/actions/chat';
import './FriendList.scss';
import Modal from '../../../Modal/Modal';
const FriendList = () => {
    const dispatch = useDispatch();
    const chats = useSelector(state=>state.chatReducer.chats);
    const socket = useSelector(state=>state.chatReducer.socket);

    

    const [showFriendsModal,setShowFriendsModal] = useState(false);
    const [suggestions,setSuggestions] = useState([]);

    const openChats = (chat) =>{
        dispatch(setCurrentChat(chat))
    }

    const searchFriends = (e) =>{
        ChatService.searchUsers(e.target.value)
        .then(res=> setSuggestions(res))
    }
    const addNewFriend = (id) => {
        try {
            ChatService.createChat(id)
            .then(chats=>{
                socket.emit('add-friend', chats);
                setShowFriendsModal(false);
            })
            .catch(e=>{})
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div id="friends" className="shadow-light">
            <div id="title">
                <h3 className="m-0">Friends</h3>
                <button onClick={()=>setShowFriendsModal(true)}>ADD</button>
            </div>

            <hr/>

            <div id="friends-box">
                {
                    chats.length > 0?
                    chats.map(chat=>{
                        return <Friend click={()=>openChats(chat)} chat={chat} key={chat.id} />
                    }):<p id="no-chat">No Friends Added</p>
                    
                }
            </div>
            {
                showFriendsModal && 
                <Modal click={()=> setShowFriendsModal(false)}>
                    <Fragment key="header">
                        <h3 className="m-0">Create a New Chat</h3>
                    </Fragment>
                    <Fragment key="body">
                        <p>Add Friends by typing their names below</p>
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
        </div>
    )
}

export default FriendList;
