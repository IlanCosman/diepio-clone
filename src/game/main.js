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
1. Fix Images
2. Auto fire
3. Auto rotate
4. Classes
5. Creeps
6. Add momentum
7. Collisions
*/

class Stats {
  constructor(bodyStats, weaponStatsList) {
    this.bodyStats = bodyStats
    this.weaponStatsList = weaponStatsList
  }
}

class WeaponStats {
  constructor(fireRate, bulletSpeed) {
    this.fireRate = fireRate
    this.bulletSpeed = bulletSpeed
  }

  makePhaserWeapon() {
    // Create weapon
    var weapon = game.add.weapon(500, 'bullet')
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = this.bulletSpeed
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = this.fireRate

    return weapon
  }
}

class BodyStats {
  constructor(maxHealth, speed) {
    this.maxHealth = maxHealth;
    this.speed = speed;
  }

  make() {
    var creep = creeps.create(game.world.randomX, game.world.randomY, 'ship');
    creep.health = this.maxHealth;
    creep.addChild(this.graphicsCreator());
    creep.body.setRectangle(20, 20);

    // Tell the creep to use the creepCollisionGroup
    creep.body.setCollisionGroup(creepCollisionGroup);

    creep.body.collides([creepCollisionGroup, playerCollisionGroup]);

    return creep
  }

  graphicsCreator() {
    //stub
  }

  setBody(creep) {
    //stub
  }
}

class CircleBodyStats extends BodyStats {
  graphicsCreator() {
    var graphics = game.add.graphics(0, 0)
    graphics.beginFill(0xFF0000, 1)
    graphics.drawCircle(0, 0, 30)
    return graphics
  }

  setBody(creep) {
    creep.body.setCircle(30)
  }
}

class SquareBodyStats extends BodyStats {
  graphicsCreator() {
    var graphics = game.add.graphics(0, 0)
    graphics.beginFill(0xFFFF00, 1)
    graphics.drawRect(-20, -20, 40, 40)
    return graphics
  }

  setBody(creep) {
    creep.body.setRect(20, 20)
  }
}

class TriangleBodyStats extends BodyStats {
  graphicsCreator() {
    var graphics = game.add.graphics(0, 0)
    graphics.beginFill(0xFF0000, 1)
    var scale = .4
    graphics.drawPolygon([0, 0, 50*scale, 86.6*scale, 100*scale, 0])
    return graphics
  }

  setBody(creep) {
    // TODO
  }
}

class PentagonBodyStats extends BodyStats {
  graphicsCreator() {
    var graphics = game.add.graphics(0, 0)
    graphics.beginFill(0x0000FF, 1)
    var scale = .9
    graphics.drawPolygon([0, 0, 50*scale, 86.6*scale, 100*scale, 0])
    return graphics
  }

  setBody(creep) {
    // TODO
  }
}

// Create the tank stats
var tankWeaponStats = new WeaponStats(100, 500)
var tankBodyStats = new CircleBodyStats(100, 50)
var tankStats = new Stats(tankBodyStats, [tankWeaponStats])

// Create the machine gun stats
var machineGunWeaponStats = new WeaponStats(25, 200)
var machineGunBodyStats = new CircleBodyStats(100, 50)
var machineGunStats = new Stats(machineGunBodyStats, [machineGunWeaponStats])

// Creeps
var triangleBodyStats = new TriangleBodyStats(10, 0)
var triangleStats = new Stats(triangleBodyStats, [])

var squareBodyStats = new SquareBodyStats(20, 0)
var squareStats = new Stats(squareBodyStats, [])

var pentagonBodyStats = new PentagonBodyStats(40, 0)
var pentagonStats = new Stats(pentagonBodyStats, [])

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {
  game.load.spritesheet('ship', 'assets/sprites/humstar.png', 32, 32);
  game.load.image('creep', 'assets/sprites/spinObj_01.png');
}

var ship;
var starfield;
var cursors;

var creeps;
var creepCollisionGroup;
var playerCollisionGroup;

function create() {
  //  Enable P2
  game.physics.startSystem(Phaser.Physics.P2JS);

  //  Turn on impact events for the world, without this we get no collision callbacks
  game.physics.p2.setImpactEvents(true);
  var p2 = game.physics.p2

  // I don't know what this does
  p2.restitution = 0.8;

  //  Create our collision groups. One for the player, one for the creeps
  playerCollisionGroup = p2.createCollisionGroup();
  creepCollisionGroup = p2.createCollisionGroup();

  //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
  //  (which we do) - what this does is adjust the bounds to use its own collision group.
  p2.updateBoundsCollisionGroup();

  creeps = game.add.group();
  creeps.enableBody = true;
  creeps.physicsBodyType = Phaser.Physics.P2JS;

  //  Create our ship sprite
  ship = game.add.sprite(200, 200);
  ship.addChild(tankBodyStats.graphicsCreator())

  p2.enable(ship, false);
  ship.body.setCircle(30);
  ship.body.fixedRotation = true;

  //  Set the ships collision group
  ship.body.setCollisionGroup(playerCollisionGroup);

  //  The ship will collide with the creeps, and when it strikes one the hitCreep callback will fire, causing it to alpha out a bit
  //  When creeps collide with each other, nothing happens to them.
  ship.body.collides(creepCollisionGroup, hitCreep, this);

  game.camera.follow(ship);

  cursors = game.input.keyboard.createCursorKeys();
}

function hitCreep(body1, body2) {
  //  body1 is the space ship (as it's the body that owns the callback)
  //  body2 is the body it impacted with, in this case our creep
  //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
  body2.sprite.alpha -= 0.1;
}

function update() {
  // Spawn new triangles
  if (Math.random() <= 0.01) {
    triangleBodyStats.make()
  } else if (Math.random() <= 0.003) {
    squareBodyStats.make()
  } else if (Math.random() <= 0.001) {
    pentagonBodyStats.make()
  }

  ship.body.setZeroVelocity();

  if (cursors.left.isDown)
  {
      ship.body.moveLeft(200);
  }
  else if (cursors.right.isDown)
  {
      ship.body.moveRight(200);
  }

  if (cursors.up.isDown)
  {
      ship.body.moveUp(200);
  }
  else if (cursors.down.isDown)
  {
      ship.body.moveDown(200);
  }

  if (!game.camera.atLimit.x)
  {
      starfield.tilePosition.x += (ship.body.velocity.x * 16) * game.time.physicsElapsed;
  }

  if (!game.camera.atLimit.y)
  {
      starfield.tilePosition.y += (ship.body.velocity.y * 16) * game.time.physicsElapsed;
  }
}
