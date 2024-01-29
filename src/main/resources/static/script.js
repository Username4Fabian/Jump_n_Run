class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.08);
        this.setCollideWorldBounds(true);
        this.setScale(0.5);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.anims.play('walk', true); 
    }

    update() {
        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
        } else {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-1000); // Jump
        }
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
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
            let speed = 160; 
            let wherePlayer = Math.sign(direction);
    
            if(!this.scene.background.isScrolling){
                this.setVelocityX(speed * wherePlayer);

            } else {
                if(wherePlayer < 0){
                    this.setVelocityX(speed * -2);
                }else{
                    this.setVelocityX((speed - 60) * -1);
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
                player.setVelocityX(300);
            } else {
                this.isScrolling = true;
                player.setVelocityX(0);
                this.bg.tilePositionX += 11;
            }
        } else if (cursors.left.isDown) {
            player.setVelocityX(-300);
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
        this.load.image('background', 'images/background.png');
        this.load.spritesheet('player', 'images/player.png', { frameWidth: 180, frameHeight: 192 });
        this.load.image('enemy', 'images/enemy.png');
        this.load.image('obstacle', 'images/obstacle.png');
        this.load.image('playerIdle', 'images/idle.png');
        this.load.image('playerJump', 'images/jump.png');
        this.load.image('playerGameover', 'images/lose.png');
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

        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.enemies, ground);
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);

this.obstacles = this.physics.add.group({
    classType: Obstacle,
    runChildUpdate: true,
});

// Generate obstacles periodically
this.time.addEvent({
    // Increase the delay to make obstacles occur less frequently
    delay: Phaser.Math.Between(4000, 5000),
    callback: function() {
        let enemy = this.enemies.getChildren()[this.enemies.getChildren().length - 1];

        const obstacleX = this.sys.game.config.width + 20;
        const obstacleY = groundSprite.y - groundSprite.displayHeight / 2;

        // Create a cluster of obstacles
        for (let i = 0; i < Phaser.Math.Between(1, 5); i++) {
            for (let j = 0; j < Phaser.Math.Between(1, 3); j++) {
                let obstacle = this.obstacles.create(obstacleX + j * 60, obstacleY - i * 60, 'obstacle');
                obstacle.initialX = obstacle.x;  // Store the initial X position
                obstacle.setScale(0.8);
                obstacle.immovable = true;

                obstacle.setVelocityX(500);

                obstacle.body.immovable = true;
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



        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.frameCounter = 0;


    }
    
    update() {
        this.player.update();

        if(this.player.body.touching.down && this.player.body.velocity.x === 0 && !this.background.isScrolling){
            this.player.setTexture('playerIdle');
        }else if(!this.player.body.touching.down){
            this.player.setTexture('playerJump');
        }

        if(this.background.isScrolling){
            this.obstacles.setVelocityX(-660);
        }else{
            this.obstacles.setVelocityX(-500);
        }

        if (this.player.x - this.player.body.width / 2 <= 0 && this.physics.overlap(this.player, this.obstacles)) {
            this.handleCollision(this.player, null);
        }

        this.background.update(this.player, this.cursors);

        if (Math.random() < 0.005) {
            const x = this.sys.game.config.width * 1.3;
            const y = this.background.scale * 12;
            this.enemies.add(new Enemy(this, x, y));
        }

        this.frameCounter ++;
        if (this.frameCounter % 20 === 0 && this.background.isScrolling) {
            this.score += 1;
            this.scoreText.setText('Score: ' + Math.floor(this.score));
        }
        this.enemies.children.iterate((enemy) => {
            if (enemy.x < -10) {
                enemy.alive = false;
            }
        });
    }

    handleCollision(player, enemy) {
        if (enemy !== null && player.body.touching.down && enemy.body.touching.up) {
            enemy.alive = false;
        } else {
            this.player.setTexture('playerGameover');
            player.alive = false;
            player.body.setVelocity(0);
            this.time.delayedCall(250, () => { // Wait for 100 milliseconds
                this.scene.pause(); // Pause the game
            });
            setTimeout(() => {
                this.scene.resume('GameScene');
                this.scene.restart('GameScene');
            }, 2000);
        }
    }
}



const config = {
    type: Phaser.AUTO,
    width: window.innerWidth - 20,
    height: window.innerHeight - 20,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: false
        }
    },
    scene: [GameScene]
};

new Phaser.Game(config);