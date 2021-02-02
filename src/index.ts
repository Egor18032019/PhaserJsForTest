
import Phaser from 'phaser';
import WorldScene from './scenes/WorldScene.js';
import MyScene from './scenes/MyScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [
    WorldScene, MyScene],
};

const game = new Phaser.Game(config);

export default game;
