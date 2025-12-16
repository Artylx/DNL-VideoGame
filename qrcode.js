alert("qrcode.js loaded");

function handleMissingQR() {
    console.clear();
    const img = document.querySelector(".qrcode-image img");
    img.src = "/assets/img_error.png";

    document.querySelector(".upload-btn").innerHTML = "<p>Le QR Code est manquant.</p>";
}

function init_qrcode(link_str) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/style-qrcode.css";

    document.head.appendChild(link);

    const qrButton = document.createElement("div");
    document.body.appendChild(qrButton);

    qrButton.classList.add("qrcode-button");
    qrButton.innerHTML = '<img class="icon-qrcode" src="/DNL-VideoGame/assets/qrcode/icon.png" alt="QR Code Icon">';

    const qrContainer = document.createElement("div");
    document.body.appendChild(qrContainer);

    qrContainer.classList.add("qrcode-container");
    qrContainer.innerHTML = `
        <div class="qrcode-content">
            <button class="close-btn" aria-label="Close QR Code Viewer"></button>
            <div class="qrcode-image">
                <img src="/DNL-VideoGame/assets/qrcode/` + link_str + `" alt="QR Code to access the game on mobile devices" onerror="handleMissingQR()">
            </div>
            <div class="upload-btn"><a href="/DNL-VideoGame/assets/qrcode/` + link_str + `" download="DNL_Game_QRCode.png" class="download-link">Télécharger le QR Code</a></div>
        </div>
    `;
}

if (window.location.href.includes("sites/game/index.html")) {
    init_qrcode("game.png");
}
else if (window.location.href.includes("sites/chapter1/index.html")) {
    init_qrcode("chapter1.png");
}
else if (window.location.href.includes("sites/chapter2/index.html")) {
    init_qrcode("chapter2.png");
}


document.addEventListener("DOMContentLoaded", function() {
    const qrButton = document.querySelector(".qrcode-button");
    const qrContainer = document.querySelector(".qrcode-container");

    qrButton.addEventListener("click", function(e) {
        if (e.target !== qrButton && !qrButton.contains(e.target)) {
            return;
        }

        qrContainer.style.top = "0px";
    });

    qrContainer.addEventListener("click", function(e) {
        if (e.target !== qrContainer && e.target !== document.querySelector(".close-btn")) {
            return;
        }
        qrContainer.style.top = "-100vh";
    });
});