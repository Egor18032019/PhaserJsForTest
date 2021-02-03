/* eslint-disable linebreak-style */
import Phaser from 'phaser';
import sky from '../assets/sky.png';
import ground from '../assets/platform.png';
import star from '../assets/star.png';
import bomb from '../assets/bomb.png';
import dude from '../assets/dude.png';


export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('world');
    this.cursors = null;
    this.player = null;
    this.stars = null;
    this.bombs = null;
    this.gameOver = false;
    this.state = {
      score: 0,
    };
  }

  /**
     * Life cycles handlers
     */
  preload() {
    this.load.image('sky', sky);
    this.load.image('ground', ground);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png');

    this.load.spritesheet('dude', dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

 

  create() {
    this.add.image(400, 300, 'sky'); // по умолчанию в Phaser 3 координаты всех игровых объектов задаются их центром
    // Если этот способ размещения вам не подходит, измените его с помощью метода setOrigin
    this.add.image(400, 300, 'star');
    // Порядок отображения объектов на холсте зависит от того в каком порядке они были объявлены в коде


    // создаем класс статических тел
    const platforms = this.physics.add.staticGroup();

    // создаем 4платформы разного размера
    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // setScale увеличили и потом надо обновить refreshBody()
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // создаем спрайт (по умолчанию динамического типа)
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({
      key: 'left', // Анимация left использует кадры 0, 1, 2 и 3 и работает со скоростью 10 кадров в секунду.
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1, // Значение -1 свойства repeat указывает, что анимация будет циклично повторяться.
    });

    this.anims.create({
      key: 'turn',
      frames: [{
        key: 'dude',
        frame: 4,
      }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });


    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70,
      }, // с x: 12, y: 0 через интервал в 70 пикселей.
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    const scoreText = this.add.text(16, 16, 'Счет: 0', {
      fontSize: '32px',
      fill: '#000',
    });
    const collectStar = (players, stars) => {
      stars.disableBody(true, true);
      this.state.score += 10;
      scoreText.setText(`Score: ${this.state.score}`);

      if (this.stars.countActive(true) === 0) { // countActive - чтобы увидеть, сколько у нас активных звезд
        this.stars.children.iterate((child) => {
          child.enableBody(true, child.x, 0, true, true);
        });

        const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bomba = this.bombs.create(x, 16, 'bomb');
        bomba.setBounce(1);
        bomba.setCollideWorldBounds(true); // чтобы она сталкивалась
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    };

    const hitBomb = () => {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      const particles = this.add.particles('red');

      // создаем класс динамических тел
      const emitter = particles.createEmitter({
        speed: 100,
        scale: {
          start: 1,
          end: 0,
        },
        blenMode: 'ADD',
      });

      emitter.startFollow(this.player); // емитер следуй за лого ))
      this.gameOver = true;
    };

    this.physics.add.collider(this.player, platforms); // берет два объекта и проверяет, сталкиваются ли они
    this.physics.add.collider(this.stars, platforms); // проверка на столкновения
    this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

    // добавим бобмы
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) // также проверяем, касается ли он платформы
    {
      this.player.setVelocityY(-444);
    }
  }
}
