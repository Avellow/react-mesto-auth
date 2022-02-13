

const Input = (props) => {
    const {
        values,
        type,
        onChange,
        name,
        placeHolder,
        required,
        errors = {},
        minLength,
        maxLength
    } = props;

    return (
        <>
            <input
                value={values[name] || ''}
                onChange={onChange}
                className={`form__input ${errors[name] ? 'form__input_type_error' : ''}`}
                type={type}
                id="place-url-input"
                name={name}
                placeholder={placeHolder}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
            />
            <span className="form__input-error form__input-error_active">{errors[name]}</span>
        </>
    )
}

export default Input;