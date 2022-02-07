import successLogo from './../images/sign-up-status/icon_success.png';
import failedLogo from './../images/sign-up-status/icon_failed.png';

function InfoTooltip({isOpen, name, success, onClose }) {

    const text = success ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'
    const icon = success ? successLogo : failedLogo;

    return (
        <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
            <div className='sign-up-status'>
                <div className='sign-up-status__icon' style={{backgroundImage: `url(${icon})`}}/>
                <p className='sign-up-status__subtitle'>{text}</p>
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

export default InfoTooltip;