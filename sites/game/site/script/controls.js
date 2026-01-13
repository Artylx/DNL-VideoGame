// controls.js

export const input = {
    x: 0,
    y: 0
};

let isDragging = false;
let startX = 0;
let startY = 0;

const joystick = document.querySelector('.joystick-container');
const knob = document.querySelector('.joystick');

function getPosition(e) {
    if (e.touches && e.touches.length > 0) {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    return {
        x: e.clientX,
        y: e.clientY
    };
}

function startDrag(e) {
    isDragging = true;
    const pos = getPosition(e);
    startX = pos.x;
    startY = pos.y;
}

function stopDrag() {
    isDragging = false;
    knob.style.transform = 'translate(0, 0)';
    input.x = 0;
    input.y = 0;
}

function moveDrag(e) {
    if (!isDragging) return;

    const pos = getPosition(e);
    const dx = pos.x - startX;
    const dy = pos.y - startY;

    const maxDistance = 60;
    const distance = Math.min(Math.hypot(dx, dy), maxDistance);
    const angle = Math.atan2(dy, dx);

    input.x = Math.cos(angle) * (distance / maxDistance);
    input.y = Math.sin(angle) * (distance / maxDistance);

    knob.style.transform = `
        translate(
            ${input.x * maxDistance}px,
            ${input.y * maxDistance}px
        )
    `;
}

// events
knob.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', moveDrag);
document.addEventListener('mouseup', stopDrag);

knob.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', moveDrag, { passive: false });
document.addEventListener('touchend', stopDrag);
document.addEventListener('touchcancel', stopDrag);