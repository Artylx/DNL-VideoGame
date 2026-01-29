// Supprime un QR code existant
function removeOldQRCode() {
    const oldButton = document.querySelector(".qrcode-button");
    const oldContainer = document.querySelector(".qrcode-container");
    if (oldButton) oldButton.remove();
    if (oldContainer) oldContainer.remove();
}

// Gestion image manquante
function handleMissingQR() {
    console.clear();
    const img = document.querySelector(".qrcode-image img");
    if (img) img.src = "/DNL-VideoGame/assets/img_error.png";

    const uploadBtn = document.querySelector(".upload-btn");
    if (uploadBtn) uploadBtn.innerHTML = "<p>Le QR Code est manquant.</p>";
}

// Initialise le QR code pour une page donnée
function init_qrcode(link_str) {
    // Supprime l’ancien QR code
    removeOldQRCode();

    // Ajoute le CSS si pas déjà présent
    if (!document.querySelector('link[href="/DNL-VideoGame/styles/style-qrcode.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/DNL-VideoGame/styles/style-qrcode.css";
        document.head.appendChild(link);
    }

    // Crée le bouton
    const qrButton = document.createElement("div");
    qrButton.classList.add("qrcode-button");
    qrButton.innerHTML = '<img class="icon-qrcode" src="/DNL-VideoGame/assets/qrcode/icon.png" alt="QR Code Icon">';
    document.body.appendChild(qrButton);

    // Crée le container
    const qrContainer = document.createElement("div");
    qrContainer.classList.add("qrcode-container");
    qrContainer.innerHTML = `
        <div class="qrcode-content">
            <button class="close-btn" aria-label="Close QR Code Viewer"></button>
            <div class="qrcode-image">
                <img src="/DNL-VideoGame/assets/qrcode/${link_str}" alt="QR Code" onerror="handleMissingQR()">
            </div>
            <div class="upload-btn">
                <a href="/DNL-VideoGame/assets/qrcode/${link_str}" download="DNL_Game_QRCode.png" class="download-link">Télécharger le QR Code</a>
            </div>
        </div>
    `;
    document.body.appendChild(qrContainer);

    // Événements
    qrButton.addEventListener("click", () => {
        qrContainer.style.top = "0px";
    });

    qrContainer.addEventListener("click", (e) => {
        if (e.target === qrContainer || e.target.classList.contains("close-btn")) {
            qrContainer.style.top = "-100vh";
        }
    });
}

// Met à jour le QR code selon le hash ou fallback
function updateQRCode() {
    const page = window.location.hash.substring(1) || "game";
    init_qrcode(`${page}.png`);
}

// Initialisation
updateQRCode();
window.addEventListener("hashchange", updateQRCode);
