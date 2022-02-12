import {useCallback, useState} from "react";

export function useFormAndValidation() {
    //создание состояний значений, ошибок, валидно ли ?
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(true);

    // обработчик, который берет два значения у элемента Имя и Значение константы через деструктуризацию
    // установка состояний значений и ошибок с учетом предыдущих значений
    // установка валидности на основании ближайший к е таргету формы и проверка валдиности через чекВалидити()
    function handleChange(e) {
        const { name, value } = e.target;
        const form = e.target.closest('.form');

        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: e.target.validationMessage });
        setIsValid(form.checkValidity());
    }

    // сброс формы через useCallback внутри анонимная функция принимающая новые аргументы состояний, по умолчанию пустые
    // и форма не валидна
    const resetForm = useCallback((newValues = {}, newErrors = {}, newIsValid = false) => {
        setValues(newValues);
        setErrors(newErrors);
        setIsValid(newIsValid);
    }, [setValues, setErrors, setIsValid]);

    //возврат всех констант и функций кроме setErrors
    return {
        values,
        handleChange,
        errors,
        isValid,
        resetForm,
        setValues,
        setIsValid
    }
}