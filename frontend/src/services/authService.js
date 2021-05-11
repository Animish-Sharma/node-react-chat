import API from './api';


const AuthService = {
    login:(data)=>{
        return API.post('/login',data)
        .then(({ data })=>{
            setHeadersAndStorage(data)
            return data;
        })
        .catch(err=>{
            console.log("There is An error in authorization",err);
            throw err;
        })
    },
    register:(data)=>{
        return API.post('/register',data)
        .then(({ data })=>{
            setHeadersAndStorage(data)
            return data;
        })
        .catch(err=>{
            console.log("There is An error in authorization",err);
            throw err;
        })
    },
    logout:()=>{
        API.defaults.headers['Authorization'] = ``
        localStorage.removeItem('token');
        localStorage.removeItem('user')
    },
    updateProfile:(data)=>{
        const headers = {
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            }
        };
        return API.post('/users/update',data,headers)
        .then(({ data })=>{
            localStorage.setItem('user',JSON.stringify(data));
            return data;
        })
        .catch(err=>{
            console.log("There is An error in authorization",err);
            throw err;
        })
    },
};

const setHeadersAndStorage=({user,token})=>{
    API.defaults.headers['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
}

export default AuthService;