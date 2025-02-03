// Variables from position
let appleX = 0;
let appleY = 0;

let snakeX = 0;
let snakeY = 0;

// Variables for touch screen input
let xDown = null;
let yDown = null;

// array to convert keyboard input to direction
const keyArray = [];
keyArray["w"] = "north";
keyArray["a"] = "west";
keyArray["s"] = "south";
keyArray["d"] = "east";

// array to store snake bodies
let bodies = [];

let bodyPositions = [];

// variables holding HTML elements
const APPLE = document.querySelector("#apple");
const SNAKE_HEAD = document.querySelector("#head");


const MAIN_MENU = document.querySelector(".main-menu");
const GAME_OVER = document.querySelector(".game-over");


const LOSE_SOUND = document.querySelector("#lose-sound");
const EAT_SOUND = document.querySelector("#eat-sound");
const BACKGROUND_MUSIC = document.querySelector("#background-music");

// variable storing direction
let direction = "north";

let gameRunning = false;

// Function called on screen loaded
function start() {

    APPLE.style.display = "block";
    SNAKE_HEAD.style.display = "block";

    MAIN_MENU.style.display = "none";
    GAME_OVER.style.display = "none";

    bodies.forEach((body) => {
        
        body.remove();
    });

    bodies = [];
    bodyPositions = [];

    // Generate random position for apple element
    appleX = Math.floor(Math.random() * (window.innerWidth + 1) / 25) * 25;
    appleY = Math.floor(Math.random() * (window.innerHeight + 1) / 25) * 25;

    // Generate random position for snake head element
    snakeX = Math.floor(Math.random() * (window.innerWidth + 1) / 25) * 25;
    snakeY = Math.floor(Math.random() * (window.innerHeight + 1) / 25) * 25;

    // Assign randomly generated position to apple element
    APPLE.style.left = appleX + "px";
    APPLE.style.top = appleY + "px";

    // Assign randomly generated position to snake head element
    SNAKE_HEAD.style.left = snakeX + "px";
    SNAKE_HEAD.style.top = snakeY + "px";
    
    BACKGROUND_MUSIC.play();

    gameRunning = true;
}

// Function called every 175ms
function update() {

    if (gameRunning) {
        // Check if snake head is colliding with the apple
        if (appleX == snakeX && appleY == snakeY) {

            EAT_SOUND.play();
            
            let isPositionValid = false;
            while(!isPositionValid) {
                
                // Generate new position for the apple element
                appleX = Math.floor(Math.random() * (window.innerWidth + 1) / 25) * 25;
                appleY = Math.floor(Math.random() * (window.innerHeight + 1) / 25) * 25;
                
                isPositionValid = true;
                bodyPositions.forEach((position) => {
                    if (position[0] == appleX + "px" && position[1] == appleY + "px") {
                        isPositionValid = false;
                    }
                });
            }

            // Assign randomly generated position to apple element
            APPLE.style.left = appleX + "px";
            APPLE.style.top = appleY + "px";

            // Create adn assign the new body for the snake
            let b = document.createElement('div');
            b.className = "body";
            bodies.push(b);
            document.body.append(b);
        }

        // Call moveSnake() to move snake
        moveSnake();

    }
}

// Function to move snake with respect to direction
function moveSnake() {

    // Save snake position to assign it to the body
    let previousX = snakeX + "px";
    let previousY = snakeY + "px";

    // Move snake with respect to the direction
    switch (direction) {
        case "north":
            snakeY -= 25;

            // Check if the snake is outside the screen
            if (snakeY < 0) {
                snakeY = Math.floor(window.innerHeight / 25) * 25;
            }
            break;
        case "south":
            snakeY += 25;

            // Check if the snake is outside the screen
            if (snakeY >= Math.floor(window.innerHeight / 25) * 25) {
                snakeY = 0;
            }
            break;
        case "west":
            snakeX -= 25;

            // Check if the snake is outside the screen
            if (snakeX < 0) {
                snakeX = Math.floor(window.innerWidth / 25) * 25;
            }
            break;
        case "east":
            snakeX += 25;

            // Check if the snake is outside the screen
            if (snakeX >= Math.floor(window.innerWidth / 25) * 25) {
                snakeX = 0;
            }
            break;
    }

    bodyPositions.forEach((position) => {
        if (position[0] == snakeX + "px" && position[1] == snakeY + "px") {
            gameRunning = false;
        }
    });
    
    if(!gameRunning) {
        BACKGROUND_MUSIC.pause();
        GAME_OVER.style.display = "flex";
        GAME_OVER.style.animation = "3s forwards flash";
        LOSE_SOUND.play();
        return;
    }

    SNAKE_HEAD.style.left = snakeX + "px";
    SNAKE_HEAD.style.top = snakeY + "px";

    bodyPositions = [];

    bodyPositions.push([snakeX, snakeY]);

    // Move body parts of the snake
    bodies.forEach((body) => {

        // Save body's position
        let x = body.style.left;
        let y = body.style.top;

        // Assign position to the body
        body.style.left = previousX;
        body.style.top = previousY;

        bodyPositions.push([previousX, previousY]);

        // Save position in global scope
        previousX = x;
        previousY = y;
    });
}

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* right swipe */
            direction = keyArray["a"];
        } else {
            /* left swipe */
            direction = keyArray["d"];
        }
    } else {
        if (yDiff > 0) {
            /* down swipe */
            direction = keyArray["w"];
        } else {
            /* up swipe */
            direction = keyArray["s"];
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

// Add event listener for key input
document.addEventListener('keydown', (e) => {
    if (keyArray[e.key] != null) {
        direction = keyArray[e.key];
    }
});

// Add event listener for touch input
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

// Call necessary functions
setInterval(update, 175);