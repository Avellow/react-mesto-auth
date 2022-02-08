import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect, useState} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";

function EditProfilePopup(props) {

    const {
        isOpen,
        onClose,
        onUpdateUser
    } = props;

    const [name, setName] = useState('Name');
    const [description, setDescription] = useState('About');
    const [errors, setErrors] = useState({});

    const currentUser = useContext(CurrentUserContext);
    const buttonText = useContext(FormsFetchingContext);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
        setErrors({});
    }, [currentUser, isOpen]);

    function isEmptyErrors() {
        for (let key in errors) {
            return false;
        }
        return true;
    }

    function setClassName(inputName) {
        return `form__input ${errors[inputName] ? 'form__input_type_error' : ''} form__input_type_profile-${inputName}`;
    }

    //обновляет ошибки на каждом вводе, если ошибки нет, а поле существует - удаляет его
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

    function handleNameChange(e) {
        setName(e.target.value);
        errorsChecker(e.target);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
        errorsChecker(e.target);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({
            name,
            about: description,
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
            isButtonDisabled={!isEmptyErrors()}
        >
            <fieldset className="form__field">
                <input
                    value={name || ''}
                    onChange={handleNameChange}
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
                    value={description || ''} // --//--
                    onChange={handleDescriptionChange}
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
            </fieldset>
        </PopupWithForm>
    )
}

export default EditProfilePopup;