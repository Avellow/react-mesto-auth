import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";
import {useFormAndValidation} from "../hooks/useFormAndValidation";

function EditProfilePopup(props) {

    const {
        isOpen,
        onClose,
        onUpdateUser
    } = props;

    const {
        values,
        handleChange,
        setValues,
        errors,
        isValid,
        resetForm
    } = useFormAndValidation();

    const currentUser = useContext(CurrentUserContext);
    const buttonText = useContext(FormsFetchingContext);

    useEffect(() => {
        resetForm();
        setValues({ username: currentUser.name, job: currentUser.about });
    }, [currentUser, isOpen]);

    function setClassName(inputName) {
        return `form__input ${errors[inputName] ? 'form__input_type_error' : ''} form__input_type_profile-${inputName}`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({
            name: values.username,
            about: values.job
        });
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            title={'Редактировать профиль'}
            name={'edit-profile'}
            isOpen={isOpen}
            onClose={onClose}
            buttonText={buttonText.editProfile}
            isValid={isValid}
        >
            <input
                value={values.username || ''}
                onChange={handleChange}
                className={setClassName('username')}
                type="text"
                id="profile-name-input"
                name="username"
                placeholder="Имя"
                required
                minLength="2"
                maxLength="40"
            />
            <span className="form__input-error form__input-error_active">{errors.username}</span>
            <input
                value={values.job || ''}
                onChange={handleChange}
                className={setClassName('job')}
                type="text"
                id="profile-job-input"
                name="job"
                placeholder="О себе"
                required
                minLength="2"
                maxLength="200"
            />
            <span className="form__input-error form__input-error_active">{errors.job}</span>
        </PopupWithForm>
    )
}

export default EditProfilePopup;