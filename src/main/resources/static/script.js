var config = {
    type: Phaser.AUTO,
    width: window.innerWidth - 20,
    height: window.innerHeight - 20,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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

    // Calculate the scale factor to fit the height of the game canvas
    let scale = this.sys.game.config.height / bgImage.height;

    // Create the tileSprite with the calculated scale factor
    bg = this.add.tileSprite(0, 0, bgImage.width * scale, this.sys.game.config.height, 'background')
        .setOrigin(0, 0)
        .setScale(scale);

    player = this.physics.add.sprite(50, 400, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(0.08);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.right.isDown) {
        player.setVelocityX(-160);
        bg.tilePositionX += 5;
    } else if (cursors.left.isDown) {
        player.setVelocityX(160);
        bg.tilePositionX -= 5;
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-330);
    }

    // Add some drag to the player's movement
    player.body.velocity.x *= 0.9;

    // Check if the player is touching the ground
    if (player.body.blocked.down) {
        // Reset the player's vertical velocity
        player.body.velocity.y = 0;
    }
}