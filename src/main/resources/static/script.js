var config = {
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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var bg;

function preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('player', 'images/player.png');
}

function create() {
    // Get the original size of the background image
    let bgImage = this.textures.get('background').getSourceImage();
    let scale = this.sys.game.config.height / bgImage.height;
    let widthScale = this.sys.game.config.width / (bgImage.width * scale);

    bg = this.add.tileSprite(0, 0, bgImage.width, bgImage.height, 'background')
        .setOrigin(0, 0)
        .setScale(scale * widthScale, scale);

    player = this.physics.add.sprite(50, 500, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(0.08);

    // Create an invisible ground
    let ground = this.physics.add.staticGroup();
    let groundSprite = ground.create(scale, this.sys.game.config.height);
    console.log(scale)
    groundSprite.setScale(200, scale * 12).refreshBody();
    groundSprite.setVisible(false);

    // Add collision detection between the player and the ground
    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.right.isDown) {
        if (player.x < game.config.width * 0.6) {
            player.setVelocityX(300); // Increase velocity for faster movement
        } else {
            player.setVelocityX(0); // Stop the player
            bg.tilePositionX += 10; // Scroll the background at a faster speed
        }
    } else if (cursors.left.isDown) {
        player.setVelocityX(-300); // Increase velocity for faster movement
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-700); // Increase velocity for higher jump
    }

    // Add some drag to the player's movement
    player.body.velocity.x *= 0.9;

    // Only reset the player's vertical velocity if they're not currently jumping
    if (player.body.touching.down && player.body.velocity.y > 0) {
        player.body.velocity.y = 0;
    }
}