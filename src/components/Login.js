

function Login(props) {

    return (
        <div className="sign-form">
            <h2 className="sign-form__title">Вход</h2>
            <input
                className="sign-form__input"
                placeholder="Email"
            />
            <input
                className="sign-form__input"
                placeholder="Пароль"
            />
            <button className="sign-form__submit">Войти</button>
        </div>
    )
}

export default Login;