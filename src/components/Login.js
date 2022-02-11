import {useState} from "react";

function Login(props) {

    const { onSubmit } = props;

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
        onSubmit(email, password);
    }

    return (
        <form className="sign-form" onSubmit={handleSubmit}>
            <h2 className="sign-form__title">Вход</h2>
            <input
                className="sign-form__input"
                type="email"
                name="sign-in-email"
                placeholder="Email"
                onChange={handleEmailChange}
                required
            />
            <input
                className="sign-form__input"
                type='password'
                name="sign-in-password"
                placeholder="Пароль"
                onChange={handlePasswordChange}
                required
                minLength="4"
                maxLength="20"
            />
            <button className="sign-form__submit" type="submit">Войти</button>
        </form>
    )
}

export default Login;