import PopupWithForm from "./PopupWithForm";
import {useContext} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";

function ConfirmPopup({ isOpen, onClose, onCardDelete, card }) {

    const buttonText = useContext(FormsFetchingContext);

    function handleSubmit(e) {
        e.preventDefault();
        onCardDelete(card);
    }

    return (
        <PopupWithForm
            title={'Вы уверены?'}
            isOpen={isOpen}
            onClose={onClose}
            buttonTextValue={buttonText.confirmAction}
            onSubmit={handleSubmit}
        />
    )
}

export default ConfirmPopup;