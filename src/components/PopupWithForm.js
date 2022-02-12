import {useEffect, useRef} from "react";
import Popup from "./Popup";

function PopupWithForm(prop) {

    const {
        isOpen,
        onClose,
        name,
        onSubmit,
        title,
        children,
        isButtonDisabled,
        buttonText
    } = prop;

    return (
        <Popup
            isOpen={isOpen}
            onCLose={onClose}
            name={name}
        >
            <form
                onSubmit={onSubmit}
                className={`form ${name}-form`}
                name={`${name}-form`}
                noValidate
            >
                <h2 className="form__title">{title}</h2>
                {children}
                <button
                    className="form__submit"
                    type="submit"
                    disabled={isButtonDisabled}
                >
                    {buttonText}
                </button>
            </form>
        </Popup>
    )
}

export default PopupWithForm;