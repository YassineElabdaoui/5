class Apple {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.radius = 20;
        this.color = color(255, 0, 0); // Red color for the apple
    }

    show() {
        push();
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        pop();
    }

    // Check if the leader touches the apple
    checkCollision(leader) {
        let d = dist(this.pos.x, this.pos.y, leader.pos.x, leader.pos.y);
        return d < this.radius + leader.r;
    }


    update(leader) {
        // check if the leader touches the apple
        if (this.checkCollision(leader)) {
            // add new vehicle to the array
            // with the same position as apple
            vehicules.push(new Vehicle(this.pos.x, this.pos.y, imgVaisseau)); 

            // Move the apple to a random position
            this.pos.x = random(this.radius, width - this.radius);
            this.pos.y = random(this.radius, height - this.radius);
        }
    }
}