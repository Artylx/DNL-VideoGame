import { input } from './controls.js';

export let playerRect = {
    x: 100,
    y: 100,

    height: 5,
    width: 15,

    speed: 1,

    direction: 'none', // "right", "left"
    colliable: true,
}

export const playerAnim = {
    frame: 0,
    timer: 0,
    frameDuration: 150 // ms
};

export const obstacles = [
    { x: 160, y: 36, width: 25, height: 162 },
    { x: 347, y: 131, width: 87, height: 22 },
    { x: 400, y: 41, width: 87, height: 22 },
    { x: 465, y: 93, width: 22, height: 106 },
    { x: 545, y: 0, width: 22, height: 92 },
    { x: 624, y: 52, width: 177, height: 3 },
    { x: 798, y: 54, width: 5, height: 24 },
    { x: 794, y: 70, width: 26, height: 146 },
    { x: 894, y: 0, width: 99, height: 51 },
    { x: 915, y: 45, width: 62, height: 22 },
    { x: 881, y: 165, width: 87, height: 22 },
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

export function updatePlayer() {
    // Sauvegarde positions
    const prevX = playerRect.x;
    const prevY = playerRect.y;

    // Déplacement horizontal
    playerRect.x += input.x * playerRect.speed;

    if (playerRect.colliable) {
        // Collision horizontale
        for (const o of obstacles) {
            if (
                playerRect.x < o.x + o.width &&
                playerRect.x + playerRect.width > o.x &&
                playerRect.y + playerRect.height > o.y &&
                playerRect.y < o.y + o.height
            ) {
                // Collision → revenir à la position précédente
                if (input.x > 0) playerRect.x = o.x - playerRect.width;
                else if (input.x < 0) playerRect.x = o.x + o.width;
            }
        }

        // Limites monde X
        playerRect.x = Math.max(0, Math.min(world.width - playerRect.width, playerRect.x));
    }
    
    // Déplacement vertical
    playerRect.y += input.y * playerRect.speed;

    if (playerRect.colliable) {
        // Collision verticale
        for (const o of obstacles) {
            if (
                playerRect.y < o.y + o.height &&
                playerRect.y + playerRect.height > o.y &&
                playerRect.x + playerRect.width > o.x &&
                playerRect.x < o.x + o.width
            ) {
                // Collision → revenir à la position précédente
                if (input.y > 0) playerRect.y = o.y - playerRect.height;
                else if (input.y < 0) playerRect.y = o.y + o.height;
            }
        }

        // Limites monde Y
        playerRect.y = Math.max(0, Math.min(world.height - playerRect.height, playerRect.y));

    }
    
    // Direction
    if (input.x > 0) playerRect.direction = 'right';
    else if (input.x < 0) playerRect.direction = 'left';
    else playerRect.direction = 'none';
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