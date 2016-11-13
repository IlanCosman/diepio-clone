function createCreep(stats) {
  creep = creepPhysicsGroup.create(game.rnd.between(0, 500), game.rnd.between(0, 500))
  creep.health = stats.bodyStats.maxHealth
  creep.addChild(stats.bodyStats.graphicsCreator())
  game.physics.p2.enable(creep)
  creep.body.drag.set(80)
  creep.body.mass = stats.bodyStats.maxHealth * 50
}

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
  constructor(maxHealth, speed, graphicsCreator) {
    this.maxHealth = maxHealth
    this.speed = speed
    this.graphicsCreator = graphicsCreator
  }
}


function makeCircleGraphics() {
  graphics = game.add.graphics(0, 0)
  graphics.beginFill(0xFF0000, 1)
  graphics.drawCircle(0, 0, 30)
  return graphics
}

// Create the tank stats
var tankWeaponStats = new WeaponStats(100, 500)
var tankBodyStats = new BodyStats(100, 50, makeCircleGraphics)
var tankStats = new Stats(tankBodyStats, [tankWeaponStats])

// Create the machine gun stats
var machineGunWeaponStats = new WeaponStats(25, 200)
var machineGunBodyStats = new BodyStats(100, 50, makeCircleGraphics)
var machineGunStats = new Stats(machineGunBodyStats, [machineGunWeaponStats])

// Creeps
function makeTriangleGraphics() {
  graphics = game.add.graphics(0, 0)
  graphics.beginFill(0xFF0000, 1)
  var scale = .4
  graphics.drawPolygon([0, 0, 50*scale, 86.6*scale, 100*scale, 0])
  return graphics
}
var triangleBodyStats = new BodyStats(10, 0, makeTriangleGraphics)
var triangleStats = new Stats(triangleBodyStats, [])

function makeSquareGraphics() {
  graphics = game.add.graphics()
  graphics.beginFill(0xFFFF00, 1)
  graphics.drawRect(0, 0, 40, 40)
  return graphics
}
var squareBodyStats = new BodyStats(20, 0, makeSquareGraphics)
var squareStats = new Stats(squareBodyStats, [])

function makePentagonGraphics() {
    graphics = game.add.graphics(0, 0)
    graphics.beginFill(0x0000FF, 1)
    var scale = .9
    graphics.drawPolygon([0, 0, 50*scale, 86.6*scale, 100*scale, 0])
    return graphics
}
var pentagonBodyStats = new BodyStats(40, 0, makePentagonGraphics)
var pentagonStats = new Stats(pentagonBodyStats, [])

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {
    game.load.spritesheet('ship', 'assets/sprites/humstar.png', 32, 32);
    game.load.image('panda', 'assets/sprites/spinObj_01.png');
    game.load.image('sweet', 'assets/sprites/spinObj_06.png');
}

var ship;
var starfield;
var cursors;

function create() {

    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    var p2 = game.physics.p2

    p2.restitution = 0.8;

    //  Create our collision groups. One for the player, one for the pandas
    var playerCollisionGroup = p2.createCollisionGroup();
    var pandaCollisionGroup = p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    p2.updateBoundsCollisionGroup();

    var pandas = game.add.group();
    pandas.enableBody = true;
    pandas.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < 4; i++)
    {
        var panda = pandas.create(game.world.randomX, game.world.randomY, 'panda');
        panda.body.setRectangle(40, 40);

        //  Tell the panda to use the pandaCollisionGroup
        panda.body.setCollisionGroup(pandaCollisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        panda.body.collides([pandaCollisionGroup, playerCollisionGroup]);
    }

    //  Create our ship sprite
    ship = game.add.sprite(200, 200);
    ship.addChild(makeCircleGraphics())

    p2.enable(ship, false);
    ship.body.setCircle(30);
    ship.body.fixedRotation = true;

    //  Set the ships collision group
    ship.body.setCollisionGroup(playerCollisionGroup);

    //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When pandas collide with each other, nothing happens to them.
    ship.body.collides(pandaCollisionGroup, hitPanda, this);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
}

function hitPanda(body1, body2) {
    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
    body2.sprite.alpha -= 0.1;
}

function update() {

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
