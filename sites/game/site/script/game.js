import { input, hideJoystick, showJoystick } from './controls.js';

export let playerRect = {
    x: 18,
    y: 100,

    height: 5,
    width: 15,

    speed: 65, // 65

    direction: 'none', // "right", "left"
    colliable: true,
};

export let gameVar = {
    stage: "stage1",
}

export let drawing = {
    playerRect: false,
    player: true,
    regions: false,
    background: true,
}

async function load(link) {
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Erreur chargement QCM");
    }
    return await response.json();
};

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
    world1: {
        width: 500,
        height: 100,
    },
    world2: {
        width: 1000,
        height: 200,
    },
    world3: {
        width: 500,
        height: 100,
    },
    world3: {
        width: 500,
        height: 100,
    },
    world4: {
        width: 500,
        height: 100,
    }
}

export const camera = {
    x: 0,
    y: 0,
    width: world.world2.width,
    height: world.world2.height
};

const interactBtn = document.querySelector(".interact-content");

function showInteractBtn(region) {
    if (interactBtn) {
        interactBtn.style.visibility = "visible";
        interactBtn.style.transform = `translate()`;
    }
}

function btnQcmEvent(question, r) {
    if (r.valid) {
        for (const region of regions) {
            if (region.interactEvent === question.interactValue) {
                region.enable = false;
                leaveRegion(region);
                break;
            }
        }
    }
    else {
        gameVar.stage = "gameOver";
    }

    contentQcm.classList.remove("show");
    contentQcm.classList.add("hide");

    q = false;
}

const contentQcm = document.querySelector(".menu-question");
const contentResp = contentQcm.querySelector(".resp-container");

function btnInteractEvent() {
    if (currentRegion) {
        startQuestion(currentRegion.interactEvent);
    }
}

var currentQ = 0;
var q = false;

function startQuestion(interactValue) {
    if (qcm == null) {
        console.error("QCM not loaded");
        return false;
    }

    for (const question of qcm.questions) {
        if (question.interactValue === interactValue) {
            // ACTUALISER LES VALEURS
            const title = contentQcm.querySelector(".title-q");
            title.innerHTML = question.title;
            contentResp.innerHTML = "";

            for (const resp of question.choice) {
                const btn = document.createElement('button');
                btn.className = "btn";
                btn.innerHTML = resp.text

                btn.addEventListener("click", () => {
                    btnQcmEvent(question, resp);
                });
                
                contentResp.appendChild(btn);
            }

            // AFFICHER
            contentQcm.classList.remove("hide");
            contentQcm.classList.add("show");

            q = true;
            return true;
        }
    }
    return false;
}
interactBtn.addEventListener("click", btnInteractEvent);

const EVENT_BULLET = "event1";
let eventVar = {
    current: "none",
    timeout: 0,
    time: 30,
}

function startEvent(event) {

}


export function eventTick(delta) {
    if (gameVar.stage === "stage2") {
        eventVar.time -= 10 * delta;

        if (eventVar.time <= 0) {
            eventVar.time = 30;
            eventVar.current = EVENT_BULLET;
            eventVar.timeout = 100;

            const regionBullet = regions.find(o => o.id === 25);

            regionBullet.x = 446;
            regionBullet.y = 126;
            regionBullet.enable = false;
        }

        if (eventVar.current === "none") return;

        switch (eventVar.current) {
            case EVENT_BULLET:
                handleBulletEvent(delta);
                break;
        }
    }
    else if (gameVar.stage === "stage1") {
        if (!q) {
            currentQ += 1;

            if (currentQ >= 4) {
                applyStage("stage2");
                return;
            }
            if (!startQuestion("q" + currentQ)) {
                currentQ -= 1;
            }
        }
    }
    else if (gameVar.stage === "stage3") {
        if (!q) {
            currentQ += 1;

            if (currentQ >= 10) {
                applyStage("stage4");
                return;
            }
            if (!startQuestion("q" + currentQ)) {
                currentQ -= 1;
            }
        }
    }
}

function handleBulletEvent(delta) {
    const regionBullet = regions.find(o => o.id === 25);
    const regionFire = regions.find(o => o.id === 27);

    if (!regionBullet) return;

    eventVar.timeout -= 100 * delta;
    if (eventVar.timeout > 0) {
        if (eventVar.timeout <= 10) {
            regionFire.enable = true;
            regionFire.img = "flame0.png";
        }
        return;
    }
    else {
        if (eventVar.timeout < -30) {
            regionFire.enable = false;
        }
        else if (eventVar.timeout < -20) {
            regionFire.img = "flame3.png";
        }
        else if (eventVar.timeout < -10) {
            regionFire.img = "flame2.png";
        }
        else if (eventVar.timeout < 0) {
            regionFire.img = "flame1.png";
        }
    
        if (!regionBullet.enable) {
            regionBullet.enable = true;
        }

        if (regionBullet.x > 2000) {
            eventVar.current = "none";
            return;
        }
        regionBullet.x += 300 * delta;
    }
}

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
        if (region.interactEvent.includes("stage")) {
            if (region.interactEvent === "stage3") {
                const activeRegions = regions.filter(r =>
                    r.interactEvent.includes("q") && r.enable
                );

                if (activeRegions.length > 0) {
                    setText("Vous devez d'abord sauver tous les soldats. (" + activeRegions.length + " restants)");
                }
                else {
                    applyStage(region.interactEvent);
                }
            }
            else {
                applyStage(region.interactEvent);
            }
        }
        else if (region.interactEvent.includes("q")) {
            showInteractBtn(region);
        }
        else if (region.interactEvent.includes("event")) {
            startEvent(region.interactEvent);
            region.enable = false;
        }
        else {
            // NOTIONG ??
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

    if (region.interactEvent === "stage3") {
        setText("");
    }
}

export function updatePlayer(deltaTime) {
    if (regions == null) return 0;
    
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
        playerRect.x = Math.max(0, Math.min(world.world2.width - playerRect.width, playerRect.x));
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
        playerRect.y = Math.max(0, Math.min(world.world2.height - playerRect.height, playerRect.y));
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

const DEAD_ZONE_RATIO = 0;
export function updateCamera() {
    if (DEAD_ZONE_RATIO === 0) {
        camera.x = Math.min(
            Math.max(
                playerRect.x + playerRect.width / 2 - camera.width / 2,
                0
            ),
            world.world2.width - camera.width
        );
        return;
    }

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
            world.world2.width - camera.width,
            playerRect.x + playerRect.width -
            (camera.width + deadZoneWidth) / 2
        );
    }

    updateJoystick();
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

export let beforeStage = "none";
export function applyStage(stage) {
    init();

    if (stage !== "gameOver") {
        beforeStage = stage;
    }

    window.gameVar.stage = stage;

    if (stage === "stage2")
    {   
        currentQ = 4;
        window.playerRect.x = 18;
        window.playerRect.y = 100;

        window.playerRect.direction = 'none';

        camera.x = 0
        camera.y = 0

        showJoystick();
    }
    else if (stage === "stage1") {
        currentQ = 0;
        hideJoystick();
    }
    else if (stage === "stage3") {
        currentQ = 7;
        hideJoystick();
    }
    else if (stage === "stage4") {
        setText("Félicitations ! Vous avez terminé le jeu.");
        hideJoystick();
    }
}