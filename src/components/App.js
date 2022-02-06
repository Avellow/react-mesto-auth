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
import {Switch, Route} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

function App() {

    const [isOpenedAddPlacePopup, setIsOpenedAddPlacePopup] = useState(false);
    const [isOpenedEditProfilePopup, setIsOpenedEditProfilePopup] = useState(false);
    const [isOpenedEditAvatarPopup, setIsOpenedEditAvatarPopup] = useState(false);
    const [isOpenedConfirmPopup, setIsOpenedConfirmPopup] = useState(false);
    const [isOpenedImagePopup, setIsOpenedImagePopup] = useState(false)
    const [currentUser, setCurrentUser] = useState({});
    const [selectedCard, setSelectedCard] = useState({});
    const [cards, setCards] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

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
        setIsOpenedImagePopup(false)
        setSelectedCard({});
    }

    return (
        <div className="root">
            <CurrentUserContext.Provider value={currentUser}>
                <Header/>
                <Switch>
                    <Route path="/sign-in">
                        <Login />
                    </Route>
                    <Route path="/sign-up">
                        <Register />
                    </Route>
                    <Route exact path="/">
                        main-content
                    </Route>
                </Switch>

                {/*<Main  !turned off until auth's comp ready! ----------------------------
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    cards={cards}
                    onCardClick={handleCardImageClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleRemoveCardClick}
                />*/}

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
            </CurrentUserContext.Provider>

        </div>
    );
}

export default App;