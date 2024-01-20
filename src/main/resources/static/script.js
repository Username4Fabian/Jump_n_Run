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
var enemies;
var scale;

function preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('player', 'images/player.png');
    this.load.image('enemy', 'images/enemy.png'); 
}

function create() {
    // Get the original size of the background image
    let bgImage = this.textures.get('background').getSourceImage();
    scale = this.sys.game.config.height / bgImage.height;
    let widthScale = this.sys.game.config.width / (bgImage.width * scale);

    bg = this.add.tileSprite(0, 0, bgImage.width, bgImage.height, 'background')
        .setOrigin(0, 0)
        .setScale(scale * widthScale, scale);

    player = this.physics.add.sprite(50, 500, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(0.08);
    this.player = player; 


    // Create an invisible ground
    let ground = this.physics.add.staticGroup();
    let groundSprite = ground.create(scale, this.sys.game.config.height);
    console.log(scale)
    groundSprite.setScale(200, scale * 12).refreshBody();
    groundSprite.setVisible(false);

    // Add collision detection between the player and the ground
    this.physics.add.collider(player, ground);
    cursors = this.input.keyboard.createCursorKeys();

    enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true, // This will call the update method of each enemy
    });

    // Collision between player and enemies
    this.physics.add.collider(enemies, ground)
    this.physics.add.collider(player, enemies, handleCollision, null, this);
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

        // Spawn enemies randomly
        if (Math.random() < 0.005) { // Adjust spawn rate as needed
            const x = config.width; 
            const y = scale * 12;
            enemies.add(new Enemy(this, x, y));
        }
    
        // Update each enemy
        Phaser.Actions.Call(enemies.getChildren(), function(enemy) {
            enemy.update();
        }, this);
    
}

function handleCollision(player, enemy) {
    if (player.body.touching.down && enemy.body.touching.up) {
        // Player jumps on enemy
        enemy.alive = false; // Mark the enemy as defeated
    } else {
        // Player collides with enemy side or bottom
        player.alive = false;
        // Handle player defeat (e.g., end game or restart)
    }
}


class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy'); // 'enemy' should be preloaded image key for enemy
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.setVelocityX(-160); // Enemy moves towards the left; adjust speed as needed
        this.alive = true;
        this.setScale(0.1);
    }

    update() {
        if (!this.alive) {
            this.setVelocityX(0);
            this.setVisible(false);
            this.setActive(false);
            this.body.destroy(); // Remove physics body
        } else {
            // Make enemy run towards player
            let direction = this.scene.player.x - this.x;
            this.setVelocityX(160 * Math.sign(direction)); // Adjust speed as needed
        }
    }
}
