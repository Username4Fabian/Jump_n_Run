document.addEventListener('DOMContentLoaded', initialize);

if(getCookie('user') !== null) {
    var user = getCookie('user');
    setCookie('user', user, 240);

    getToken(user).then(token => {
        setCookie('token', token, 240);
        window.location.href = `game.html`;
    }).catch(error => {
        console.error('Error:', error);
    });
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setCookie(name, value, minutes) {
    var expires = "";
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

async function getToken(userName) {
    try {
        const response = await fetch(`http://localhost:8080/getToken?userName=${userName}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const token = await response.text();
        return token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;  // Re-throw the error to be handled by the caller
    }
}


function initialize() {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', handleFormSubmit);

    const incorrect = document.getElementById('incorrect');
    incorrect.textContent = '';
}

function handleFormSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const apiUrl = `http://localhost:8080/createPlayer`;

    const params = new URLSearchParams();
    params.append('name', username);
    params.append('password', password);

    makeRequest(`${apiUrl}?${params}`);
}

function makeRequest(url) {
    fetch(url, { method: 'POST' })
        .then(handleResponse)
        .then(handleData)
        .catch(handleError);
}

function handleResponse(response) {
    const contentType = response.headers.get('content-type');
    if (response.status === 400) {
        return response.text();
    } else if (response.status === 409 && contentType && contentType.includes('application/json')) {
        return response.json(); 
    }
    return response.text(); 
}

function handleData(data) {
    if (typeof data === 'string' && data.includes('Username already taken')) {
        incorrect.textContent = 'The password is incorrect or the username already exists!!!';
        console.log('Error:', data); 
    } else if (typeof data === 'object' && data.username) {
        console.log('Success:', data);
        window.location.href = `game.html?username=${data.username}`;
    } else {
        console.log('Success:', data);
        var user = document.getElementById('username').value;
        getToken(user).then(token => {
            setCookie('token', token, 240);
            setCookie('user', user, 240);
            window.location.href = `game.html`;
        }).catch(error => {
            console.error('Error:', error);
        });
    }
}

function handleError(error) {
    console.error('Error:', error);
    alert(error); 
}