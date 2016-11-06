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

function createTriangle() {
  //Create the triangle
  //create triangle graphics
  triangleGraphics = game.add.graphics(0, 0)
  triangleGraphics.beginFill(0xFF0000, 1)
  var scale = .4
  triangleGraphics.drawPolygon([0, 0, 50*scale, 86.6*scale, 100*scale, 0])

  triangle = creepPhysicsGroup.create(game.rnd.between(0, 500), game.rnd.between(0, 500))
  triangle.health = triangleBodyStats.maxHealth
  triangle.addChild(triangleGraphics)
  game.physics.arcade.enable(triangle)
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
  constructor(maxHealth, speed, image) {
    this.maxHealth = maxHealth
    this.speed = speed
    this.image = image
  }
}

// Create the tank stats
var tankWeaponStats = new WeaponStats(100, 500)
var tankBodyStats = new BodyStats(100, 50, 'shipBody')
var tankStats = new Stats(tankBodyStats, [tankWeaponStats])

// Create the machine gun stats
var machineGunWeaponStats = new WeaponStats(25, 200)
var machineGunBodyStats = new BodyStats(100, 50,'shipBody')
var machineGunStats = new Stats(machineGunBodyStats, [machineGunWeaponStats])

// Creeps
var triangleBodyStats = new BodyStats(10, 0, 'triangleBody')
var triangleStats = new Stats(triangleBodyStats, [])

var squareBodyStats = new BodyStats(20, 0, 'squareBody')
var squareStats = new Stats(squareBodyStats, [])

var pentagonBodyStats = new BodyStats(40, 0, 'pentagonBody')
var pentagonStats = new Stats(pentagonBodyStats, [])

// Create the Phaser Gameawaw
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update })

var player
var bullets

// Keys for the game
var aKey
var wKey
var dKey
var sKey
var spaceKey
var cursors

// Graphics objects
var bulletGraphics
var tankGraphics
var triangleGraphics
var bulletBitMap

var creepPhysicsGroup

function collideCallback(sprite) {
  sprite.damage(1)
  console.log(sprite.health)
}

function preload() {
  game.load.baseURL = 'http://examples.phaser.io/assets/'
  game.load.image('bullet', 'sprites/bullet.png')
  game.load.crossOrigin = 'anonymous'
}

function create() {
  creepPhysicsGroup = game.add.physicsGroup()

  //Create the player
  tankGraphics = game.add.graphics(0, 0)
  tankGraphics.beginFill(0xFF0000, 1)
  tankGraphics.drawCircle(0, 0, 33)

  player = game.add.sprite(400, 550)
  player.addChild(tankGraphics)
  game.physics.arcade.enable(player)
  player.body.collideWorldBounds = true
  player.stats = tankStats

  // Tell the Weapon to track the 'player' Sprite, offset by 0px horizontally, 0 vertically
  player.weaponList = []
  for (weaponIndex in player.stats.weaponStatsList) {
    weaponStats = player.stats.weaponStatsList[weaponIndex]
    weapon = weaponStats.makePhaserWeapon()
    player.weaponList.push(weapon)
    weapon.trackSprite(player, 0, 0, true)
  }

  createTriangle()
  createTriangle()


  // Set up key control. Both WASD and cursors.
  aKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
  wKey = game.input.keyboard.addKey(Phaser.Keyboard.W)
  sKey = game.input.keyboard.addKey(Phaser.Keyboard.S)
  dKey = game.input.keyboard.addKey(Phaser.Keyboard.D)
  cursors = game.input.keyboard.createCursorKeys()
}

function update () {

    game.physics.arcade.collide(creepPhysicsGroup, weapon.bullets, collideCallback)

    player.rotation = game.physics.arcade.angleToPointer(player)

    player.body.velocity.x = 0
    player.body.velocity.y = 0

    //Movement
    {
      if (cursors.left.isDown || aKey.isDown) {
          player.body.velocity.x = -300
      }
      if (cursors.right.isDown || dKey.isDown) {
          player.body.velocity.x = 300
      }
      if (cursors.down.isDown || sKey.isDown) {
          player.body.velocity.y = 300
      }
      if (cursors.up.isDown || wKey.isDown) {
          player.body.velocity.y = -300
      }
    }

    // Shooting
    if (game.input.activePointer.isDown) {
      for (weaponIndex in player.weaponList) {
        player.weaponList[weaponIndex].fire()
      }
    }
}
