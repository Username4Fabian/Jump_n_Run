document.addEventListener('DOMContentLoaded', initialize);

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
        window.location.href = `game.html?username=${document.getElementById('username').value}`;
    }
}

function handleError(error) {
    console.error('Error:', error);
    alert(error); 
}