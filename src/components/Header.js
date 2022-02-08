import logo from "../images/header/logo.svg";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useEffect} from "react";


function Header(props) {



    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="лого" />
            <div className='profile-status'>
                {props.children}
            </div>
        </header>
    )
}

export default Header;