import { input } from './controls.js';

export let playerRect = {
    x: 18,
    y: 100,

    height: 5,
    width: 15,

    speed: 1,

    direction: 'none', // "right", "left"
    colliable: true,
}

export let gameVar = {
    state: "game",
}

async function loadQCM() {
    const response = await fetch('/DNL-VideoGame/sites/game/site/script/qcm.json');
    if (!response.ok) {
        throw new Error("Erreur chargement QCM");
    }
    return await response.json();
}
let qcm = null;
export async function initQCM() {
    qcm = await loadQCM();
}

export const playerAnim = {
    frame: 0,
    timer: 0,
    frameDuration: 150 // ms
};

export const regions = [
    { x: 160, y: 36, width: 25, height: 162, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 20, y: 32, width: 38, height: 14, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},

    { x: 276, y: 0, width: 31, height: 45, died: true, interactEvent: "none", cancollide: false, img: "none", enable: true},
    { x: 279, y: 45, width: 26, height: 55, died: true, interactEvent: "none", cancollide: false, img: "none", enable: true},
    { x: 280, y: 100, width: 24, height: 59, died: true, interactEvent: "none", cancollide: false, img: "none", enable: true},
    { x: 284, y: 187, width: 24, height: 13, died: true, interactEvent: "none", cancollide: false, img: "none", enable: true},

    { x: 347, y: 131, width: 87, height: 22, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 400, y: 41, width: 87, height: 22, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 465, y: 93, width: 22, height: 106, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 545, y: 0, width: 22, height: 92, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    
    { x: 568, y: 130, width: 163, height: 11, died: true, interactEvent: "none", cancollide: false, img: "none", enable: true},
    { x: 545, y: 93, width: 22, height: 52, died: true, interactEvent: "none", cancollide: false, img: "none", enable: true},
    
    { x: 624, y: 52, width: 177, height: 3, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 798, y: 54, width: 5, height: 24, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 794, y: 70, width: 26, height: 146, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 894, y: 0, width: 99, height: 51, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 915, y: 45, width: 62, height: 22, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},
    { x: 881, y: 165, width: 87, height: 22, died: false, interactEvent: "none", cancollide: true, img: "none", enable: true},

    { x: 990, y: 80, width: 10, height: 60, died: false, interactEvent: "end", cancollide: false, img: "none", enable: true},

    { x: 337, y: 25, width: 47, height: 32, died: false, interactEvent: "q1", cancollide: false, img: "first_man", enable: true},
];

export const world = {
    width: 1000,
    height: 200,
}

export const camera = {
    x: 0,
    y: 0,
    width: world.width,
    height: world.height
};

function rectIntersectAxis(a, b, axis) {
    if (axis === 'x') {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.y < b.y + b.height
        );
    } else if (axis === 'y') {
        return (
            a.y < b.y + b.height &&
            a.y + a.height > b.y &&
            a.x + a.width > b.x &&
            a.x < b.x + b.width
        );
    }
}

const interactBtn = document.querySelector(".interact-content");

function showInteractBtn(region) {
    if (interactBtn) {
        interactBtn.style.visibility = "visible";
        interactBtn.style.transform = `translate()`;
    }
}

function btnQcmEvent(q, r) {
    if (r.valid) {
        for (const region of regions) {
            if (region.interactEvent === q.interactValue) {
                region.enable = false;
                leaveRegion(region);
                break;
            }
        }
    }
    else {
        gameVar.state = "gameOver";
    }

    contentQcm.classList.remove("show");
    contentQcm.classList.add("hide");
}

const contentQcm = document.querySelector(".menu-question");
const contentResp = contentQcm.querySelector(".resp-container");
function interactBtnEvent() {
    for (const q of qcm.questions) {
        if (q.interactValue === currentRegion.interactEvent) {
            // ACTUALISER LES VALEURS
            const title = contentQcm.querySelector(".title-q");
            title.innerHTML = q.title;
            contentResp.innerHTML = "";

            for (const resp of q.choice) {
                const btn = document.createElement('button');
                btn.className = "btn";
                btn.innerHTML = resp.text

                btn.addEventListener("click", () => {
                    btnQcmEvent(q, resp);
                });
                
                contentResp.appendChild(btn);
            }

            // AFFICHER
            contentQcm.classList.remove("hide");
            contentQcm.classList.add("show");
            return;
        }
    }
    console.error("Question is unfindable");
}
interactBtn.addEventListener("click", interactBtnEvent);

