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

class Body {
  constructor(bodyStats) {
    this.bodyStats = bodyStats
    this.health = bodyStats.maxHealth;
  }
}

class Ship extends Body {
  constructor(stats){
    super(stats.bodyStats)
    this.stats = stats;
  }
  upgrade(newStats){
    this.stats = newStats;
    //TODO note that this will have to also update the bodyStats in the Body
  }
}

class Stats {
  constructor(weaponStats, bodyStats) {
    this.weaponStats = weaponStats;
    this.bodyStats = bodyStats;
  }
}

class WeaponStats {
  constructor(fireRate, bulletSpeed) {
    this.fireRate = fireRate;
    this.bulletSpeed = bulletSpeed;
  }

  makePhaserWeapon() {
    // Create weapon
    weapon = game.add.weapon(500, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = this.bulletSpeed;
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = this.fireRate;

    return weapon;
  }
}

class BodyStats {
  constructor(maxHealth, speed, image) {
    this.maxHealth = maxHealth;
    this.speed = speed;
    this.image = image;
  }
}

// Create the tank stats
var tankWeaponStats = new WeaponStats(100, 500);
var tankBodyStats = new BodyStats(100, 50, 'shipBody');
var tankStats = new Stats(tankWeaponStats, tankBodyStats);

// Create the machine gun stats
var machineGunWeaponStats = new WeaponStats(25, 200)
var machineGunBodyStats = new BodyStats(100, 50,'shipBody')
var machineGunStats = new Stats(machineGunWeaponStats, machineGunBodyStats)

// Put the statas in a Ship
var ship = new Ship(machineGunStats);

var triangleBodyStats = new BodyStats(10, 0, 'triangleBody')
var squareBodyStats = new BodyStats(20, 0, 'squareBody')
var pentagonBodyStats = new BodyStats(40, 0, 'pentagonBody')

var testTriangle = new Body(triangleBodyStats)

// Create the Phaser Game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var player;
var bullets;
var weapon;

// Keys for the game
var aKey;
var wKey;
var dKey;
var sKey;
var spaceKey;
var cursors;

// Graphics objects
var bulletGraphics;
var tankGraphics;
var bulletBitMap;

function preload() {
  game.load.baseURL = 'http://examples.phaser.io/assets/';
  game.load.image('bullet', 'sprites/bullet.png');
  game.load.crossOrigin = 'anonymous';
}

function create() {
  //Create the player
  tankGraphics = game.add.graphics(0, 0);
  tankGraphics.beginFill(0xFF0000, 1);
  tankGraphics.drawCircle(0, 0, 33);

  player = game.add.sprite(400, 550);
  player.addChild(tankGraphics);
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;

  // Create bullets
  bulletBitMap = game.add.bitmapData(32, 32);
  var grd = bulletBitMap.context.createLinearGradient(0, 0, 0, 32);
  grd.addColorStop(0, '#8ED6FF');
  grd.addColorStop(1, '#004CB3');
  bulletBitMap.context.fillStyle = grd;

  bulletBitMap.context.fillRect(1, 1, 10, 10);
  game.cache.addBitmapData('bulletBitMap', bulletBitMap);

  //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
  weapon = ship.stats.weaponStats.makePhaserWeapon()
  weapon.trackSprite(player, 0, 0, true);

  // Set up key control. Both WASD and cursors.
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
      if (cursors.left.isDown || aKey.isDown) {
          player.body.velocity.x = -300;
      }
      if (cursors.right.isDown || dKey.isDown) {
          player.body.velocity.x = 300;
      }
      if (cursors.down.isDown || sKey.isDown) {
          player.body.velocity.y = 300;
      }
      if (cursors.up.isDown || wKey.isDown) {
          player.body.velocity.y = -300;
      }
    }

    // Shooting
    if (game.input.activePointer.isDown) {
      weapon.fire();
    }
}
