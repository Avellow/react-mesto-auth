import {useEffect, useRef} from "react";

function PopupWithForm(props) {

    const popupRef = useRef();

    useEffect(() => {
            popupRef.current.focus();
    }, [popupRef, props.isOpen]);

    function handleEscDown(e) {
        if (e.keyCode === 27) {
            props.onClose();
        }
    }

    return (
        <div
            ref={popupRef}
            className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_opened' : ''}`}
            tabIndex="-1"
            onKeyDown={handleEscDown}
        >
            <div className="popup__form-container">
                <form
                    onSubmit={props.onSubmit}
                    className={`form ${props.name}-form`}
                    name={`${props.name}-form`}
                    noValidate
                >
                    <h2 className="form__title">{props.title}</h2>
                    {props.children}
                    <button
                        className="form__submit"
                        type="submit"
                        disabled={props.isButtonDisabled}
                    >
                        {props.buttonTextValue}
                    </button>
                </form>
                <button
                    className="popup__close-button"
                    type="button"
                    aria-label="close"
                    onClick={props.onClose}
                />
            </div>
        </div>
    )
}

export default PopupWithForm;