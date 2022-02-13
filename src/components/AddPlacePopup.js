import PopupWithForm from "./PopupWithForm";
import {useContext, useEffect} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";
import {useFormAndValidation} from "../hooks/useFormAndValidation";
import Input from "./Input";

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
            isValid={isValid}
        >
            <Input
                values={values}
                type="text"
                name="place-name"
                onChange={handleChange}
                placeHolder="Название"
                required={true}
                errors={errors}
                minLength="2"
                maxLength="30"
            />
            <Input
                values={values}
                type="url"
                name="place-link"
                onChange={handleChange}
                placeHolder="Ссылка на картинку"
                required={true}
                errors={errors}
            />
        </PopupWithForm>
    )
}

export default AddPlacePopup;