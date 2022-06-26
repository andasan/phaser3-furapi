import Phaser from 'phaser'

//configuration for phaser
const config = {
  //webGL
  type:Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //arcade physics plugin, manages physics simulation
    default: 'arcade'
  },
  scene: {
    preload: preload,
    create: create
  }
}

//loading assets, such as images, music, animation, etc
function preload(){
  debugger;
}

//initializing the instances of the objects in the screen
function create(){

}

new Phaser.Game(config);