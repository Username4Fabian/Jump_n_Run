const reloadButton = document.getElementById('back');
reloadButton.style.display = 'none'; // Hide the button initially

reloadButton.addEventListener('click', function() {
    location.reload();
});

function createTableHeader(table, tableNr) {
    if(tableNr === 1) {
        const header = table.createTHead();
        const row = header.insertRow();

        row.insertCell().innerText = "Rank";
        row.insertCell().innerText = "Name";
        row.insertCell().innerText = "HighScore";
        row.insertCell().innerText = "Total Playtime";
        row.insertCell().innerText = "Been here since";
    }else if(tableNr === 2){
        const header = table.createTHead();
        const row = header.insertRow();

        row.insertCell().innerText = "Rank";
        row.insertCell().innerText = "Score";
        row.insertCell().innerText = "Playtime";
        row.insertCell().innerText = "Date, Time";
    }
}

fetch('http://localhost:8080/getPlayerList')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const table = document.getElementById('scoreboard');
        const topScores = data.slice(0, 10);

        createTableHeader(table, 1);

        let i = 1;
        topScores.forEach(player => {
            const row = table.insertRow();

            row.insertCell().innerText = i++ + ".";
            row.insertCell().innerText = player.name;
            row.insertCell().innerText = player.score;
            row.insertCell().innerText = player.playtime;

            // Idk why I need 5 lines for this (AHHHHHH)
            let date = new Date(player.date);
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
            let year = date.getFullYear();
            let formattedDate = `${day}.${month}.${year}`;

            row.insertCell().innerText = formattedDate;

            row.addEventListener('click', () => {
                fetch(`http://localhost:8080/getScores?name=${player.name}`)
                    .then(response => response.json())
                    .then(scores => {
                        while (table.firstChild) {
                            table.removeChild(table.firstChild);
                        }
                        createTableHeader(table, 2);
                        reloadButton.style.display = 'block';
                        scores.forEach((score, index) => {
                            const scoreRow = table.insertRow();

                            scoreRow.insertCell().innerText = index + 1 + ".";
                            scoreRow.insertCell().innerText = score.score;
                            scoreRow.insertCell().innerText = score.playtime;

                            const date = new Date(score.date);
                            const formattedDate = date.toLocaleString();

                            scoreRow.insertCell().innerText = formattedDate;
                        });
                    })
                    .catch(error => console.error('Error:', error));
            });
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });