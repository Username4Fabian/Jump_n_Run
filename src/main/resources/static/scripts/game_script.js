let GLOBAL_SPEED = 320;
let groundHeight = 0; 
const userName = getCookie('user');
const token = getCookie('token');

let startTime = null; 
let timeSinceStart = 0;

if (userName == null || token == null) {
    window.location.href = `index.html`;
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

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.alive = true;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.08);
        this.setCollideWorldBounds(true);
        this.setScale(0.5);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.anims.play('walk', true); 
        this.isBackgroundScrolling = false;
    }

    update() {
        // 160 is the speed of the player
        if (this.cursors.left.isDown) {
            this.setVelocityX(-GLOBAL_SPEED);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(GLOBAL_SPEED);
        } else {
            this.setVelocityX(0);
        }

        // console.log(this.alive);
        if(this.body.touching.down && this.body.velocity.x === 0 && !this.isBackgroundScrolling && this.alive){
            this.setTexture('playerIdle');
        }else if(!this.body.touching.down && this.alive){
            this.setTexture('playerJump');
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-1500); // Jump
        }
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Get the current width of the sprite
        const currentWidth = this.displayWidth;
        const currentHeight = this.displayHeight;

        // Reduce the width by 20% to make it 10% smaller on each side
        const newWidth = currentWidth * 0.8;

        // Set the new size of the hitbox
        this.body.setSize(newWidth, currentHeight);

        // Set the offset to center the hitbox
        this.body.setOffset((currentWidth - newWidth) / 2, 0);

        this.setCollideWorldBounds(false);
        this.setVelocityX(0);
        this.alive = true;
        this.setScale(0.1);
    }

    update() {
        if (!this.alive) {
            this.setVelocityX(0);
            this.setVisible(false);
            this.setActive(false);
            this.body.destroy();
        } else {    
            let offset = 60; 
            let direction = (this.scene.player.x - offset) - this.x;
            let wherePlayer = Math.sign(direction);
    
            if(!this.scene.background.isScrolling){
                // console.log("Not scrolling");
                this.setVelocityX(GLOBAL_SPEED * wherePlayer);
            } else {
                if(wherePlayer < 0){
                    this.setVelocityX(GLOBAL_SPEED * -2);
                }else{
                    this.setVelocityX((GLOBAL_SPEED - 60) * -1);
                }
            }
        }
    }
}

class Background {
    constructor(scene) {
        this.scene = scene;
        let bgImage = scene.textures.get('background').getSourceImage();
        this.scale = scene.sys.game.config.height / bgImage.height;
        let widthScale = scene.sys.game.config.width / (bgImage.width * this.scale);

        this.bg = scene.add.tileSprite(0, 0, bgImage.width, bgImage.height, 'background')
            .setOrigin(0, 0)
            .setScale(this.scale * widthScale, this.scale);
    }

    update(player, cursors) {
        this.isScrolling = false;
        if (cursors.right.isDown) {
            if (player.x < this.scene.sys.game.config.width * 0.6) {
                this.isScrolling = false;
                player.backgroundScrolling = false;
                player.setVelocityX(GLOBAL_SPEED*1.533333333333333);
            } else {
                this.isScrolling = true;
                player.backgroundScrolling = true;
                player.setVelocityX(0);
                this.bg.tilePositionX += GLOBAL_SPEED* 0.06875;
            }
        } else if (cursors.left.isDown) {
            player.setVelocityX(-GLOBAL_SPEED*1.533333333333333);
        } else {
            player.setVelocityX(0);
        }
    }
}

class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.setOrigin(0, 1);
    }

    update() {
        if (this.x + this.width < 0) {
            this.destroy();
        }
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('background', 'images/game/background.png');
        this.load.spritesheet('player', 'images/game/player.png', { frameWidth: 180, frameHeight: 192 });
        this.load.image('enemy', 'images/game/enemy.png');
        this.load.image('obstacle', 'images/game/obstacle.png');
        this.load.image('playerIdle', 'images/game/idle.png');
        this.load.image('playerJump', 'images/game/jump.png');
        this.load.image('playerGameover', 'images/game/lose.png');
        this.load.image('logoutButton', 'images/game/logoutButton.png');
        this.load.image('ScoreBoard', 'images/game/ScoreBoard_Button.png');
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.background = new Background(this);

        this.player = new Player(this, 50, 500);
        this.cursors = this.input.keyboard.createCursorKeys();

        let ground = this.physics.add.staticGroup();
        let groundSprite = ground.create(this.background.scale, this.sys.game.config.height);
        groundSprite.setScale(200, this.background.scale * 12).refreshBody();
        groundSprite.setVisible(false);
        this.physics.add.collider(this.player, ground);

        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true,
        });

        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
        // this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.enemies, ground);
        this.physics.add.overlap(this.player, this.enemies, this.handleCollision, null, this);
        // this.physics.add.collider(this.enemies, this.player, this.handleCollision, null, this);

        let logoutButton = this.add.image(this.sys.game.config.width - 50, 50 , 'logoutButton').setInteractive();
        logoutButton.scale = 0.7;

        let scoreBoard = this.add.image(this.sys.game.config.width - logoutButton.height - 50, 50 , 'ScoreBoard').setInteractive();
        scoreBoard.scale = 0.7;

        logoutButton.on('pointerdown', () => {
            console.log("Logging out");
            document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = 'index.html';
        });

        scoreBoard.on('pointerdown', () => {
            console.log("Open Scoreboard");
            window.location.href = 'scoreboard.html';
        });

