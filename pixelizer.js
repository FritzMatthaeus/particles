/**
 *Creates an instance of Pixelizer.
 *
 * is initiated on creation. to manually initiate pass option autoinit: false
 * @param {*} [{
 *     canvas = null, //mandatory: DOM-Selector, eg '#canvas'
 *     src, //mandatory: Image Source as string, eg './image.svg'
 *     options: { // optional
 *       pixelRadius = 5, // size of pixels
 *       amount = 150, // amount of pixel
 *       threshhold = 150, //range: 1-10, threshhold for pixel values from original img
 *       colors = ["#FFFFFF"], // possible colors
 *       verticalDistribution = 5, // how far pixels fly around vertically
 *       horizontalDistribution = 5, // how far pixels fly around horizontally
 *       friction = false, // use friction: if true, speed is ignored
 *       frictionValue = 1, // range: 1-10, speed variety between pixels
 *       autoinit = true // wether animation starts on instance creation
 *       autostop = 100 // stops the rendering loop after give iterations
 *       speed = 100 // 1-1000: how fast pixels will get to destination
 *     } = {},
 *   }={}]
 * @memberof Pixelizer
 */

export default class Pixelizer {
  constructor({
    canvas = null,
    src,
    options: {
      pixelRadius = 0,
      amount = 150,
      threshhold = 150,
      colors = ["#FFFFFF"],
      verticalDistribution = 5,
      horizontalDistribution = 5,
      friction = false, // use friction
      frictionValue = 1, // 1 - 10,
      autoinit = true,
      autostop = 100,
      speed = 10, // 1-100 (fast - slow)
    } = {},
  } = {}) {
    if (canvas === null || typeof src === "undefined") {
      console.log(canvas, src);
      return;
    }

    //### select div with canvas
    this.canvas = document.querySelector(canvas);
    this.cw = this.canvas.width = window.innerWidth;
    this.ch = this.canvas.height = window.innerHeight;

    //### get context
    this.ctx = this.canvas.getContext("2d");

    //### set colors
    this.colors = colors;

    //### set pixel max size
    this.pixelRadius = pixelRadius;

    //### set width / height of pixel flight in animation
    this.verticalDistribution = verticalDistribution;
    this.horizontalDistribution = horizontalDistribution;

    //### set friction
    this.frictionValue = frictionValue;
    this.friction = friction;

    //### set image source
    this.src = src;

    //### set image
    this.img = new Image();
    this.imgData = null;

    //### set particle array
    this.particles = [];

    //### set amount of particles
    this.amount = amount;

    //### set threshhold for int value of a pixel in imgData: 0 - 255
    this.threshhold = threshhold < 255 && threshhold > 0 ? threshhold : 150;

    //### set speed
    this.speed = speed;

    //### set autostop
    this.autstop = autostop;
    this.autoStopCounter = 0;

    //### initiate animation on creation
    if (autoinit) {
      this.init();
    }
  }

  particle(x, y) {
    let particle = {};
    //### set random start position
    particle.x = Math.random() * this.cw;
    particle.y = Math.random() * this.ch;

    //### set destinatin position
    particle.dest = {
      x: x,
      y: y,
    };

    //### set pixel radius
    particle.pixelRadius = Math.random() * this.pixelRadius + 2;

    //### set random flight realm for pixel
    particle.vx = (Math.random() - 0.5) * this.horizontalDistribution;
    particle.vy = (Math.random() - 0.5) * this.verticalDistribution;

    //### set acceleration of pixel
    particle.accX = 0;
    particle.accY = 0;

    //### set friction to define how fast the pixel will end up in dest position
    particle.friction = (Math.random() * this.frictionValue) / 100 + 0.94;

    //### set color
    particle.color = this.colors[
      Math.floor(Math.random() * this.colors.length)
    ];
    return particle;
  }

  //### draw a pixel
  render(p) {
    if (this.friction) {
      // friction mode
      p.accX = (p.dest.x - p.x) / 1000;
      p.accY = (p.dest.y - p.y) / 1000;
      p.vx += p.accX;
      p.vy += p.accY;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.x += p.vx;
      p.y += p.vy;
    } else {
      p.accX = (p.dest.x - p.x) / this.speed;
      p.accY = (p.dest.y - p.y) / this.speed;
      p.x += p.accX;
      p.y += p.accY;
    }

    this.ctx.fillStyle = p.color;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.pixelRadius, Math.PI * 2, false);
    this.ctx.fill();
  }

  init() {
    //### clear canvas
    this.clearCanvas();

    this.img.onload = () => {
      this.drawImage();
      this.createParticles();
      this.renderLoop();
    };

    this.img.src = this.src;
  }

  drawImage() {
    //### scale image
    const scale = Math.min(
      this.canvas.width / this.img.width,
      this.canvas.height / this.img.height
    );
    const x = this.cw / 2 - (this.img.width / 2) * scale;
    const y = this.ch / 2 - (this.img.height / 2) * scale;

    //### draw image
    this.ctx.drawImage(
      this.img,
      x,
      y,
      this.img.width * scale,
      this.img.height * scale
    );

    this.imgData = this.ctx.getImageData(0, 0, this.cw, this.ch).data;
    //this.clearCanvas();
    this.ctx.globalCompositeOperation = "screen";
  }

  createParticles() {
    for (let i = 0; i < this.cw; i += Math.ceil(this.cw / this.amount)) {
      for (let j = 0; j < this.ch; j += Math.ceil(this.ch / this.amount)) {
        if (this.imgData[(i + j * this.cw) * 4 + 3] > this.threshhold) {
          this.particles.push(this.particle(i, j));
        }
      }
    }
  }

  renderLoop() {
    this.autoStopCounter++;
    if (this.autoStopCounter > this.autstop) return;
    window.requestAnimationFrame(this.renderLoop.bind(this));
    this.clearCanvas();
    for (let i = 0; i < this.particles.length; i++) {
      this.render(this.particles[i]);
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.cw, this.ch);
  }
}
