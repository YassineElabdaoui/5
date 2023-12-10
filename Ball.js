let shotBallImage;
class Ball {
    static nbrSuccess = 0;
    static debug = false;
    constructor(x, y, velocity) {
        // normalize the velocity vector and multiply it by 50
        this.pos = createVector(x, y);
        this.vel = velocity.normalize().mult(50); // Adjust the speed as needed
        this.radius = 20; // Adjust the radius as needed
        this.color = color(255, 0, 0); // Red color for the ball
        this.isAlive = true; // Flag to check if the ball should be drawn
    }

    // this fucntion is change the position of the ball based on the velocity
    // if the ball is out of the canvas, it will be marked as not alive
    // if the ball hits the target, it will be marked as not alive and increase the number of success
    update(target, obstacles) {
        // Move the ball based on its velocity
        this.pos.add(this.vel);

        // Check if the ball hits the canvas boundaries
        if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
            this.isAlive = false;
        }

        // Check for collisions with obstacles
        for (let obstacle of obstacles) {
            let distanceToObstacle = dist(this.pos.x, this.pos.y, obstacle.pos.x, obstacle.pos.y);
            let minDistance = this.radius + obstacle.r;

            // If the ball collides with an obstacle, bounce off it
            if (distanceToObstacle < minDistance) {
                this.isAlive = false;
            }
        }

        // Calculate the distance between the ball and the target
        let distanceToTarget = dist(this.pos.x, this.pos.y, target.x, target.y);

        // If the distance is very small (you can adjust the threshold), consider it a hit
        if (distanceToTarget < 32) {
            Ball.nbrSuccess++;
            console.log('Hit! nbrSuccess:', Ball.nbrSuccess);
            this.isAlive = false; // Mark the ball as not alive after hitting the target
        }
    }


    show() {
        // Draw the image if the ball is alive
        if (this.isAlive) {
            push();
            translate(this.pos.x, this.pos.y);

            // Calculate the angle of rotation based on the velocity
            let angle = atan2(this.vel.y, this.vel.x);
            rotate(angle + PI + PI / 3);

            // Draw the rotated image
            imageMode(CENTER);
            image(shotBallImage, 0, 0, this.radius * 2, this.radius * 2);

            pop();
        }
    }
}