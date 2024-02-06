document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', handleFormSubmit);
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
    if (response.status === 400) {
        return response.text();
    } else if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text(); 
}

function handleData(data) {
    if (data.includes('Username already taken')) {
        console.log('Error:', data); 
    } else {
        console.log('Success:', data);
    }
}

function handleError(error) {
    console.error('Error:', error);
    alert(error); 
}