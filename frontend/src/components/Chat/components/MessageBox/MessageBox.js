import React,{ useEffect,useRef,useState } from 'react';
import Message from '../Message/Message';
import { useSelector,useDispatch } from 'react-redux';
import { paginateMessages } from '../../../../store/actions/chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MessageBox.scss';
const MessageBox = ({ chat }) => {
    const dispatch = useDispatch();
    const user = useSelector(state=> state.authReducer.user)
    const scrollBottom = useSelector(state=> state.chatReducer.scrollBottom);
    const senderTyping = useSelector(state=> state.chatReducer.senderTyping);
    const [loading,setLoading] = useState(false);
    const [scrollUp,setScrollUp] = useState(0);
    const msgBox = useRef();

    

    const scrollManual = value=>{
        msgBox.current.scrollTop = value;
    }
    const handleInfiniteScroll = (e) =>{
        // That means we have scrolled to the top
        if(e.target.scrollTop === 0){
            setLoading(true);
            const pagination = chat.Pagination;
            const page = typeof pagination === 'undefined' ? 1 : pagination.page;

            dispatch(paginateMessages(chat.id, parseInt(page) + 1))
            .then(res=>{
                if(res){
                    setScrollUp(scrollUp + 1)
                }
                setLoading(false);
            }).catch(err=>{
                console.log(err);setLoading(false);
            })
        }
    }
    useEffect(()=>{
        setTimeout(()=>{
            scrollManual(Math.ceil(msgBox.current.scrollHeight * 0.10));
        },100)
        
    },[scrollUp]);

    useEffect(()=>{
        if(senderTyping.typing && msgBox.current.scrollHeight > msgBox.current.scrollHeight * 0.30){
            setTimeout(() => {
                scrollManual(Math.ceil(msgBox.current.scrollHeight * 0.10))
            }, 100);
        }

    },[senderTyping])


    useEffect(()=>{
        if(!senderTyping.typing){
            setTimeout(() => {
                scrollManual(msgBox.current.scrollHeight)
            }, 100);
        }
    },[scrollBottom])
    return (
        <div onScroll={handleInfiniteScroll} id="msg-box" ref={msgBox}>
            {
                loading
                ? <p className="loader m-0"><FontAwesomeIcon icon='spinner' className="fa-spinner" /></p>
                : null
            }
            {
                chat.Messages.map((message,index)=>{
                    return <Message
                    user={user}
                    chat={chat}
                    message={message}
                    index={index}
                    key={index}/>
                })
            }
            {
                senderTyping.typing && senderTyping.chatId === chat.id && senderTyping?
                <div className="message-t">
                    <div className="other-person">
                        <p>{senderTyping.fromUser.firstName} {senderTyping.fromUser.lastName} is typing...</p>
                    </div>
                </div> : null
            }            
        </div>
    )
}

export default MessageBox
