 /*
To Do
========================

Creeps
============
1. Diffrent types of nests
2. AI Creeps
3. Powerups
4. AI Creep spawning points
5. AI creep spawning points give buffs of diffrent types

Classes
============
Drones
======
Overlords
===
1. Rocket Overlord
2. Exploder Overlord
3. Vampire Overlord
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
3. Trap Sniper
Snipers
======
1. Invisible Sniper
2. Charge sniper
Misc
======
1. Trash can
2. Gunner with reload
3. Lasso
4. Grappling hook
5. Shockwave
6. Swordsman
7. Spearman
8. Zapper
Tricksters
======
1. Unit trickster
2. Guy trickster
Melee
======
1. Speedy follower
2. Teleporter
Abilities
============

Misc
============
Auto fire
Auto rotate
*/

/*
When you kill someone you get their whole killReward plus some of their score
*/
class Stats {
  constructor(bodyStats, mountedWeaponStatsList, killReward) {
    this.bodyStats = bodyStats;
    this.mountedWeaponStatsList = mountedWeaponStatsList;
    this.killReward = killReward;
  }

  setStats(guy) {
    guy.stats = this;
    guy.score = 0;
  }

  makePlayer() {
    var player = this.bodyStats.makePlayer();
    player.weaponList = []

    for (var weaponIndex in this.mountedWeaponStatsList) {
      var mountedWeaponStats = this.mountedWeaponStatsList[weaponIndex];
      var newWeapon = new Weapon(mountedWeaponStats);
      player.weaponList.push(newWeapon);
    }

    this.setStats(player);
    return player;
  }

  makeCreep() {
    var creep = this.bodyStats.makeCreep();
    this.setStats(creep);
    return creep;
  }

  makeBullet(mountedWeaponStats) {
    var bullet = this.bodyStats.makeBullet(mountedWeaponStats);
    this.setStats(bullet);
    return bullet;
  }
}

class Weapon {
  constructor(mountedWeaponStats) {
    this.mountedWeaponStats = mountedWeaponStats;
    this.timeTillNextShot = 0;
  }

  fire() {
    bulletStats.makeBullet(this.mountedWeaponStats)
  }
}

class MountedWeaponStats{
  constructor(weaponStats, angle) {
    this.weaponStats = weaponStats;

    if (angle)
      this.angle = angle;
    else
      this.angle = 0;
  }
}

class WeaponStats {
  constructor(reloadTime, bulletSpeed, range) {
    this.reloadTime = reloadTime;
    this.bulletSpeed = bulletSpeed;
    this.range = range;
  }
}

/*
This is an abstract class. That means that you shouldn't instatiate it.
*/
class BodyStats {
  constructor(maxHealth, speed, bodyDamage, fillColor) {
    this.maxHealth = maxHealth;
    this.speed = speed;
    this.bodyDamage = bodyDamage;
    this.fillColor = fillColor;
  }

  setStuff(guy) {
    guy.health = this.maxHealth;
    guy.addChild(this.graphicsCreator());
    this.setBody(guy);
    guy.body.mass = this.maxHealth;
    guy.body.bodyStats = this;
  }

  makeBullet(mountedWeaponStats) {
    var bullet = bullets.create(ship.x, ship.y);
    this.setStuff(bullet);

    bullet.body.setCollisionGroup(bulletCollisionGroup);
    bullet.body.collides([creepCollisionGroup], hitCreep);

    var vector = new Phaser.Point(game.input.activePointer.worldX, game.input.activePointer.worldY)
    vector.subtract(bullet.body.x, bullet.body.y)
    vector.setMagnitude(mountedWeaponStats.weaponStats.bulletSpeed)
    vector.rotate(0, 0, mountedWeaponStats.angle, true);

    bullet.body.velocity.x = vector.x;
    bullet.body.velocity.y = vector.y;

    bullet.lifespan = 1000 * mountedWeaponStats.weaponStats.range / mountedWeaponStats.weaponStats.bulletSpeed;

    return bullet;
  }

  makeCreep() {
    var creep = creeps.create(game.world.randomX, game.world.randomY);
    this.setStuff(creep);

    creep.body.setCollisionGroup(creepCollisionGroup);
    creep.body.collides(creepCollisionGroup); // creeps don't hurt eachother when they collide
    creep.body.collides([playerCollisionGroup, bulletCollisionGroup], hitCreep);

    creep.body.damping = .9;

    return creep;
  }

