

function Login(props) {

    return (
        <form className="sign-form">
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
        </form>
    )
}

export default Login;