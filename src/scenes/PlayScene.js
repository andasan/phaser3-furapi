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
    this.FLAP_VELOCITY = 300;

    this.score = 0;
    this.scoreText = '';
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
    this.createColliders();
    this.createScore();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0);
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setImmovable(true).setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setImmovable(true).setOrigin(0, 0);

      this.pipePlacement(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore(){
    const bestScore = localStorage.getItem('bestScore') || 0;

    this.scoreText = this.add.text(16,16, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
    this.add.text(16, 52, `Best score: ${bestScore}`, { fontSize: '18px', fill: '#000' });
  }

  handleInputs() {
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
    this.input.on("pointerdown", this.flap, this);
  }

  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
        this.gameOver();
      }
  }

  flap() {
    this.bird.body.velocity.y = -this.FLAP_VELOCITY;
  }

  pipePlacement(uPipe, lPipe) {
    const rightMostX = this.getNextPipe();
    const pipeYGap = Phaser.Math.Between(...this.PIPE_GAP_RANGE);
    const pipePos = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeYGap
    );
    const pipeHorizontalGap = Phaser.Math.Between(...this.PIPE_X_GAP_RANGE);

    uPipe.x = rightMostX + pipeHorizontalGap;
    uPipe.y = pipePos;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeYGap;
  }

  getNextPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);

        if (tempPipes.length === 2) {
          this.pipePlacement(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
        }
      }
    });
  }

  saveBestScore(){
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if(!bestScore || this.score > bestScore){
        localStorage.setItem('bestScore', this.score);
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);

    this.saveBestScore();

    this.time.addEvent({
        delay: 1000,
        callback: () => {
            this.scene.restart();
        },
        loop: false
    })
  }

  increaseScore(){
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
