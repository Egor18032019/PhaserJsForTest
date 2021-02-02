/* eslint-disable linebreak-style */
import Phaser from 'phaser';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('world');
  }

  /**
     * Life cycles handlers
     */
  preload() {
    this.load.setBaseURL('http://labs.phaser.io'); // откуда скачать

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('car', 'assets/sprites/car.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(110, 110, 'car');
    // Порядок отображения объектов на холсте зависит от того в каком порядке они были объявлены в коде
    const particles = this.add.particles('red');


    const emitter = particles.createEmitter({
      speed: 100,
      scale: {
        start: 1,
        end: 0,
      },
      blenMode: 'ADD',
    });
    console.log(this);

    const logo = this.physics.add.image(400, 100, 'logo'); // добавили физику( а если будут два обьекта ??)
    logo.setVelocity(111, 1); // скорость горизонатальная,вертикальная
    logo.setBounce(1, 1); // прыгучесть
    logo.setCollideWorldBounds(true); // что бы границы оталкивали(так проваливаеться)

    emitter.startFollow(logo); // емитер следуй за лого ))
  }
}
