// GLOBAL VARIABLES
const gameContainer = document.querySelector('.game-container');
var background = NaN;
var playerObj = NaN;

let world = {
    width: 0,
    height: 0
};

const player = {
    x: 150,
    y: 150,
    speed: 6,
    width: 60,
    height: 90
};

const camera = {
    x: 0,
    y: 0,
    width: gameContainer.clientWidth,
    height: gameContainer.clientHeight
};

// FUNCTIONS
function initializeGame() {
    background = document.createElement('img');
    background.src = '/DNL-VideoGame/sites/game/site/assets/background.jpg';
    background.className = 'background-image';
    background.style.height = '100%';
    background.style.width = 'auto';
    background.style.position = 'absolute';
    background.style.top = '0';
    background.style.left = '0';
    background.style.zIndex = '-1';

    gameContainer.appendChild(background);

    playerObj = document.createElement('div');
    playerObj.style.height = player.height + 'px';
    playerObj.style.width = player.width + 'px';
    playerObj.style.position = 'absolute';
    playerObj.style.top = '0';
    playerObj.style.left = '0';
    playerObj.style.backgroundColor = 'white';

    gameContainer.appendChild(playerObj);

    background.onload = function() {
        sizeAdjustment();
    };
}

function sizeAdjustment() {
    const scale = gameContainer.clientHeight / background.naturalHeight;

    world = {
        width: background.naturalWidth * scale,
        height: background.naturalHeight * scale
    };

    console.log('World size:', world);
}

window.addEventListener('resize', sizeAdjustment);

const joystick = document.querySelector('.joystick-container');

const knob = document.querySelector('.joystick');
let isDragging = false;
let startX, startY;

function startDrag(e) {
    isDragging = true;
    const pos = getPosition(e);
    startX = pos.x;
    startY = pos.y;
}

function stopDrag(e) {
    if (isDragging) {
        isDragging = false;
        knob.style.transform = 'translate(0, 0)';

        inputX = 0;
        inputY = 0;
    }
}

function getPosition(e) {
    if (e.touches && e.touches.length > 0) {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    } else {
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
}

let inputX = 0;
let inputY = 0;

function moveDrag(e) {
    if (!isDragging) return;

    const pos = getPosition(e);

    const dx = pos.x - startX;
    const dy = pos.y - startY;

    const maxDistance = 60;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);

    const angle = Math.atan2(dy, dx);

    const limitedX = Math.cos(angle) * distance;
    const limitedY = Math.sin(angle) * distance;

    // UI joystick
    knob.style.transform = `translate(${limitedX}px, ${limitedY}px)`;

    inputX = limitedX / maxDistance;
    inputY = limitedY / maxDistance;
}


knob.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', moveDrag);
document.addEventListener('mouseup', stopDrag);

knob.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', moveDrag, { passive: false });
document.addEventListener('touchend', stopDrag);
document.addEventListener('touchcancel', stopDrag);

function updatePlayer() {
    player.x += inputX * player.speed;
    player.y += inputY * player.speed;

    // limites du MONDE
    player.x = Math.max(0, Math.min(world.width - player.width, player.x));
    player.y = Math.max(0, Math.min(world.height - player.height, player.y));
}

function updateCamera() {
    camera.x = player.x + player.width / 2 - camera.width / 2;
    camera.y = player.y + player.height / 2 - camera.height / 2;

    camera.x = Math.max(0, Math.min(world.width - camera.width, camera.x));
    camera.y = Math.max(0, Math.min(world.height - camera.height, camera.y));
}

function render() {
    playerObj.style.transform = `
        translate(
            ${player.x - camera.x}px,
            ${player.y - camera.y}px
        )
    `;

    background.style.transform = `
        translate(
            ${-camera.x}px,
            ${-camera.y}px
        )
    `;
}

function gameLoop() {
    updatePlayer();
    updateCamera();
    render();

    requestAnimationFrame(gameLoop);
}

initializeGame();
gameLoop();