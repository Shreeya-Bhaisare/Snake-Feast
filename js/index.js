// Game Constants & Variables
let inputDir = { x: 0, y: 0 }; // for snake to be still when game is started until some key is pressed
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 7;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 7, y: 6 };
let score = 0;
let bomb = null;
const bombInterval = 5000; // Bomb appears every 5 seconds (5000 ms)
const bombDuration = 5000; // Bomb stays on screen for 2 seconds (2000 ms)
let bombTimer = 0;
let bombVisibilityTimer = 0;

// Game Function
function main(ctime) {
    window.requestAnimationFrame(main);
    console.log(ctime);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sarr) {
    // If snake bumps into itself
    for (let index = 1; index < sarr.length; index++) {
        if (sarr[index].x === sarr[0].x && sarr[index].y === sarr[0].y) {
            return true;
        }
    }
    // If snake bumps into the wall
    if (sarr[0].x >= 18 || sarr[0].x <= 0 || sarr[0].y <= 0 || sarr[0].y >= 18) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1 - Updating the snake array
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        //alert('Game Over! Press any key to restart');
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0; // reset score
        bomb = null; // Reset bomb when game restarts
    }

    // Check if snake has eaten the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score >= highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = "High Score: " + highscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = {
            x: Math.round(2 + (16 - 2) * Math.random()),
            y: Math.round(2 + (16 - 2) * Math.random())
        };
    }

    // Check for bomb collision
    if (bomb && (snakeArr[0].x === bomb.x && snakeArr[0].y === bomb.y)) {
        gameOverSound.play();
        musicSound.pause();
        //alert('Game Over! The snake hit a bomb!');
        snakeArr = [{ x: 13, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        bomb = null; // Reset bomb when game restarts
    }

    // Bomb logic
    bombTimer += (lastPaintTime - (lastPaintTime - (1000 / speed)));
    if (bomb === null && bombTimer >= bombInterval) {
        bombTimer = 0;
        bomb = {
            x: Math.round(2 + (16 - 2) * Math.random()),
            y: Math.round(2 + (16 - 2) * Math.random())
        };
        bombVisibilityTimer = bombDuration;
    }
    if (bombVisibilityTimer > 0) {
        bombVisibilityTimer -= (lastPaintTime - (lastPaintTime - (1000 / speed)));
        if (bombVisibilityTimer <= 0) {
            bomb = null;
        }
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2 - Display the snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Display the bomb if it exists
    if (bomb) {
        let bombElement = document.createElement('div');
        bombElement.style.gridRowStart = bomb.y;
        bombElement.style.gridColumnStart = bomb.x;
        bombElement.classList.add('bomb');
        board.appendChild(bombElement);
    }
}

// Main logic
let highscore = localStorage.getItem("highscore");
if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highscoreBox.innerHTML = "High Score: " + highscore;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 }; // start the game-snake starts moving downwards
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
