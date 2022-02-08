import logo from "../images/header/logo.svg";

function Header(props) {

    const { children } = props;

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="лого" />
            <div className='profile-status'>
                {children}
            </div>
        </header>
    )
}

export default Header;