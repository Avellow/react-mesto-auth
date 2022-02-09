import React, {useCallback, useEffect, useState} from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import {api} from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import {FormsFetchingContext, formsButtonTexts} from "../contexts/FormsFetchingContext";
import ConfirmPopup from "./ConfirmPopup";
import {Switch, Route, useLocation, useHistory} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from './../utils/auth'
import {errorsInfo} from "../utils/errorsInfo";
import ProfileSignStatus from "./ProfileSignStatus";
import MenuButton from "./MenuButton";

function App() {

    const [isOpenedAddPlacePopup, setIsOpenedAddPlacePopup] = useState(false);
    const [isOpenedEditProfilePopup, setIsOpenedEditProfilePopup] = useState(false);
    const [isOpenedEditAvatarPopup, setIsOpenedEditAvatarPopup] = useState(false);
    const [isOpenedConfirmPopup, setIsOpenedConfirmPopup] = useState(false);
    const [isOpenedImagePopup, setIsOpenedImagePopup] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [selectedCard, setSelectedCard] = useState({});
    const [cards, setCards] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [currentWindowWidth, setCurrentWindowWidth] = useState(window.innerWidth);
    const [isDropDownProfileMenuOpen, setIsDropDownProfileMenuOpen] = useState(false);

    const location = useLocation();
    const history = useHistory();

    const buttonFormText = isFetching ? 'fetchingText' : 'defaultText';
    const { _id: userId } = currentUser;

    // при проверке токена меняю состояние запроса isFetching и вешаю зависимость на отображение компонента Login
    // чтобы не было "моргания" между компонентами Login и Main, если fetch успешен
    const handleTokenCheck = useCallback(() => {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            setIsFetching(true);
            auth.checkToken(jwt)
                .then(({data}) => {
                    setCurrentUser(prevUserInfo => ({...prevUserInfo, email: data.email}));
                    setLoggedIn(true);
                    history.push('/');
                })
                .catch(err => console.log(`Ошибка ${err} - ${errorsInfo.tokenChecking[err]}`))
                .finally(() => setIsFetching(false));
        }
    }, [history]);

    useEffect(() => {
        handleTokenCheck();
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([user, cards]) => {
                    setCurrentUser(prevUserInfo => ({...prevUserInfo, ...user}));
                    setCards(cards);
                })
                .catch(err => console.log(`${err} не удалось получить данные с сервера`));
        }
    }, [loggedIn, handleTokenCheck]);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setCurrentWindowWidth(window.innerWidth);
        })
    }, [currentWindowWidth])

    //хендлеры для карточки
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === userId);
        api.changeLikeCardStatus(card._id, isLiked)
            .then(newCard => {
                setCards(prevState => prevState.map(c => c._id === card._id ? newCard : c));
            })
            .catch(err => console.log(`Ошибка ${err}, не удалось взаимодействовать с лайком`));
    }

    function handleDeleteCard(card) {
        setIsFetching(true);
        api.deleteCard(card._id)
            .then(() => {
                setCards(prevState => prevState.filter(c => c._id !== card._id));
                closeAllPopups();
                setIsFetching(false);
            })
            .catch(err => console.log(`Ошибка ${err}, не удалось удалить карточку`));
    }

    function handleCardImageClick(card) {
        setIsOpenedImagePopup(true);
        setSelectedCard(card);
    }

    function handleRemoveCardClick(card) {
        setIsOpenedConfirmPopup(true);
        setSelectedCard(card);
    }

    //хендлеры редактирования профиля и добавления карточек
    function handleUpdateUser(user) {
        setIsFetching(true);
        api.postUserInfo(user)
            .then(data => {
                setCurrentUser(data);
                closeAllPopups();
                setIsFetching(false);
            })
            .catch(err => console.log(`Ошибка ${err}, не удалось обновить профиль`));
    }

    function handleUpdateAvatar({ avatar }) {
        setIsFetching(true);
        api.updateAvatar(avatar)
            .then(data => {
                setCurrentUser(data);
                closeAllPopups();
                setIsFetching(false);
            })
            .catch(err => console.log(`Ошибка ${err}, не удалось обновить аватар`));

    }

    function handleAddPlaceSubmit(card) {
        setIsFetching(true);
        api.postNewCard(card)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups();
                setIsFetching(false);
            })
            .catch(err => console.log(`Ошибка ${err}, не удалось добавить карточку`));
    }

    function handleEditAvatarClick() {
        setIsOpenedEditAvatarPopup(true);
    }

    function handleEditProfileClick() {
        setIsOpenedEditProfilePopup(true);
    }

    function handleAddPlaceClick() {
        setIsOpenedAddPlacePopup(true);
    }

    function closeAllPopups() {
        setIsOpenedAddPlacePopup(false);
        setIsOpenedEditProfilePopup(false);
        setIsOpenedEditAvatarPopup(false);
        setIsOpenedConfirmPopup(false);
        setIsOpenedImagePopup(false);
        setIsTooltipOpen(false);
        setSelectedCard({});
    }

    //формироует объект с описанием текущей ссылки в хедере в зависимости от состояния
    function formSignActionLink() {
        switch (location.pathname) {
            case '/sign-in':
                return {to: '/sign-up', text: 'Регистрация'};
            case '/sign-up':
                return {to: '/sign-in', text: 'Войти'};
            default:
                return loggedIn
                    ? {to: '/sign-in', text: 'Выйти'}
                    : {to: '/sign-up', text: 'Регистрация'};
        }
    }

    //хендлеры аутентификации
    function handleRegister(email, password) {
        auth.register(email, password)
            .then(() => {
                setRegistrationSuccess(true);
                setIsTooltipOpen(true);
            })
            .catch(err => {
                console.log(`Ошибка ${err} - ${errorsInfo.registration[err]}`);
                setRegistrationSuccess(false);
                setIsTooltipOpen(true);
            })
    }

    function handleLogin(email, password) {
        auth.authorize(email, password)
            .then(() => {
                setLoggedIn(true);
                history.push('/');
            })
            .catch(err => console.log(`Ошибка ${err} - ${errorsInfo.authorization[err]}`));
    }

    function handleSignClick() {
        if (loggedIn) {
            setLoggedIn(false);
            localStorage.removeItem('jwt');
        }
    }

    function handleProfileMenuButtonClick() {
        setIsDropDownProfileMenuOpen(!isDropDownProfileMenuOpen);
    }

    return (
        <div className="root">
            <CurrentUserContext.Provider value={currentUser}>
                {currentWindowWidth < 571
                    && <ProfileSignStatus
                            loggedIn={loggedIn}
                            linkInfo={formSignActionLink()}
                            onSignStatusClick={handleSignClick}
                            email={currentUser.email}
                            isShown={isDropDownProfileMenuOpen}
                        />
                }
                <Header>
                    {currentWindowWidth > 570
                        ? <ProfileSignStatus
                            loggedIn={loggedIn}
                            linkInfo={formSignActionLink()}
                            onSignStatusClick={handleSignClick}
                            email={currentUser.email}
                        />
                        : <MenuButton
                            isMenuShown={isDropDownProfileMenuOpen}
                            onClick={handleProfileMenuButtonClick}
                        />
                    }
                </Header>
                <Switch>
                    <Route path="/sign-in">
                        {!isFetching
                            && <Login onSubmit={handleLogin} />
                        }
                    </Route>
                    <Route path="/sign-up">
                        <Register onSubmit={handleRegister} />
                    </Route>
                    <ProtectedRoute
                        exact path='/'
                        loggedIn={loggedIn}
                        component={Main}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        cards={cards}
                        onCardClick={handleCardImageClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleRemoveCardClick}
                    />
                </Switch>

                <Footer/>
                <FormsFetchingContext.Provider value={formsButtonTexts[buttonFormText]}>
                    <EditProfilePopup
                        isOpen={isOpenedEditProfilePopup}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                    />
                    <EditAvatarPopup
                        isOpen={isOpenedEditAvatarPopup}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                    />
                    <AddPlacePopup
                        isOpen={isOpenedAddPlacePopup}
                        onClose={closeAllPopups}
                        onCardSubmit={handleAddPlaceSubmit}
                    />
                    <ConfirmPopup
                        isOpen={isOpenedConfirmPopup}
                        onClose={closeAllPopups}
                        onCardDelete={handleDeleteCard}
                        card={selectedCard}
                    />
                </FormsFetchingContext.Provider>

                <ImagePopup
                    card={selectedCard}
                    isOpen={isOpenedImagePopup}
                    onClose={closeAllPopups}
                />

                <InfoTooltip
                    isOpen={isTooltipOpen}
                    name='tooltip'
                    onClose={closeAllPopups}
                    success={registrationSuccess}
                />
            </CurrentUserContext.Provider>

        </div>
    );
}

export default App;