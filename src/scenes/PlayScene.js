import Phaser from "phaser";

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;

    this.bird = null;
    this.pipes = null;
    
    this.PIPE_GAP_RANGE = [150, 250];
    this.PIPE_X_GAP_RANGE = [400, 500];
    this.FLAP_VELOCITY = 250;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBG();
    this.createBird();
    this.createPipes();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG(){
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird(){
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0.5);
    this.bird.body.gravity.y = 400;
  }

  createPipes(){
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.pipePlacement(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  handleInputs(){
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
    this.input.on("pointerdown", this.flap, this);
  }

  checkGameStatus(){
    if (this.bird.y > this.config.height || this.bird.y < -this.bird.height)
      this.restartPosition();
  }

  flap() {
    this.bird.body.velocity.y = -this.FLAP_VELOCITY;
  }

  pipePlacement(uPipe, lPipe){
    const rightMostX = this.getNextPipe();
    const pipeYGap = Phaser.Math.Between(...this.PIPE_GAP_RANGE);
    const pipePos = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeYGap);
    const pipeHorizontalGap = Phaser.Math.Between(...this.PIPE_X_GAP_RANGE)
  
    uPipe.x = rightMostX + pipeHorizontalGap;
    uPipe.y = pipePos;
  
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeYGap;
  }

  getNextPipe(){
    let rightMostX = 0;
  
    this.pipes.getChildren().forEach(pipe => {
      rightMostX = Math.max(pipe.x, rightMostX)
    })
  
    return rightMostX
  }
  
  recyclePipes(){
    const tempPipes = []
    this.pipes.getChildren().forEach(pipe => {
      if(pipe.getBounds().right < 0){
        tempPipes.push(pipe)
  
        if(tempPipes.length === 2){
          this.pipePlacement(...tempPipes)
        }
      }
    })
  }
  
  restartPosition() {
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
    this.bird.body.velocity.y = 0;
  }
}

export default PlayScene;
