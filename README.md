# JavaScript Jump 'n' Run Game

## Overview

The Jump and Run Game Application is a web-based platform offering an interactive gaming experience, along with a user management system and a scoreboard to track high scores. The application is developed using Spring Boot for the backend and Phaser for the game engine, with a simple frontend.

## Features

- User Authentication: Secure login and registration system.
- Interactive Game: Phaser 3 based Jump and Run game.
- Score Tracking: Scores are saved and associated with user accounts.
- Scoreboard: Displays high scores and player rankings.
- Responsive Design: The game and platform are accessible on various devices.

## Technologies Used

- **Spring Boot**: For the backend server and REST API.
- **Phaser 3**: JavaScript library for game development.
- **JPA**: For database interaction and management.
- **H2 Database**: In-memory database for development.
- **BCrypt**: For password encryption.
- **JWT**: For token-based authentication.

## Project Structure

### Backend

- **Model**: Defines `Player` and `Scores` entities for persistence.
- **Repository**: Interfaces for database access.
- **Controller**: REST endpoints for user and game actions.
- **Service**: Business logic and service layer.
- **Configuration**: Security and application configuration.

### Frontend

- **HTML Pages**: Includes `index.html` (login page), `game.html`, and `scoreboard.html`.
- **CSS Files**: Styling for the pages.
- **JavaScript**: Gameplay logic and interaction with the backend.

## Setup and Installation

1. **Clone the Repository**

```bash
git clone <https://github.com/Username4Fabian/Jump_n_Run.git>
```

2. **Run the Backend**

Navigate to the project directory and run:

```bash
mvn spring-boot:run
```

3. **Access the Application**

- Game: `http://localhost:8080/game.html`
- Scoreboard: `http://localhost:8080/scoreboard.html`
- Login Page: `http://localhost:8080/index.html`

## API Endpoints

- **POST** `/createPlayer`: Register a new player.
- **POST** `/createScore`: Submit a new game score.
- **GET** `/getPlayerList`: Get a list of players and their scores.
- **GET** `/getScores`: Get scores for a specific player.

## Security

Hashed passwords and Cookie-based authentication are used to secure the application.

## Future Enhancements

- Introduction of multiplayer features.
- Expansion of game levels and complexity.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contributors

- Fabian Sykes - Developer

Feel free to fork the project, submit pull requests, or report bugs and suggest features.
