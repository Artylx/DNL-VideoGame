import { input } from './controls.js';

export let playerRect = {
    x: 18,
    y: 100,

    height: 5,
    width: 15,

    speed: 65,

    direction: 'none', // "right", "left"
    colliable: true,
}

export let gameVar = {
    stage: "stage1",
}

async function load(link) {
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Erreur chargement QCM");
    }
    return await response.json();
}
let qcm = null;
export let regions = [];

export async function init() {
    qcm = await load('/DNL-VideoGame/sites/game/site/script/qcm.json');
    regions = await load('/DNL-VideoGame/sites/game/site/script/regions.json');
}

export const playerAnim = {
    frame: 0,
    timer: 0,
    frameDuration: 0.15 // s
};

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
        if (region.interactEvent === "stage3") {
            gameVar.stage = "stage3";
        }
        else {
            showInteractBtn(region);
        }
    }
    
    if (region.died && region.enable) {
        gameVar.stage = "gameOver";
    }

    currentRegion = region;
}

function leaveRegion(region) {
    currentRegion = NaN;
    interactBtn.style.visibility = "hidden";
}

export function updatePlayer() {
    if (regions == null) return 0;
    
    // Previous movements
    const prevX = playerRect.x;
    const prevY = playerRect.y;

    // Déplacement horizontal
    playerRect.x += input.x * playerRect.speed * deltaTime;

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
    playerRect.y += input.y * playerRect.speed * deltaTime;

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

const textElmt = document.querySelector(".text-game");
export function setText(text) {
    textElmt.innerHTML = text;
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

export function applyState(stage) {
    window.gameVar.stage = stage;

    if (stage === "stage2")
    {
        window.playerRect.x = 18;
        window.playerRect.y = 100;

        window.playerRect.direction = 'none';

        camera.x = 0
        camera.y = 0
        init();
    }
    else {

    }
}