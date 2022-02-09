import React from "react";
import {Link} from "react-router-dom";


function ProfileSignStatus(props) {
    const {
        loggedIn,
        linkInfo,
        onSignStatusClick,
        email = '',
        isShown = true
    } = props;

    function handleClick() {
        onSignStatusClick();
    }

    return (
        <div className='profile-sign-status' style={!isShown ? {display: 'none'} : {}}>
            {loggedIn
                && <p className='profile-sign-status__email'>{email}</p>
            }
            <Link
                className='profile-sign-status__sign-link'
                to={linkInfo.to}
                onClick={handleClick}
                style={loggedIn ? {color: '#a9a9a9'} : {color: 'white'}}
            >
                {linkInfo.text}
            </Link>
        </div>
    )
}

export default ProfileSignStatus;