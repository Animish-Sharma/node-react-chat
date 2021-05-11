import { LOGIN, LOGOUT, REGISTER, UPDATE_PROFILE } from '../types/index';

const initialState = {
    // user:JSON.parse(localStorage.getItem('user')) || {},
    // token:localStorage.getItem('token')||'',
    // isLoggedIn: !!localStorage.getItem('user') ? true : false,


    user:{},
    token:'',
    isLoggedIn: false
};


const authReducer=(state=initialState,action)=>{
    const { type,payload } = action;

    switch(type){
        case LOGIN:
            return{
                ...state,
                user:payload.user,
                token:payload.token,
                isLoggedIn:true
            }
        case REGISTER:
            return{
                ...state,
                user:payload.user,
                token:payload.token,
                isLoggeIn:true
            }
        case UPDATE_PROFILE:
            return{
                ...state,
                user:payload
            }
        case LOGOUT:
            return{
                ...state,
                user:{},
                token:'',
                isLoggedIn:false
            }
        default:
            return state;
    }
};

export default authReducer;