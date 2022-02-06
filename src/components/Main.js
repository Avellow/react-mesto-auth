import React, {useState, useEffect, useContext} from "react";
import Card from "./Card";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main(props) {

    const [userName, setUserName] = useState('');
    const [userDescription, setUserDescription] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    const { name, about, avatar } = useContext(CurrentUserContext);

    useEffect(() => {
        setUserName(name);
        setUserDescription(about);
        setUserAvatar(avatar);
    }, [name, about, avatar])

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__avatar-container">
                    <img className="profile__avatar" src={userAvatar} alt="аватар" />
                    <div
                        className="profile__avatar-overlay"
                        onClick={props.onEditAvatar}
                    />
                </div>
                <div className="profile__info">
                    <h1 className="profile__name">{userName}</h1>
                    <button
                        className="profile__edit-button"
                        type="button"
                        aria-label="edit"
                        onClick={props.onEditProfile}
                    />
                    <p className="profile__job">{userDescription}</p>
                </div>
                <button
                    className="profile__add-button"
                    type="button"
                    aria-label="add"
                    onClick={props.onAddPlace}
                />
            </section>

            <section className="places">
                <ul className="places__list">
                    {props.cards.map((card, i) => (
                        <Card
                            card={card}
                            key={card._id}
                            onCardClick={props.onCardClick}
                            onCardLike={props.onCardLike}
                            onCardDelete={props.onCardDelete}
                        />
                    ))}
                </ul>
            </section>
        </main>
    )
}

export default Main;