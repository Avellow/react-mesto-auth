export const BASE_URL = 'https://auth.nomoreparties.co';

function _checkResult(res) {
    return res.ok
        ? res.json()
        : Promise.reject(`Ошибка: ${res.status} `);
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, email })
    })
        .then(_checkResult)
}

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                console.log(data.token); //CONSOOoOOOOOOOOOOOOOLE
                localStorage.setItem('jwt', data.token);
            }
        })
        .catch(console.log)
}

export const getUserInfo = () => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`
        }
    })
        .then(response => response.json())
        .then(data => data)
        .catch(console.log)
}