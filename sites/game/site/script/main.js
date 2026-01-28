import './controls.js';
import { updatePlayer, updateCamera, playerRect, world, camera, regions, updatePlayerAnimation, playerAnim, gameVar, applyStage, drawing, eventTick, beforeStage } from './game.js';

// VARRIABLES
const contentGameOver = document.querySelector(".menu-gameOver");
const btnGameOver = document.querySelector(".restart.btn");

window.playerRect = playerRect;
window.gameVar = gameVar;
window.drawing = drawing;

const ASSETS = { 
    background: '/DNL-VideoGame/sites/game/site/assets/background.jpg', 
    playerIdle: '/DNL-VideoGame/sites/game/site/assets/player_still.png', 
    playerWalk1: '/DNL-VideoGame/sites/game/site/assets/player_walk_1.png', 
    playerWalk2: '/DNL-VideoGame/sites/game/site/assets/player_walk_2.png',
    first_man: '/DNL-VideoGame/sites/game/site/assets/first_man.png',
    second_man: '/DNL-VideoGame/sites/game/site/assets/second_man.png',
    third_man: '/DNL-VideoGame/sites/game/site/assets/third_man.png',
    bullet: '/DNL-VideoGame/sites/game/site/assets/ammo.png',
    flame0: '/DNL-VideoGame/sites/game/site/assets/Flame0.png',
    flame1: '/DNL-VideoGame/sites/game/site/assets/Flame1.png',
    flame2: '/DNL-VideoGame/sites/game/site/assets/Flame2.png',
    flame3: '/DNL-VideoGame/sites/game/site/assets/Flame3.png',
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

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    if (gameVar.stage === "stage2") {
        let renderScale = Math.max(
            canvas.width  / world.world2.width,
            canvas.height / world.world2.height
        );

        camera.width  = canvas.width  / renderScale;
        camera.height = canvas.height / renderScale;

        // scale écran
        ctx.scale(renderScale, renderScale);
        
        // caméra
        ctx.translate(-camera.x, -camera.y);

        // ===== BACKGROUND =====
        if (assets?.background) {
            if (window.drawing.background) {
                ctx.drawImage(
                    assets.background,
                    0,
                    0,
                    world.world2.width,
                    world.world2.height
                );
            }
        }

        // regions
        regions.forEach(o => {
            if (o.enable) {
                if (window.drawing.regions) {
                    if (o.cancollide) {
                        ctx.fillStyle = 'red';
                    }
                    else if (o.died) {
                        ctx.fillStyle = 'blue';
                    }
                    else {
                        ctx.fillStyle = 'gray';
                    }
                    ctx.fillRect(o.x, o.y, o.width, o.height);
                }

                if (o.img !== "none") {
                    let image = NamedNodeMap;

                    switch (o.img) {
                        case "first_man.png":
                            image = assets.first_man;
                            break;
                        case "second_man.png":
                            image = assets.second_man;
                            break;
                        case "third_man.png":
                            image = assets.third_man;
                            break;
                        case "bullet.png":
                            image = assets.bullet;
                            break;
                        case "flame0.png":
                            image = assets.flame0;
                            break;
                        case "flame1.png":
                            image = assets.flame1;
                            break;
                        case "flame2.png":
                            image = assets.flame2;
                            break;
                        case "flame3.png":
                            image = assets.flame3;
                            break;
                    }

                    if (image !== NamedNodeMap) {
                        ctx.drawImage(
                            image,
                            o.x,
                            o.y,
                            o.width,
                            o.height
                        );
                    }
                }
            }
        });
        

        // player
        if (window.drawing.playerRect) {
            ctx.fillStyle = 'white';
            ctx.fillRect(playerRect.x, playerRect.y, playerRect.width, playerRect.height);
        }
        
        if (window.drawing.player) {
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
        } 
    }
    else if (gameVar.stage === "stage1") {
        let renderScale = Math.max(
            canvas.width  / world.world1.width,
            canvas.height / world.world1.height
        );

        camera.width  = canvas.width  / renderScale;
        camera.height = canvas.height / renderScale;

        // scale écran
        ctx.scale(renderScale, renderScale);
    }
      

    ctx.restore();
}

let lastTime = performance.now();

function gameLoop(time) {
    const deltaTime = Math.min(time - lastTime, 100) / 1000;
    lastTime = time;

    if (gameVar.stage === "gameOver") {
        if (contentGameOver.classList.contains("hide")) {
            contentGameOver.classList.remove("hide");
            contentGameOver.classList.add("show");
        }
    }
    else {
        if (contentGameOver.classList.contains("show")) {
            contentGameOver.classList.remove("show");
            contentGameOver.classList.add("hide");
        }

        
        if (gameVar.stage === "stage2") {
            updatePlayer(deltaTime);
            updateCamera();
            updatePlayerAnimation(deltaTime);
        }
        else if (gameVar.stage === "stage1") {

        }
        else if (gameVar.stage === "stage3") {
            
        }

        eventTick(deltaTime);
        render();
    }

    requestAnimationFrame(time => gameLoop(time));
}

btnGameOver.addEventListener('click', () => applyStage(beforeStage));

preloadAssets().then(loadedAssets => { 
    assets = loadedAssets;
    applyStage("stage1");

    requestAnimationFrame(gameLoop);
});