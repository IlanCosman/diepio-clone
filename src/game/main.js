/*
To Do
========================

Creeps
============
1. Octagons
2. Diffrent types of nests
3. AI Creeps
4. Powerups
5. AI Creep spawning points
6. AI creep spawning points give buffs of diffrent types

Classes
============

Drones
======

Overlords
===
1. Rocket Overlord
2. Exploder Overlord

Necromancers
===
1. Creep Necromancer
2. Pentagon Necromancer (can have alpha pentagon)
3. Triangle Necromancer
4. Square Necromancer

Traps
======
1. Exploding Traps
2. Laser Trip Wire
3.

Snipers
======
Invisi
Shotgunner
TRash can
gunner with reload

Abilities
============

Misc
============
1. Fix Images
2. Auto fire
3. Auto rotate
4. Classes
5. Creeps
6. Add momentum
7. Collisions


*/
class Entity {
  constructor(health) {
    this.health = health;
  }
}
class Ship extends Entity {
  constructor(stats){
    super(stats.bodyStats.maxHealth)
    this.stats = stats;
  }
  upgrade(newStats){
    this.stats = newStats;
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
}
class BodyStats {
  constructor(maxHealth, speed) {
    this.maxHealth = maxHealth;
    this.speed = speed;
  }
}

var tankWeaponStats = new WeaponStats(100, 500);
var tankBodyStats = new BodyStats(100, 50);
var tankStats = new Stats(tankWeaponStats, tankBodyStats);

var machineGunWeaponStats = new WeaponStats(25, 200)
var machineGunBodyStats = new BodyStats(100, 50)
var machineGunStats = new Stats(machineGunWeaponStats, machineGunBodyStats)

var ship = new Ship(machineGunStats);

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var player;
var bullets;
var weapon;

var aKey;
var wKey;
var dKey;
var sKey;
var spaceKey;
var cursors;

var bulletGraphics;
var tankGraphics;
var bulletBitMap;

function preload() {
  game.load.baseURL = 'http://examples.phaser.io/assets/';
  game.load.image('bullet', 'sprites/bullet.png');
  game.load.crossOrigin = 'anonymous';
}


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

    weapon = game.add.weapon(500, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = ship.stats.weaponStats.bulletSpeed;
    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(player, 0, 0, true);
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = ship.stats.weaponStats.fireRate;


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
      weapon.fire();
    }
}
