

function Login(props) {


    return (
        <div className="sign-form">
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
            <p className="sign-form__subtitle">Уже зарегистрированы? <a>Войти</a></p>
        </div>
    )
}

export default Login;