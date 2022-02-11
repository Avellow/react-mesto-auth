import {useEffect, useRef} from "react";

function ImagePopup(props) {

    const {
        card,
        isOpen,
        onClose
    } = props;

    const popupRef = useRef();

    useEffect(() => {
        popupRef.current.focus();
    }, [popupRef, isOpen]);

    function handleEscDown(evt) {
        if (evt.key === 'Escape') {
            onClose();
        }
    }

    return (
        <div
            ref={popupRef}
            className={`popup img-popup ${isOpen ? 'popup_opened' : ''}`}
            tabIndex="-1"
            onKeyDown={handleEscDown}
        >
            <div className="popup__img-container">
                <figure className="popup__figure">
                    <img
                        className="popup__img"
                        src={card.link}
                        alt={card.name}
                    />
                    <figcaption className="popup__img-subtitle">{card.name}</figcaption>
                </figure>
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

export default ImagePopup;