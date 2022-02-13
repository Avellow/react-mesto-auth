

const Form = (props) => {
    const {
        onSubmit,
        buttonText,
        name,
        title,
        isValid,
        children,

    } = props;

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`form ${name}-form`}
            name={`${name}-form`}
            noValidate
        >
            <h2 className="form__title">{ title }</h2>
            { children }
            <button
                className="form__submit"
                type="submit"
                disabled={!isValid}
            >
                { buttonText }
            </button>
        </form>
    )
}

export default Form;