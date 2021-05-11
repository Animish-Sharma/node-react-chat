import React,{ useState } from 'react';
import loginImage from '../../assets/login.svg';
import './Auth.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/auth';
function Login({ history }) {
    const dispatch = useDispatch();
    const [email,setEmail] = useState('es@gmail.com');
    const [password,setPassword] = useState('emmascale');

    const submitform = async(e)=>{
        e.preventDefault();

        dispatch(login({email,password},history));
        // AuthService.login({email,password})
        // .then(res=>{
        //     console.log(res);
        // })

        // await axios.post("http://localhost:3000/login",{email,password})
        // .then(res=>{
        //     console.log("res",res);
        // })
        // .catch(e=>{
        //     console.log(e)
        // })

        console.log({email, password})
    }
    return (
        <div id="auth-container">
            <div id="auth-card">
                <div className="card-shadow">
                    <div id="image-section">
                        <img src={loginImage} alt="Login"/>
                    </div>
                    <div id="form-section">
                        <h2>Welcome Back!</h2>

                        <form onSubmit={submitform}>
                            <div className="input-field mb-1">
                                <input
                                onChange={e=>setEmail(e.target.value)}
                                type="text"
                                value={email} 
                                placeholder="Email"/>
                            </div>
                            <div className="input-field mb-2">
                                <input 
                                onChange={e=>setPassword(e.target.value)}
                                value={password} 
                                required='required' 
                                type="password" 
                                placeholder="Password"/>
                            </div>

                            <button>Log in</button>
                        </form>
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
