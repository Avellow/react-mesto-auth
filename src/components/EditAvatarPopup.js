import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";
import {useFormAndValidation} from "../hooks/useFormAndValidation";


function EditAvatarPopup(props) {

    const {
        isOpen,
        onClose,
        onUpdateAvatar
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
    }, [isOpen])

    function setClassName(inputName) {
        return `form__input ${errors[inputName] ? 'form__input_type_error' : ''} form__input_type_avatar-${inputName}`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
            avatar: values.avatar
        })
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            title={'Обновить аватар'}
            name={'edit-avatar'}
            isOpen={isOpen}
            onClose={onClose}
            buttonText={buttonText.updateAvatar}
            isButtonDisabled={!isValid}
        >
            <input
                value={values.avatar || ''}
                onChange={handleChange}
                className={setClassName('url')}
                type="url"
                id="avatar-url-input"
                name="avatar"
                placeholder="Ссылка на аватар"
                required
            />
            <span className="form__input-error form__input-error_active">{errors.avatar}</span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;