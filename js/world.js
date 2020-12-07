var EGameState = Object.freeze({ MENU: 0, GAME: 1 });

// Utility method for box-box intersections
function intersects(BB_One, BB_Two) {
    return (Math.abs(BB_One.x - BB_Two.x) * 2 < (BB_One.width + BB_Two.width)) && (Math.abs(BB_One.y - BB_Two.y) * 2 < (BB_One.height + BB_Two.height));
}

class World {
    constructor(gameState, gravity) {
        this.gameState = gameState;
        this.gravity = gravity;
        this.bird = {};
        this.lastFrameTime = 0;
        this.pipeManager = new PipeManager(20, 2, 3, 100);
    }

    Init() {
        this.bird.init();
        this.pipeManager.init();
    }

    AddBard(bird) {
        this.bird = bird;
    }

    AddPipe(pipe) {
        pipes.push(pipe);
    }

    Tick(dt) {
        this.bird.update(dt);
        this.pipeManager.update(dt);

        // Check for collisions between bird and the pipes / or the floor
        for (var i in this.pipeManager.pipes) {
            var pipe = this.pipeManager.pipes[i];
            if (!pipe.active) continue;

            var bird = this.bird;
            if (intersects(bird.getBB(), pipe.upperBB()) || intersects(bird.getBB(), pipe.lowerBB())) {
                bird.die();
            }

            // If we are not collided check if we passed a pipe
            if(!pipe.cleared && pipe.position.x <= bird.getBB().x - (bird.getBB().width * 0.5)) {
                pipe.cleared = true;
                // TODO: Alter the score
            }
        }

        if (!this.bird.alive) {
            this.gameState = EGameState.MENU;
        }
    }

    Draw() {
        this.bird.draw();
        this.pipeManager.draw();
    }
}