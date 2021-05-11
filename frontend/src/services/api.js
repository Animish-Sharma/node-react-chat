import axios from 'axios';
import store from '../store';
import { logout } from '../store/actions/auth';
const API =  axios.create({
    baseURL:"http://localhost:3000",
    headers: {
        "Accept":"application/json",
        'Authorization': `Bearer ${localStorage.getItem('token') || null}`
    }
});

API.interceptors.response.use(
    res=>{
        return res
    },
)

export default API;