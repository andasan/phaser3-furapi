import Phaser from 'phaser'

//configuration for phaser
const config = {
  //webGL
  type:Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

let bird = null;
let totalDelta = null;

//loading assets, such as images, music, animation, etc
function preload(){
  // 'this' context = scene
  //contains function and properties we can use
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

//initializing the instances of the objects in the screen
function create(){
  // x axis, y axis, image key
  // this.add.image(config.width/2,config.height/2,'sky');
  this.add.image(0,0,'sky').setOrigin(0,0);
  bird = this.physics.add.sprite(config.width * 0.1, config.height/2, 'bird').setOrigin(0.5)
  bird.body.gravity.y = 200; //distance over time
}

//60fps
function update(time, delta){
  // console.log(bird.body.velocity.y);

  totalDelta += delta;
  if(totalDelta <= 1000) return

  console.log(bird.body.velocity.y);
  totalDelta = 0 
}

new Phaser.Game(config);