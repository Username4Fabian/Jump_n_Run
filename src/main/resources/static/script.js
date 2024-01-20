class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.2);
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
            this.setVelocityY(-700); // Jump
        }
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.setVelocityX(-160);
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
            let direction = this.scene.player.x - this.x;
            this.setVelocityX(160 * Math.sign(direction));
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
        if (cursors.right.isDown) {
            if (player.x < this.scene.sys.game.config.width * 0.6) {
                player.setVelocityX(300);
            } else {
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

        this.physics.add.collider(this.enemies, ground);
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
    }

    update() {
        this.player.update();
        this.background.update(this.player, this.cursors);

        if (Math.random() < 0.005) {
            const x = this.sys.game.config.width;
            const y = this.background.scale * 12;
            this.enemies.add(new Enemy(this, x, y));
        }
    }

    handleCollision(player, enemy) {
        if (player.body.touching.down && enemy.body.touching.up) {
            enemy.alive = false;
        } else {
            player.alive = false;
            // Handle player defeat
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
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [GameScene]
};

new Phaser.Game(config);