var currentRegion = NaN;
function regionEnter(region, axe) {
    if (region.cancollide && region.enable) {
        if (axe === "x") {
            if (input.x > 0) playerRect.x = region.x - playerRect.width;
            else if (input.x < 0) playerRect.x = region.x + region.width;
        }
        else if (axe === "y") {
            if (input.y > 0) playerRect.y = region.y - playerRect.height;
            else if (input.y < 0) playerRect.y = region.y + region.height;
        }
    }

    if (region.interactEvent !== "none" && currentRegion !== region && region.enable) {
        if (region.interactEvent === "end") {
            gameVar.state = "Ending";
        }
        else {
            showInteractBtn(region);
        }
    }
    
    if (region.died && region.enable) {
        gameVar.state = "gameOver";
    }

    currentRegion = region;
}

function leaveRegion(region) {
    currentRegion = NaN;
    interactBtn.style.visibility = "hidden";
}

export function updatePlayer() {
    // Previous movements
    const prevX = playerRect.x;
    const prevY = playerRect.y;

    // Déplacement horizontal
    playerRect.x += input.x * playerRect.speed;

    if (playerRect.colliable) {
        // Collision horizontale
        for (const o of regions) {
            if (
                playerRect.x < o.x + o.width &&
                playerRect.x + playerRect.width > o.x &&
                playerRect.y + playerRect.height > o.y &&
                playerRect.y < o.y + o.height
            ) {
                regionEnter(o, "x");
            }
            else if (o === currentRegion) {
                leaveRegion(o);
            }
        }

        // Limites monde X
        playerRect.x = Math.max(0, Math.min(world.width - playerRect.width, playerRect.x));
    }
    
    // Déplacement vertical
    playerRect.y += input.y * playerRect.speed;

    if (playerRect.colliable) {
        // Collision verticale
        for (const o of regions) {
            if (
                playerRect.y < o.y + o.height &&
                playerRect.y + playerRect.height > o.y &&
                playerRect.x + playerRect.width > o.x &&
                playerRect.x < o.x + o.width
            ) {
                regionEnter(o, "y");
            }
            else if (o === currentRegion) {
                leaveRegion(o);
            }
        }

        // Limites monde Y
        playerRect.y = Math.max(0, Math.min(world.height - playerRect.height, playerRect.y));
    }
    
    // Direction
    if (prevX === playerRect.x && prevY === playerRect.y) {
        playerRect.direction = 'none';
    }
    else {
        if (input.x > 0) playerRect.direction = 'right';
        else if (input.x < 0) playerRect.direction = 'left';
        else playerRect.direction = 'none';
    }
}

const DEAD_ZONE_RATIO = 0.4;
export function updateCamera() {
    const deadZoneWidth = camera.width * DEAD_ZONE_RATIO;
    const deadZoneLeft  = camera.x + (camera.width - deadZoneWidth) / 2;
    const deadZoneRight = deadZoneLeft + deadZoneWidth;

    // Sort à gauche de la zone morte
    if (playerRect.x < deadZoneLeft) {
        camera.x = Math.max(
            0,
            playerRect.x - (camera.width - deadZoneWidth) / 2
        );
    }

    // Sort à droite de la zone morte
    if (playerRect.x + playerRect.width > deadZoneRight) {
        camera.x = Math.min(
            world.width - camera.width,
            playerRect.x + playerRect.width -
            (camera.width + deadZoneWidth) / 2
        );
    }
}

export function updatePlayerAnimation(deltaTime) {
    const moving = playerRect.direction !== 'none';

    if (!moving) {
        playerAnim.frame = 0;
        playerAnim.timer = 0;
        return;
    }

    playerAnim.timer += deltaTime;

    if (playerAnim.timer >= playerAnim.frameDuration) {
        playerAnim.timer = 0;
        playerAnim.frame = (playerAnim.frame + 1) % 2;
    }
}