  makePlayer() {
    var player = players.create(game.world.randomX, game.world.randomY);
    this.setStuff(player);

    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides(creepCollisionGroup, hitCreep, this);

    return player;
  }

  graphicsCreator() {
    var graphics = game.add.graphics()
    graphics.beginFill(this.fillColor, 1);
    graphics.lineStyle(this.bodyDamage*2.1, 0x002b36, 1);
    return graphics;
  }

  setBody(creep) {
    //stub
  }
}

class CircleBodyStats extends BodyStats {
  graphicsCreator() {
    var scale = Math.max(30, this.maxHealth);
    var graphics = super.graphicsCreator();
    graphics.drawCircle(0, 0, scale);
    return graphics;
  }

  setBody(creep) {
    creep.body.setCircle(30);
  }
}

class PolygonBodyStats extends BodyStats {
  polygon() {
    // stub
  }

  graphicsCreator() {
    var graphics = super.graphicsCreator();
    graphics.drawPolygon(this.polygon());
    return graphics;
  }

  setBody(creep) {
    creep.body.clearShapes();
    creep.body.addPolygon({}, this.polygon());
  }
}

class RegularPolygonBodyStats extends PolygonBodyStats {
  sides() {
    // stub
  }

  polygon() {
    var scale = this.maxHealth;
    var list = []
    for (var angle = 2*Math.PI; angle > 0; angle-=2*Math.PI/this.sides()) {
      list.push(Math.cos(angle) * scale);
      list.push(Math.sin(angle) * scale);
    }
    return list
  }
}

class TriangleBodyStats extends RegularPolygonBodyStats {
  sides() { return 3; }
}

class SquareBodyStats extends RegularPolygonBodyStats {
  sides() { return 4; }
}

class PentagonBodyStats extends RegularPolygonBodyStats {
  sides() { return 5; }
}

class HexagonBodyStats extends RegularPolygonBodyStats {
  sides() { return 6; }
}

class OctagonBodyStats extends RegularPolygonBodyStats {
  sides() { return 8; }
}

// The guns
// reloadTime, bulletSpeed, range
var regularGun = new WeaponStats(15, 500, 800);
var fastGun = new WeaponStats(8, 500, 800);
var superFastGun = new WeaponStats(3, 500, 800);

// Create the classes
playerColor = 0x268bd2; // Solarized blue
var tankBodyStats = new CircleBodyStats(100, 50, 5, playerColor);
var tankStats = new Stats(tankBodyStats, [
  new MountedWeaponStats(regularGun)], 20);

var machineGunBodyStats = new CircleBodyStats(100, 50, 5, playerColor);
var machineGunStats = new Stats(machineGunBodyStats, [
  new MountedWeaponStats(fastGun)], 100);

var tripleBodyStats = new CircleBodyStats(100, 50, 5, playerColor);
var tripleStats = new Stats(tripleBodyStats, [
  new MountedWeaponStats(regularGun, -45),
  new MountedWeaponStats(regularGun, 0),
  new MountedWeaponStats(regularGun, 45)], 250);

var quadBodyStats = new CircleBodyStats(100, 50, 5, playerColor);
var quadStats = new Stats(quadBodyStats, [
  new MountedWeaponStats(regularGun, 0),
  new MountedWeaponStats(regularGun, 90),
  new MountedWeaponStats(regularGun, 180),
  new MountedWeaponStats(regularGun, 270)], 200);

var octoBodyStats = new CircleBodyStats(100, 50, 5, playerColor);
var octoStats = new Stats(octoBodyStats, [
  new MountedWeaponStats(regularGun, 0),
  new MountedWeaponStats(regularGun, 45),
  new MountedWeaponStats(regularGun, 90),
  new MountedWeaponStats(regularGun, 135),
  new MountedWeaponStats(regularGun, 180),
  new MountedWeaponStats(regularGun, 225),
  new MountedWeaponStats(regularGun, 270),
  new MountedWeaponStats(regularGun, 325)], 700);

// Creeps
//Example: var triangleBodyStats = new TriangleBodyStats( HEALTH 10, SPEED 0, BODYDAMAGE 0.5, COLOR 0xdc322f); // Solarized yellow
//Example: var triangleStats = new Stats(triangleBodyStats, []);

var triangleBodyStats = new TriangleBodyStats(10, 0, 0.5, 0xdc322f); // Solarized yellow
var triangleStats = new Stats(triangleBodyStats, [], 3);