this.obstacles = this.physics.add.group({
    classType: Obstacle,
    runChildUpdate: true,
});

// Generate obstacles periodically
this.time.addEvent({
    // Increase the delay to make obstacles occur less frequently
    delay: Phaser.Math.Between(4000, 5000) / (GLOBAL_SPEED / 320),
    callback: function() {
        let enemy = this.enemies.getChildren()[this.enemies.getChildren().length - 1];

        const obstacleX = this.sys.game.config.width + 20;
        const obstacleY = groundSprite.y - groundSprite.displayHeight / 2;
        groundHeight = obstacleY;

        // Create a cluster of obstacles
        for (let i = 0; i < Phaser.Math.Between(1, 5); i++) {
            for (let j = 0; j < Phaser.Math.Between(1, 3); j++) {
                let obstacle = this.obstacles.create(obstacleX + j * 60, obstacleY - i * 60, 'obstacle');
                obstacle.initialX = obstacle.x;  // Store the initial X position
                obstacle.setScale(0.8);
                obstacle.setImmovable(true);

                obstacle.setVelocityX(GLOBAL_SPEED * 1.64);

                obstacle.body.allowGravity = false;

                this.physics.add.collider(this.player, obstacle);
                this.physics.add.collider(obstacle, ground);
                this.physics.add.collider(obstacle, this.enemies);
            }
        }

    },
    callbackScope: this,
    loop: true
});

        this.startTime = null; 
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.frameCounter = 0;


    }
    
    update() {

        if(this.score == 0){
            timeSinceStart = 0;
            startTime = new Date();
        }

        this.player.update();

        if(this.background.isScrolling){
            this.obstacles.setVelocityX(-GLOBAL_SPEED*3.125);
        }else{
            this.obstacles.setVelocityX(-GLOBAL_SPEED*2.125);
        }

        this.obstacles.children.iterate(function(obstacle) {
            if ((this.player.x - this.player.body.width / 2 <= 0.1) && this.player.body.touching.right && obstacle.body.touching.left) {
                this.handleCollision(this.player, null);
            }
        }, this);

        this.background.update(this.player, this.cursors);

        let enemyProbability = (GLOBAL_SPEED/320) * 0.009;  
        if (Math.random() < enemyProbability) {
            const x = this.sys.game.config.width * 1.3;
            const y = groundHeight* this.background.scale; 
            this.enemies.add(new Enemy(this, x, y));
        }

        this.frameCounter ++;
        if (this.frameCounter % 20 === 0 && this.background.isScrolling) {
            this.score += 1;
            this.scoreText.setText('Score: ' + Math.floor(this.score));
        }

        if (this.frameCounter % 10 === 0 && GLOBAL_SPEED < 1000) {
            GLOBAL_SPEED = GLOBAL_SPEED* 1.0005;
        }
        // console.log(GLOBAL_SPEED);

        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.x < -10) {
                enemy.alive = false;
                enemy.destroy();
            }
        });
    }

    handleCollision(player, enemy) {
        console.log("Collision");
        if (enemy !== null && player.body.touching.down && enemy.body.touching.up) {
            this.score += 10;
            this.scoreText.setText('Score: ' + Math.floor(this.score));
            enemy.alive = false;
        } else {
            updateTimeSinceStart();
            createScore(this.score, 1, timeSinceStart, userName);
            console.log(timeSinceStart);

            GLOBAL_SPEED = 320;
            this.physics.pause();
            player.alive = false;
            this.player.setTexture('playerGameover');
            console.log("Game Over texture set");
            this.player.update();
            player.body.setVelocity(0);
            this.time.delayedCall(250, () => { 
                player.alive = false;
                this.scene.pause(); 
            });
            setTimeout(() => {
                console.log("Restarting");
                this.scene.resume('GameScene');
                this.scene.restart('GameScene');
            }, 1);
        }
    }
}

function updateTimeSinceStart() {
    if (startTime !== null) {
        const currentTime = new Date();
        timeSinceStart = currentTime - startTime;
    }
}

function createScore(score, level, playtime, name) {
    const url = 'http://localhost:8080/createScore';
    const data = {
        score: score,
        level: level,
        playtime: playtime,
        name: name
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
    });
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth - 20,
    height: window.innerHeight - 20,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 3000 },
            debug: false
        }
    },
    scene: [GameScene]
};

new Phaser.Game(config);