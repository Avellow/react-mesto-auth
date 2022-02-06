import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect, useState} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";

function AddPlacePopup({ isOpen, onClose, onCardSubmit }) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [errors, setErrors] = useState({});

    const buttonText = useContext(FormsFetchingContext);

    useEffect(() => {
        setName('');
        setLink('');
        setErrors({});

    }, [isOpen]);

    function errorsChecker(el) {
        if (el.validationMessage) {
            setErrors({...errors, [el.name]: el.validationMessage })
        } else if (errors[el.name]) {
            setErrors(prevErrors => {
                delete prevErrors[el.name];
                return prevErrors;
            })
        }
    }

    function isEmptyErrors() {
        for (let key in errors) {
            return false;
        }
        return true
    }

    function isInputsFilled() {
        return (name && link);
    }

    function setClassName(inputName) {
        return `form__input ${errors[inputName] ? 'form__input_type_error' : ''} form__input_type_place-${inputName}`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        onCardSubmit({name, link});
    }

    function handleNameChange(e) {
        setName(e.target.value);
        errorsChecker(e.target);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
        errorsChecker(e.target);
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            title={'Новое место'}
            name={'add-place'}
            isOpen={isOpen}
            onClose={onClose}
            buttonTextValue={buttonText.addPlace}
            isButtonDisabled={!(isInputsFilled() && isEmptyErrors())}
        >
            <fieldset className="form__field">
                <input
                    value={name}
                    onChange={handleNameChange}
                    className={setClassName('name')}
                    type="text"
                    id="place-name-input"
                    name="name"
                    placeholder="Название"
                    required
                    minLength="2"
                    maxLength="30"
                />
                <span className="form__input-error form__input-error_active">{errors.name}</span>
                <input
                    value={link}
                    onChange={handleLinkChange}
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