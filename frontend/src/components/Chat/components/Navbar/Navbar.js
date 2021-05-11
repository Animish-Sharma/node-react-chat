import React,{ Fragment, useState } from 'react';
import './Navbar.scss';
import { useSelector,useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../../../store/actions/auth';
import Modal from '../../../Modal/Modal';
import { updateProfile } from '../../../../store/actions/auth';

function Navbar() {
    const user = useSelector(state=>state.authReducer.user);

    const [showProfileOptions,setShowProfileOptions] = useState(false);
    const [showProfileModal,setShowProfileModal] = useState(false);

    const [firstName,setFirstName] = useState(user.firstName);
    const [lastName,setLastName] = useState(user.lastName);
    const [email,setEmail] = useState(user.email);
    const [gender,setGender] = useState(user.gender);
    const [password,setPassword] = useState('');
    const [avatar,setAvatar ] = useState('');

    const submitForm=(e)=>{
        e.preventDefault();
        const form = {firstName,lastName,email,gender,password,avatar};
        if(password.length > 0) form.password = password;
        const formData = new FormData();

        for(const key in form){
            formData.append(key,form[key])
        };
        dispatch(updateProfile(formData)).then(()=>{setShowProfileModal(false)})
    }
    const dispatch = useDispatch();
    return (
        <div id="navbar" className="card-shadow">
            <h2>Chatter</h2>
            <div onClick={()=>setShowProfileOptions(!showProfileOptions)} id="profile-menu">
                <img width='40' height='40' src={user.avatar} alt='Avatar'/>
                <p>{user.firstName} {user.lastName}</p>
                <FontAwesomeIcon icon='caret-down' className='fa-icon'/>

                {
                    showProfileOptions &&
                    <div id="profile-options">
                        <p onClick={()=>{setShowProfileModal(true)}}>Update Profile</p>
                        <p onClick={()=>dispatch(logout())}>Logout</p>
                    </div>
                }
                
                {   showProfileModal &&
                     <Modal click={()=>setShowProfileModal(false)}>
                        <Fragment key='header'>
                            <h3>Update Profile</h3>
                        </Fragment>

                        <Fragment key='body'>
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
                            <div className="input-field mb-2">
                                <input
                                onChange={e=>setAvatar(e.target.files[0])} 
                                type="file"/>
                            </div>
                        </form>
                        </Fragment>

                        <Fragment key='footer'>
                            <button onClick={submitForm} className='btn-success'>Update</button>
                        </Fragment>
                    </Modal>
                }
                
            </div>
        </div>
    )
}

export default Navbar
