import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect, useState} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";
import {useFormAndValidation} from "../hooks/useFormAndValidation";

function AddPlacePopup(props) {

    const {
        isOpen,
        onClose,
        onCardSubmit
    } = props;

    const {
        values,
        handleChange,
        errors,
        isValid,
        resetForm
    } = useFormAndValidation();

    const buttonText = useContext(FormsFetchingContext);

    useEffect(() => {
        resetForm();
    }, [isOpen]);

    function setClassName(inputName) {
        return `form__input ${errors[inputName] ? 'form__input_type_error' : ''} form__input_type_profile-${inputName}`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        onCardSubmit({ name: values.name, link: values.link });
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            title={'Новое место'}
            name={'add-place'}
            isOpen={isOpen}
            onClose={onClose}
            buttonText={buttonText.addPlace}
            isButtonDisabled={!isValid}
        >
            <fieldset className="form__field">
                <input
                    value={values.name || ''}
                    onChange={handleChange}
                    className={setClassName('name')}
                    type="text"
                    id="place-name-input"
                    name="name"
                    placeholder="Название"
                    required
                    minLength="2"
                    maxLength="30"
                />

                {<span className="form__input-error form__input-error_active">{errors.name}</span>}
                <input
                    value={values.link || ''}
                    onChange={handleChange}
                    className={setClassName('link')}
                    type="url"
                    id="place-url-input"
                    name="link"
                    placeholder="Ссылка на картинку"
                    required
                />
                <span className="form__input-error form__input-error_active">{errors.link}</span>
            </fieldset>
        </PopupWithForm>
    )
}

export default AddPlacePopup;