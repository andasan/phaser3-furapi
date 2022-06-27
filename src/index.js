import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const FLAP_VELOCITY = 250;
const INIT_BIRD_POS = { x: config.width * 0.1, y: config.height / 2 };
const PIPE_GAP_RANGE = [150, 250];
const PIPES_TO_RENDER = 4;
const PIPE_X_GAP = 400;

let bird = null;
let upperPipe = null;
let lowerPipe = null;
let pipeHorizontalGap = 0;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  bird = this.physics.add
    .sprite(INIT_BIRD_POS.x, INIT_BIRD_POS.y, "bird")
    .setOrigin(0.5);
  bird.body.gravity.y = 400;

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    pipeHorizontalGap += PIPE_X_GAP;
    let pipeGap = Phaser.Math.Between(...PIPE_GAP_RANGE);
    let pipePos = Phaser.Math.Between(0 + 20, config.height - 20 - pipeGap);

    upperPipe = this.physics.add.sprite(pipeHorizontalGap, pipePos, "pipe").setOrigin(0, 1);
    lowerPipe = this.physics.add.sprite(upperPipe.x, upperPipe.y + pipeGap, "pipe").setOrigin(0, 0);

    upperPipe.body.velocity.x = -200;
    lowerPipe .body.velocity.x = -200;
  }

  this.input.keyboard.on("keydown_SPACE", flap);
  this.input.on("pointerdown", flap);
}

function update(time, delta) {
  // if(bird.x >= config.width - bird.width/2){
  //   bird.body.velocity.x = -VELOCITY
  // }else if(bird.x <= 0 + bird.width/2){
  //   bird.body.velocity.x = VELOCITY
  // }

  if (bird.y > config.height || bird.y < -bird.height) {
    restartPosition();
  }
}

function flap() {
  bird.body.velocity.y = -FLAP_VELOCITY;
}

function restartPosition() {
  bird.x = INIT_BIRD_POS.x;
  bird.y = INIT_BIRD_POS.y;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
