import React,{ useState } from 'react';
import registerImage from '../../assets/register.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../store/actions/auth';
function Register({ history }) {
    const dispatch = useDispatch();
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [gender,setGender] = useState('male');
    const [password,setPassword] = useState('');

    const submitForm=(e)=>{
        e.preventDefault();
        dispatch(register({firstName,lastName,email,password},history))
        console.log({firstName,lastName,email,password})
    }

    return (
        <div id="auth-container">
            <div id="auth-card">
                <div className="card-shadow">
                    <div id="image-section">
                        <img src={registerImage} alt="Login"/>
                    </div>
                    <div id="form-section">
                        <h2>Create an account</h2>

                        <form onSubmit={submitForm}>
                            <div className="input-field mb-1">
                                <input
                                value={firstName}
                                type="text"
                                onChange={e=>setFirstName(e.target.value)}
                                required='required' 
                                placeholder="First Name"/>
                            </div>
                            <div className="input-field mb-1">
                                <input
                                value={lastName}
                                type="text"
                                onChange={e=>setLastName(e.target.value)}
                                required='required' 
                                placeholder="Last Name"/>
                            </div>
                            <div className="input-field mb-1">
                                <input
                                value={email}
                                type="email"
                                onChange={e=>setEmail(e.target.value)}
                                required='required' 
                                placeholder="Email"/>
                            </div>
                            <div className="input-field mb-1">
                                <select
                                value={gender}
                                onChange={e=>setGender(e.target.value)}
                                required='required'
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="input-field mb-2">
                                <input
                                value={password}
                                required='required'
                                onChange={e=>setPassword(e.target.value)} 
                                type="password" 
                                placeholder="Password"/>
                            </div>

                            <button>Register</button>
                        </form>
                        <p>Already have an account? <Link to="/login">Login</Link> </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;

