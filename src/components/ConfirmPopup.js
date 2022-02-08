import PopupWithForm from "./PopupWithForm";
import {useContext} from "react";
import {FormsFetchingContext} from "../contexts/FormsFetchingContext";

function ConfirmPopup(props) {

    const {
        isOpen,
        onClose,
        onCardDelete,
        card
    } = props;

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
            buttonText={buttonText.confirmAction}
            onSubmit={handleSubmit}
        />
    )
}

export default ConfirmPopup;