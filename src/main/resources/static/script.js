// Create canvas and get context
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;

// Define player
var player = {
    x: 50,
    y: 400,
    width: 50,
    height: 50,
    color: "blue",
    dx: 5,
    dy: 0,
    jumping: false,
    gravity: 0.5,
    jumpStart: 0,
    jumps: 0  // add jumps property
};

// Define ground
var ground = {
    x: 0,
    y: 450,
    width: canvas.width,
    height: 50,
    color: "green"
};

// Define obstacles
var obstacles = [];
function generateObstacle() {
    var obstacle = {
        x: canvas.width,
        y: ground.y - 20,
        width: 20,
        height: 20,
        color: "red",
        dx: -2
    };
    obstacles.push(obstacle);
}

// Define score
var score = 0;

// Function to draw player, ground, obstacles, and score
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
    obstacles.forEach(function(obstacle) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Define frame count
var frameCount = 0;

// Function to update player and obstacle positions
function update() {
    player.dy += player.gravity;
    player.y += player.dy;
    if (player.y + player.height > ground.y) {
        player.y = ground.y - player.height;
        player.dy = 0;
        player.jumping = false;
        player.jumps = 0;  // reset jumps when player lands
    }
    // Prevent player from moving outside the canvas
    if (player.y < 0) {
        player.y = 0;
        player.dy = 0;  // stop upward movement
    }
    obstacles.forEach(function(obstacle) {
        obstacle.x += obstacle.dx;
    });
    if (Math.random() < 0.01) {  // 1% chance to generate a new obstacle each frame
        generateObstacle();
    }
    // Increment score every 20 frames
    if (frameCount % 20 === 0) {
        score++;
    }
    // Increment frame count
    frameCount++;
}

// Function to handle keyboard inputs
window.addEventListener("keydown", function(e) {
    if (e.code === "Space" && player.jumps < 2) {  // start jump
        player.jumpStart = Date.now();
        player.dy = -10;  // default jump velocity
        player.jumping = true;
        player.jumps++;  // increment jumps
    }
});

window.addEventListener("keyup", function(e) {
    if (e.code === "Space" && player.jumping) {  // end jump
        var jumpDuration = Date.now() - player.jumpStart;
        player.dy = -Math.max(player.dy, Math.min(jumpDuration / 100, 10));  // increase jump velocity up to a limit
    }
});

// Function to check for collision between player and obstacles
function checkCollision() {
    for (var i = 0; i < obstacles.length; i++) {
        var obstacle = obstacles[i];
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            return true;
        }
    }
    return false;
}

// Game loop
var gameOver = false;
function loop() {
    if (checkCollision()) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        gameOver = true;
        return;  // stop the game loop
    }
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();

// Listen for spacebar press to restart game
window.addEventListener("keydown", function(e) {
    if (gameOver && e.code === "Space") {
        // Reset game state
        player.x = 50;
        player.y = 400;
        player.dy = 0;
        player.jumping = false;
        player.jumps = 0;  // reset jumps
        obstacles = [];
        score = 0;  // reset score
        gameOver = false;
        // Start game loop
        loop();
    }
});
