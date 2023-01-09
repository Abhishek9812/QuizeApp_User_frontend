import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css'
import { NavLink, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";


const Navbar = (props) => {
    const [userData, setUserData] = useState(false);
    const [userFirstName, setUserFirstName] = useState('');
    const cookie = new Cookies();
    const history = useHistory();
    useEffect(()=>{
        let user = localStorage.getItem('userId');
        let userFirstName1 = localStorage.getItem('userFirstName');
        if(userFirstName1)setUserFirstName(userFirstName1);
        let token = cookie.get('token', { path: '/' })
        if(!user || !token ){
            localStorage.clear();
            cookie.remove('token');
            history.push('/login');
            
        }else{
            setUserData(true);
        }
    },[props])

    

    return (<>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" style={{ marginLeft: "50px" }} to="/">Quize</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="jce collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {userData ?
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">Home</NavLink>
                            </li>  
                            <li className="nav-item">
                                <NavLink className="nav-link" onClick={props.logoutUser} to="/login">Logout</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link disabled" to="#">Hello! {'    '} {userFirstName}</NavLink>
                            </li>
                        </> : <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login">Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/signUp">SignUp</NavLink>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    </>)
}

export default Navbar;