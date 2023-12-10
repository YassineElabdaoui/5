let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];
let apple;

let shot = false, bullets = [];

let state = true

let imgVaisseau, targetPlane;

function preload() {
  console.log("preload")
  imgVaisseau = loadImage('assets/images/vaisseau.png');
  imgObstacle = loadImage('assets/images/circle.png');
  targetPlane = loadImage('assets/images/targetPlane.png');
  shotBallImage = loadImage('assets/images/shoot.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    vehicules.push(new Vehicle(random(width), random(height), imgVaisseau))
  }

  sliderRadiusSeperation = createSlider(10, 200, 24, 1)
  sliderSeperation = createSlider(0, 1, 0.9, 0.01)

  // On cree un obstalce au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacle = new Obstacle(-width / 2, -height / 2, 100);
  obstacles.push(obstacle);

  // create apple somewhere on the screen
  // where there is no obstacle 
  apple = new Apple(random(width), random(height));

}


function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  // background(198, 22, 45, 50);
  background('#40407a');

  // draw apple 
  apple.show();

  target = createVector(mouseX, mouseY);
  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris

  push()
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  circle(target.x, target.y, 32);
  pop()
  // *****************
  // Calculate angle between target position and cursor position in degrees
  let angle = degrees(atan2(mouseY - target.y, mouseX - target.x));

  // Calculate the angle difference to adjust for the direction
  let angleDifference = angle - 90; // Adjust as needed

  // Draw the rotated image at the target position
  push();
  translate(target.x, target.y);
  rotate(radians(angleDifference));
  tint(255, 200); // Adjust transparency if needed
  imageMode(CENTER);
  image(targetPlane, 0, 0, 32, 32);
  pop();
  // ****************



  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  });

  drawText();

  // change apple
  apple.update(vehicules[0]);
  
  // dessin des vehicules
  let targetMouse = createVector(mouseX, mouseY);
  if (state) {
    console.log("State True");
    for (i = 0; i < vehicules.length; i++) {
      vehicules[i].shadow();
      vehicules[i].border();

      if (i == 0) {
        vehicules[i].applyBehaviors(targetMouse, obstacles, vehicules);
        this.weightSeparation = 0
      } else {
        let vehiculePrecedent = vehicules[i - 1];

        //targetPrevious = createVector(vehiculePrecedent.pos.x, vehiculePrecedent.pos.y);

        // en fait on veut viser un point derriere le vehicule précédent
        // On prend la vitesse du précédent et on en fait une copie
        let pointDerriere = vehiculePrecedent.vel.copy();
        // on le normalise
        pointDerriere.normalize();
        // et on le multiplie par une distance derrière le vaisseau
        pointDerriere.mult(-50);
        // on l'ajoute à la position du vaisseau
        pointDerriere.add(vehiculePrecedent.pos);

        // on le dessine sous la forme d'un cercle pour debug
        if (Vehicle.debug) {
          fill(255, 0, 0)
          circle(pointDerriere.x, pointDerriere.y, 10);
        }
        vehicules[i].applyBehaviors(pointDerriere, obstacles, vehicules);
        this.weightSeparation = 0

        // si le vehicule est à moins de 5 pixels du point derriere, on le fait s'arreter
        // en mettant le poids de son comportement arrive à 0
        // et en lui donnant comme direction du vecteur vel la direction du vecteur
        // entre sa position et le vaisseau précédent
        if (vehicules[i].pos.dist(pointDerriere) < 20 && vehicules[i].vel.mag() < 0.01) {
          vehicules[i].weightArrive = 0;
          vehicules[i].weightObstacle = 0;
          vehicules[i].vel.setHeading(p5.Vector.sub(vehiculePrecedent.pos, vehicules[i].pos).heading());
        } else {
          vehicules[i].weightArrive = 0.3;
          vehicules[i].weightObstacle = 0.9;
        }

      }
      vehicules[i].update();
      vehicules[i].show();
    }
  } else {
    console.log("State False");
    for (i = 0; i < vehicules.length; i++) {
      vehicules[i].shadow();
      vehicules[i].border();
      if (i == 0) {
        vehicules[i].applyBehaviors(targetMouse, obstacles, vehicules);
        this.weightSeparation = 0
      } else {
        let vehiculePrecedent = vehicules[0]

        //targetPrevious = createVector(vehiculePrecedent.pos.x, vehiculePrecedent.pos.y);

        // en fait on veut viser un point derriere le vehicule précédent
        // On prend la vitesse du précédent et on en fait une copie
        let pointDerriere = vehiculePrecedent.vel.copy();
        // on le normalise
        pointDerriere.normalize();
        // et on le multiplie par une distance derrière le vaisseau
        pointDerriere.mult(-100);
        // on l'ajoute à la position du vaisseau
        pointDerriere.add(vehiculePrecedent.pos);

        // on le dessine sous la forme d'un cercle pour debug

        fill(0, 255, 0)
        noStroke()
        circle(pointDerriere.x, pointDerriere.y, 20);



        vehicules[i].applyBehaviors(pointDerriere, obstacles, vehicules);
        vehicules[i].weightSeparation = sliderSeperation.value()
        vehicules[i].perceptionRadius = sliderRadiusSeperation.value()

      }
      vehicules[i].update();
      vehicules[i].show();
    }

  }

  //display the bullets
  bullets.forEach(b => {
    // check if the bullet is still alive
    if (b.isAlive) {
      b.update(target, obstacles);
      b.show();
    } else {
      // if not, remove it from the array
      bullets.splice(bullets.indexOf(b), 1);
    }
  });

  if (shot) {
    vehicules[0].shoot();
    shot = false;
  }



}


// this function to display how mush i touch target :
function drawText() {
  // Set the text properties
  textSize(16);
  fill(255); // White color

  // Position the text in the top-right corner (adjust the values as needed)
  let textX = width - 50;
  let textY = 50;

  // Display the text with the value of Bill.nbrSuccess
  text(`${Ball.nbrSuccess}`, textX, textY);
}

function mousePressed() {
  obstacle = new Obstacle(mouseX, mouseY, random(5, 60));
  obstacles.push(obstacle);
}

function keyPressed() {

  if (key == "b") {
    shot = true;
  }

  if (key == "o") {
    mousePressed();
  }
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height), imgVaisseau));
  }
  if (key == "s") {
    state = !state
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
    Ball.debug = !Ball.debug;
  }

  if (key == "f") {
    const nbMissiles = 10;

    // On tire des missiles !
    for (let i = 0; i < nbMissiles; i++) {
      let x = 20 + random(10);
      let y = random(height / 2 - 5, random(height / 2 + 5));

      let v = new Vehicle(x, y, imgVaisseau);
      vehicules.push(v);
    }
  }
}

