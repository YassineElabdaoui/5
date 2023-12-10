let imgObstacle;

function preload() {
  console.log("preload")
  
}

class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.color = color(0, 255, 0);
  }

  show() {
    push();
    tint(255, 200); // Adjust transparency if needed
    imageMode(CENTER);
    image(imgObstacle, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    pop();
  }

}

