import React, {useEffect, useState} from "react";
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
import {Switch, Route, useLocation, Link, Redirect, useHistory} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from './../utils/auth'

function App() {
    //надо подумать: может вообще привязать отображение некоторых компонентов на isFetching
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

    const location = useLocation();

    const buttonFormText = isFetching ? 'fetchingText' : 'defaultText';
    const { _id: userId } = currentUser;

    useEffect(() => {
        handleTokenCheck();
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([user, cards]) => {
                    setCurrentUser(prevValue => ({...prevValue, ...user}));
                    setCards(cards);
                })
                .catch(err => console.log(`${err} не удалось получить данные с сервера`));
        }
    }, [loggedIn]);

    //при проверке токена меняю состояние запроса isFetching чтобы не было "моргания" между компонентами Login и Main
    //понимаю что это может быть костыль...
    function handleTokenCheck() {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            setIsFetching(true);
            auth.checkToken(jwt)
                .then(({data}) => {
                    setCurrentUser(prevValue => ({...prevValue, email: data.email}));
                    setLoggedIn(true);
                    history.push('/');
                })
                .finally(() => setIsFetching(false));
        }
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === userId);
        api.changeLikeCardStatus(card._id, isLiked)
            .then(newCard => {
                setCards(prevState => prevState.map(c => c._id === card._id ? newCard : c))
            })
            .catch(err => console.log(`Ошибка ${err}, не удалось взаимодействовать с лайком`))
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

    function handleCardImageClick(card) {
        setIsOpenedImagePopup(true);
        setSelectedCard(card);
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

    function handleRemoveCardClick(card) {
        setIsOpenedConfirmPopup(true);
        setSelectedCard(card);
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
    const signActionLink = formSignActionLink();


    //хендлеры регистрации и авторизации
    const history = useHistory();
    const [registrationSuccess, setRegistrationSuccess] = useState(false)

    function handleRegister(email, password) {
        auth.register(email, password)
            .then(data => {
                setRegistrationSuccess(true);
                setIsTooltipOpen(true);
            })
            .catch(err => {
                console.log(`${err} - некорректно заполнено одно из полей`);
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
            .catch(console.log)
    }

    function handleSignClick() {
        if (loggedIn) {
            setLoggedIn(false);
            localStorage.removeItem('jwt');
        }
    }


    return (
        <div className="root">
            <CurrentUserContext.Provider value={currentUser}>
                <Header>
                    {loggedIn
                        && <p className='profile-status__email'>{currentUser.email}</p>
                    }
                    <Link
                        className='sign-link'
                        to={signActionLink.to}
                        onClick={handleSignClick}
                        style={loggedIn ? {color: '#a9a9a9'} : {color: 'white'}}
                    >
                        {signActionLink.text}
                    </Link>
                </Header>
                <Switch>
                    <Route path="/sign-in">
                        {!isFetching && <Login
                            onSubmit={handleLogin}
                        />}
                    </Route>
                    <Route path="/sign-up">
                        <Register
                            onSubmit={handleRegister}
                        />
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
                    name={'tooltip'}
                    onClose={closeAllPopups}
                    success={registrationSuccess}
                />
            </CurrentUserContext.Provider>

        </div>
    );
}

export default App;