import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const VELOCITY = 200;
const FLAP_VELOCITY = 250;
let bird = null;
let totalDelta = null;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0.5);
  // bird.body.velocity.x = VELOCITY;

  this.input.keyboard.on('keydown_SPACE', flap);
}

function update(time, delta) {
  // if(bird.x >= config.width - bird.width/2){
  //   bird.body.velocity.x = -VELOCITY
  // }else if(bird.x <= 0 + bird.width/2){
  //   bird.body.velocity.x = VELOCITY
  // }
}

function flap(){
  bird.body.velocity.y = -FLAP_VELOCITY;
}

new Phaser.Game(config);
