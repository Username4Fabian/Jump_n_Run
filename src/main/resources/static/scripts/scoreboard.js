// Fetch scores from the server
fetch('http://localhost:8080/getScores')
    .then(response => {
        // Parse the response as JSON
        return response.json();
    })
    .then(data => {
        // Get the scoreboard table from the DOM
        const table = document.getElementById('scoreboard');

        // Iterate over each score in the data
        data.forEach(score => {
            // Insert a new row in the table
            const row = table.insertRow();

            // Insert a cell for each property of the score
            row.insertCell().innerText = score.name;
            row.insertCell().innerText = score.score;
            // row.insertCell().innerText = score.level;
            row.insertCell().innerText = score.playtime;

            const date = new Date(score.date);
            const formattedDate = date.toLocaleString();
            row.insertCell().innerText = formattedDate;
        });
    })
    .catch((error) => {
        // Log any errors to the console
        console.error('Error:', error);
    });