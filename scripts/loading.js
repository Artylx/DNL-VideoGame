const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/DNL-VideoGame/styles/loading.css";

window.addEventListener("load", () => {
    const overlay = document.createElement("div");
    document.body.appendChild(overlay);
    overlay.id = "loading-overlay";

    overlay.innerHTML = '<img src="/DNL-VideoGame/assets/logo_dnl.png" alt="Chargement" class="loading-logo">'
 
    const MIN_DURATION = 1000;
    const start = performance.now();

    const hide = () => {
        overlay.classList.add("hide");
        setTimeout(() => overlay.remove(), 300);
    };

    const elapsed = performance.now() - start;
    const remaining = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(hide, remaining);
});