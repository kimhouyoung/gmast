const rocket = document.getElementById("rocket");
const scoreDisplay = document.getElementById("score");

const collisionSound = new Audio('music/gam.mp3');

let rocketBottom = parseInt(window.getComputedStyle(rocket).bottom);
let rocketLeft = parseInt(window.getComputedStyle(rocket).left);
let isMoving = { up: false, left: false, right: false };
let score = 0;

function moveRocket() { // 로켓 움직임
    
    rocketBottom += isMoving.up ? 12 : -8;
    rocketLeft += isMoving.left ? -12 : isMoving.right ? 12 : 0;

    rocketBottom = Math.max(0, rocketBottom);
    rocketLeft = Math.max(0, Math.min(rocketLeft, window.innerWidth - rocket.offsetWidth));

    rocket.style.bottom = rocketBottom + "px";
    rocket.style.left = rocketLeft + "px";

    requestAnimationFrame(moveRocket);
}

function createObstacle() { // 장애물 생성

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    obstacle.style.left = Math.random() * (window.innerWidth - 50) + "px";
    obstacle.style.top = "-50px";

    document.body.appendChild(obstacle);

    moveObstacle(obstacle);
}

function moveObstacle(obstacle) {
    const interval = setInterval(() => {
        obstacle.style.top = parseInt(obstacle.style.top) + 10 + "px";

        if (parseInt(obstacle.style.top) > window.innerHeight) {
            clearInterval(interval);
            document.body.removeChild(obstacle);
            scoreDisplay.textContent = "Score: " + ++score;
        }

        if (checkCollision(obstacle)) {
            clearInterval(interval);
            collisionSound.play();
            alert(`피파 강화 터진지: ${score}일입니다.`);
            window.location.reload();
        }
    }, 30);
}

function checkCollision(obstacle) {
    const rocketRect = rocket.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        rocketRect.top > obstacleRect.bottom ||
        rocketRect.bottom < obstacleRect.top ||
        rocketRect.left > obstacleRect.right ||
        rocketRect.right < obstacleRect.left
    );
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") isMoving.up = true;
    if (e.code === "ArrowLeft") isMoving.left = true;
    if (e.code === "ArrowRight") isMoving.right = true;
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") isMoving.up = false;
    if (e.code === "ArrowLeft") isMoving.left = false;
    if (e.code === "ArrowRight") isMoving.right = false;
});

setInterval(createObstacle, 130);

moveRocket();
