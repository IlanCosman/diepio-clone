/*
To Do
==========
1. Fix Images
2. Auto fire
3. Auto rotate
4. Classes
5. Creeps
6. Add momentum
*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
  game.load.baseURL = 'http://examples.phaser.io/assets/';
  game.load.image('bullet', 'sprites/bullet.png');
  game.load.crossOrigin = 'anonymous';
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
var bulletGraphics;
var tankGraphics;
var weapon;
var bulletBitMap;
function create() {
    tankGraphics = game.add.graphics(0, 0);
    tankGraphics.beginFill(0xFF0000, 1);
    tankGraphics.drawCircle(0, 0, 33);

    player = game.add.sprite(400, 550);
    player.addChild(tankGraphics);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    bulletBitMap = game.add.bitmapData(32, 32);

    var grd = bulletBitMap.context.createLinearGradient(0, 0, 0, 32);

    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    bulletBitMap.context.fillStyle = grd;

    bulletBitMap.context.fillRect(1, 1, 10, 10);
    game.cache.addBitmapData('bulletBitMap', bulletBitMap);

    weapon = game.add.weapon(32, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;
    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(player, 14, 0);


    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    cursors = game.input.keyboard.createCursorKeys();
}
function update () {
    player.rotation = game.physics.arcade.angleToPointer(player);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    //Movement
    {
      if (cursors.left.isDown || aKey.isDown)
      {
          player.body.velocity.x = -300;
      }
      if (cursors.right.isDown || dKey.isDown)
      {
          player.body.velocity.x = 300;
      }
      if (cursors.down.isDown || sKey.isDown)
      {
          player.body.velocity.y = 300;
      }
      if (cursors.up.isDown || wKey.isDown)
      {
          player.body.velocity.y = -300;
      }
    }//Movement
    if (game.input.activePointer.isDown)
       {
          console.log('test');
           weapon.fire();
       }
}
