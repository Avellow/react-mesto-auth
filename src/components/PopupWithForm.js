import {useEffect, useRef} from "react";

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

    const popupRef = useRef();

    useEffect(() => {
            popupRef.current.focus();
    }, [popupRef, isOpen]);

    function handleEscDown(e) {
        if (e.keyCode === 27) {
            onClose();
        }
    }

    return (
        <div
            ref={popupRef}
            className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}
            tabIndex="-1"
            onKeyDown={handleEscDown}
        >
            <div className="popup__form-container">
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
                <button
                    className="popup__close-button"
                    type="button"
                    aria-label="close"
                    onClick={onClose}
                />
            </div>
        </div>
    )
}

export default PopupWithForm;