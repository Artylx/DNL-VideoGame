async function loadPages() {
    const div = document.querySelector(".container");
    if (!div) return;

    try {
        const response = await fetch("/DNL-VideoGame/sites/chapters/pages.json");

        if (!response.ok) {
            throw new Error("Impossible de charger pages.json");
        }

        const data = await response.json();
        const pages = data.pages;

        // Récupère le hash sans le #
        const pageName = window.location.hash.substring(1);

        // Cherche la page correspondant au hash
        const page = pages.find(p => p.hash === pageName);

        if (!page) {
            showErrorPage(div);
            return;
        }

        showPage(page, div);

    } catch (error) {
        console.error(error);
        showErrorPage();
    }
}

function removeAll() {
    const oldDesc = document.querySelector("#page-description");
    if (oldDesc) oldDesc.remove();

    // Supprime l'ancien mainContent si existant
    const oldMain = document.querySelector("#mainContent");
    if (oldMain) oldMain.remove();
}

function showPage(page, div) {
    // Met à jour le titre de l'onglet et le h1
    document.title = page.title;
    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = "";

    removeAll();

    // Crée un conteneur pour le contenu HTML principal
    const main = document.createElement("div");
    main.id = "mainContent";
    main.innerHTML = page.mainContent || ""; // injecte le HTML de mainContent
    div.appendChild(main);
}

function showErrorPage(div) {
    document.title = "404 - Page introuvable";
    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = "404 - Page introuvable";

    removeAll();

    const p = document.createElement("p");
    p.id = "page-description";
    p.textContent = "Le chapitre demandé n'existe pas.";
    div.appendChild(p);
}

// Lancement initial
loadPages();

// Écoute des changements de hash
window.addEventListener("hashchange", loadPages);
