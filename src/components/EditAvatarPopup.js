import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect, useState} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";


function EditAvatarPopup(props) {

    const [link, setLink] = useState('');
    const [error, setError] = useState('');

    const buttonText = useContext(FormsFetchingContext);

    useEffect(() => {
        setError('');
        setLink('');
    }, [props.isOpen])

    function setClassName(inputName) {
        return `form__input ${error ? 'form__input_type_error' : ''} form__input_type_avatar-${inputName}`;
    }

    function handleChange(e) {
        setLink(e.target.value);
        setError(e.target.validationMessage);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({
            avatar: link
        })
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            title={'Обновить аватар'}
            name={'edit-avatar'}
            isOpen={props.isOpen}
            onClose={props.onClose}
            buttonTextValue={buttonText.updateAvatar}
            isButtonDisabled={!(!error && link)}
        >
            <input
                value={link}
                onChange={handleChange}
                className={setClassName('url')}
                type="url"
                id="avatar-url-input"
                name="avatar"
                placeholder="Ссылка на аватар"
                required
            />
            <span className="form__input-error form__input-error_active">{error}</span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;