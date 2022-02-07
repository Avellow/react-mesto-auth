import {Link} from "react-router-dom";


function Register(props) {


    return (
        <form className="sign-form">
            <h2 className="sign-form__title">Регистрация</h2>
            <input
                className="sign-form__input"
                placeholder="Email"
            />
            <input
                className="sign-form__input"
                placeholder="Пароль"
            />
            <button className="sign-form__submit">Зарегистрироваться</button>
            <p className="sign-form__subtitle">Уже зарегистрированы?
                <Link className="sign-form__link" to='/sign-in'> Войти</Link></p>
        </form>
    )
}

export default Register;