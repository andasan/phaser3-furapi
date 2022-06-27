import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";

const WIDTH = 800;
const HEIGHT = 600;
const INIT_BIRD_POS = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: INIT_BIRD_POS
}

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scene: [PreloadScene, new MenuScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG)]
};

new Phaser.Game(config);
