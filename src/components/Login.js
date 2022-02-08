import {useState} from "react";

function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onSubmit(email, password);
    }

    return (
        <form className="sign-form" onSubmit={handleSubmit}>
            <h2 className="sign-form__title">Вход</h2>
            <input
                className="sign-form__input"
                placeholder="Email"
                onChange={handleEmailChange}
            />
            <input
                className="sign-form__input"
                placeholder="Пароль"
                onChange={handlePasswordChange}
            />
            <button className="sign-form__submit" type="submit">Войти</button>
        </form>
    )
}

export default Login;