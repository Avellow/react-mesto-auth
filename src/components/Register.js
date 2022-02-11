import {Link} from "react-router-dom";
import {useState} from "react";


function Register(props) {

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
            <h2 className="sign-form__title">Регистрация</h2>
            <input
                className="sign-form__input"
                type="email"
                name="sign-in-email"
                placeholder="Email"
                onChange={handleEmailChange}
                value={email}
                required
            />
            <input
                className="sign-form__input"
                type='password'
                name="sign-in-password"
                placeholder="Пароль"
                onChange={handlePasswordChange}
                value={password}
                required
                minLength="4"
                maxLength="20"
            />
            <button className="sign-form__submit" type='submit'>Зарегистрироваться</button>
            <p className="sign-form__subtitle">Уже зарегистрированы?
                <Link className="sign-form__link" to='/sign-in'> Войти</Link></p>
        </form>
    )
}

export default Register;