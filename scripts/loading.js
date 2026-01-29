const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/DNL-VideoGame/styles/loading.css";

document.head.appendChild(link);

let MIN_DURATION = 1000;
if (window.location.pathname === "/DNL-VideoGame/sites/game/site/index.html") {
    MIN_DURATION = 3000;
}

window.addEventListener("load", () => {
    const overlay = document.createElement("div");
    document.body.appendChild(overlay);
    overlay.id = "loading-overlay";

    overlay.style.visibility = "visible";

    overlay.innerHTML = '<img src="/DNL-VideoGame/assets/logo_dnl.png" alt="Chargement" class="loading-logo">'
 
    
    const start = performance.now();

    const hide = () => {
        overlay.classList.add("hide");
        document.body.style.visibility = "visible";
        setTimeout(() => overlay.remove(), 300);
    };

    const elapsed = performance.now() - start;
    const remaining = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(hide, remaining);
});