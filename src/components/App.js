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
import {Switch, Route, useLocation, Link, Redirect} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

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

    const location = useLocation();

    const buttonFormText = isFetching ? 'fetchingText' : 'defaultText';
    const { _id: userId } = currentUser;

    useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([user, cards]) => {
                setCurrentUser(user);
                setCards(cards);
            })
            .catch(err => console.log(`${err} не удалось получить данные с сервера`));
    }, []);

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
    //возможно в будущем это вообще часть хендлера, тк клик по Выйти должен менять состояние loggedIn
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

    return (
        <div className="root">
            <CurrentUserContext.Provider value={currentUser}>
                <Header

                    linkText={'Войти'}
                    link={'/sign-in'}
                    loggedIn={loggedIn}
                >
                    <Link className='sign-link' to={signActionLink.to}>{signActionLink.text}</Link>
                </Header>
                <Switch>
                    <Route path="/sign-in">
                        <Login />
                    </Route>
                    <Route path="/sign-up">
                        <Register />
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
                    success={true}
                />
            </CurrentUserContext.Provider>

        </div>
    );
}

export default App;