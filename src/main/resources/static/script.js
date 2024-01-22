class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.08);
        this.setCollideWorldBounds(true);
        this.setScale(0.08);
        this.cursors = scene.input.keyboard.createCursorKeys();
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
                this.bg.tilePositionX += 10;
            }
        } else if (cursors.left.isDown) {
            player.setVelocityX(-300);
        } else {
            player.setVelocityX(0);
        }
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('background', 'images/background.png');
        this.load.image('player', 'images/player.png');
        this.load.image('enemy', 'images/enemy.png');
    }

    create() {
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

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.frameCounter = 0;

        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.enemies, ground);
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
    }
    
    update() {
        this.player.update();
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
        if (player.body.touching.down && enemy.body.touching.up) {
            enemy.alive = false;
        } else {
            player.alive = false;
            this.scene.restart('GameScene');
            return;
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