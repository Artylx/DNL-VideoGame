import './controls.js';
import { updatePlayer, updateCamera, playerRect, world, camera, obstacles, updatePlayerAnimation, playerAnim } from './game.js';
window.playerRect = playerRect;

const ASSETS = { 
    background: '/DNL-VideoGame/sites/game/site/assets/background.jpg', 
    playerIdle: '/DNL-VideoGame/sites/game/site/assets/player_still.png', 
    playerWalk1: '/DNL-VideoGame/sites/game/site/assets/player_walk_1.png', 
    playerWalk2: '/DNL-VideoGame/sites/game/site/assets/player_walk_2.png' 
}; 

function loadImage(src) { 
    return new Promise((resolve, reject) => { 
        const img = new Image(); 
        img.src = src; 
        img.onload = () => resolve(img); 
        img.onerror = reject; 
    }); 
} 

async function preloadAssets() { 
    const images = {}; 
    const entries = Object.entries(ASSETS); 
    for (const [key, src] of entries) { 
        images[key] = await loadImage(src); 
    } 
    return images; 
} 

let assets; 

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getPlayerImage() {
    if (!assets) {
        console.log('null');
        return null;
    }

    if (playerRect.direction === 'none') {
        return assets.playerIdle;
    }

    return playerAnim.frame === 0
        ? assets.playerWalk1
        : assets.playerWalk2;
}

window.draw_obstacle = false;
window.draw_player_rect = false;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    let renderScale = Math.max(
        canvas.width  / world.width,
        canvas.height / world.height
    );

    camera.width  = canvas.width  / renderScale;
    camera.height = canvas.height / renderScale;

    // scale écran
    ctx.scale(renderScale, renderScale);

    // caméra
    ctx.translate(-camera.x, -camera.y);

    // ===== BACKGROUND =====
    if (assets?.background) {
        ctx.drawImage(
            assets.background,
            0,
            0,
            world.width,
            world.height
        );
    }
    else {
        console.log('assets?.background');
    }

    // obstacles
    if (window.draw_obstacle) {
        obstacles.forEach(o => {
            ctx.fillStyle = 'red';
            ctx.fillRect(o.x, o.y, o.width, o.height);
        });
    }

    // player
    if (window.draw_player_rect) {
        ctx.fillStyle = 'white';
        ctx.fillRect(playerRect.x, playerRect.y, playerRect.width, playerRect.height);
    }
    
    const image = getPlayerImage();

    const rationHeight = 6;

    const drawX = playerRect.x - playerRect.width * 0.2;
    const drawY = playerRect.y - playerRect.height * rationHeight;
    const drawW = playerRect.width * 1.5;
    const drawH = playerRect.height * (rationHeight + 1.3);

    if (playerRect.direction === 'left') {
        ctx.translate(drawX + drawW, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, drawY, drawW, drawH);
    } else {
        ctx.drawImage(image, drawX, drawY, drawW, drawH);
    }

    ctx.restore();
}

let lastTime = performance.now();

function gameLoop(time) {
    const deltaTime = Math.min(time - lastTime, 100);
    lastTime = time;

    updatePlayer();
    updateCamera();
    updatePlayerAnimation(deltaTime);

    render();
    requestAnimationFrame(time => gameLoop(time));
}

preloadAssets().then(loadedAssets => { 
    assets = loadedAssets;
    requestAnimationFrame(gameLoop);
});