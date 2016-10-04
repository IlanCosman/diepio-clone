
/*
To Do
==========
1. Fix Images
2. Auto fire
3. Auto rotate
4. Classes
5. Creeps

*/

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    //game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('ship', 'sprites/thrust_ship2.png');
    game.load.image('bullet', './Bullet.png');

}

var player;
var bullets;

var aKey;
var wKey;
var dKey;
var sKey;
var spaceKey;
var cursors;

var bulletTime = 0 ;
var bullet;
var tank;

function create() {

    bullets = game.add.physicsGroup();
    bullets.createMultiple(32, 'bullet', false);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    tank = game.add.graphics(0, 0);
    tank.beginFill(0xFF0000, 1);
    tank.drawCircle(0, 0, 33);

    player = game.add.sprite(400, 550);
    player.addChild(tank);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W)
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S)
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D)
    cursors = game.input.keyboard.createCursorKeys();

    //player.body.allowRotation = false; // the example had this but it doesn't seem to do anything
}
function update () {
    player.rotation = game.physics.arcade.angleToPointer(player);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if (cursors.left.isDown || aKey.isDown)
    {
        player.body.velocity.x = -600;
    }
    if (cursors.right.isDown || dKey.isDown)
    {
        player.body.velocity.x = 600;
    }
    if (cursors.down.isDown || sKey.isDown)
    {
        player.body.velocity.y = 600;
    }
    if (cursors.up.isDown || wKey.isDown)
    {
        player.body.velocity.y = -600;
    }
    if (game.input.activePointer.isDown)
    {
        fireBullet();
    }

}

function fireBullet () {

    if (game.time.time > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 6, player.y - 12);
            game.physics.arcade.moveToPointer(bullet, 300)
            bulletTime = game.time.time + 500;
        }
    }

}