var squareBodyStats = new SquareBodyStats(20, 0, 1, 0x859900); // Solarized green
var squareStats = new Stats(squareBodyStats, [], 5);

var pentagonBodyStats = new PentagonBodyStats(40, 0, 2, 0x268bd2); // Solarized blue
var pentagonStats = new Stats(pentagonBodyStats, [], 10);

var hexagonBodyStats = new HexagonBodyStats(40, 0, 4, 0xdc322f); // Solarized red
var hexagonStats = new Stats(hexagonBodyStats, [], 20);

var octagonBodyStats = new OctagonBodyStats(100, 0, 4, 0xdc322f); // Solarized red
var octagonStats = new Stats(octagonBodyStats, [], 100);

var bulletBodyStats = new CircleBodyStats(1, 15, 1, playerColor);
var bulletStats = new Stats(bulletBodyStats, [], 0);

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {
}

var ship;

var aKey;
var wKey;
var dKey;
var sKey;
var cursors;

// Phaser groups
var creeps;
var bullets;
var players;

// Physics groups
var creepCollisionGroup;
var playerCollisionGroup;
var bulletCollisionGroup;

function create() {
  aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

  // Set background color
  game.stage.backgroundColor = 0x073642;

  // Make the world fairly large
  game.world.setBounds(0, 0, 2000, 2000);

  //  Enable P2
  game.physics.startSystem(Phaser.Physics.P2JS);

  //  Turn on impact events for the world, without this we get no collision callbacks
  game.physics.p2.setImpactEvents(true);
  var p2 = game.physics.p2;

  // I don't know what this does
  p2.restitution = 0.8;

  //  Create our collision groups. One for the player, one for the creeps
  playerCollisionGroup = p2.createCollisionGroup();
  creepCollisionGroup = p2.createCollisionGroup();
  bulletCollisionGroup = p2.createCollisionGroup();

  //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
  //  (which we do) - what this does is adjust the bounds to use its own collision group.
  // p2.updateBoundsCollisionGroup();

  // Initialize the groups
  creeps = game.add.group();
  creeps.enableBody = true;
  creeps.physicsBodyType = Phaser.Physics.P2JS;

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.P2JS;

  players = game.add.group();
  players.enableBody = true;
  players.physicsBodyType = Phaser.Physics.P2JS;

  //  Create our ship sprite
  ship = quadStats.makePlayer();
  game.camera.follow(ship);

  cursors = game.input.keyboard.createCursorKeys();
}

function hitCreep(body1, body2) {
  var sprite1 = body1.sprite;
  var sprite2 = body2.sprite;

  sprite1.damage(sprite2.stats.bodyStats.bodyDamage);
  sprite2.damage(sprite1.stats.bodyStats.bodyDamage);

  sprite1.alpha = 0.2 + sprite1.health / sprite1.stats.bodyStats.maxHealth;
  sprite2.alpha = 0.2 + sprite2.health / sprite2.stats.bodyStats.maxHealth;

  // moving score from any dead parties to alive parties
  if (sprite1.health < 0)
    sprite2.score += sprite1.stats.killReward + sprite1.score * 0.4;
  if (sprite2.health < 0)
    sprite1.score += sprite2.stats.killReward + sprite2.score * 0.4;
}

function update() {
  // Spawn new triangles
  if (Math.random() <= 0.01)
    triangleStats.makeCreep();
  else if (Math.random() <= 0.003)
    squareStats.makeCreep();
  else if (Math.random() <= 0.01)
    pentagonStats.makeCreep();
  else if (Math.random() <= 0.005)
    hexagonStats.makeCreep();
  else if (Math.random() <= 0.0000005)
    octagonStats.makeCreep();

  ship.body.setZeroVelocity();
  //Movement
  if (cursors.left.isDown || aKey.isDown)
      ship.body.moveLeft(200);
  else if (cursors.right.isDown || dKey.isDown)
      ship.body.moveRight(200);

  if (cursors.up.isDown || wKey.isDown)
      ship.body.moveUp(200);
  else if (cursors.down.isDown || sKey.isDown)
      ship.body.moveDown(200);

  if (true) {
    for (weaponIndex in ship.weaponList) {
      var weapon = ship.weaponList[weaponIndex]

      if (weapon.timeTillNextShot <= 0) {
        weapon.fire();
        weapon.timeTillNextShot = weapon.mountedWeaponStats.weaponStats.reloadTime;
      }

      weapon.timeTillNextShot--;
    }
  }
}
