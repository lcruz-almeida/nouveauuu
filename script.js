/* todo o teu JS original permanece igual até à parte do fogo */


/* ====================================================== */
/* 🔥🔥🔥   NOVA VERSÃO DA FUNÇÃO DO FOGO  🔥🔥🔥 */
/* ====================================================== */

let fireInterval = null;

function spawnFire() {
    const container = document.querySelector(".fire-container");

    const flame = document.createElement("div");
    flame.classList.add("fire");

    // tamanho variável
    const size = Math.random() * 20 + 15;
    flame.style.width = `${size}px`;
    flame.style.height = `${size}px`;

    // pequena variação horizontal
    const offsetX = (Math.random() - 0.5) * 40;
    flame.style.left = `${offsetX}px`;

    container.appendChild(flame);

    setTimeout(() => flame.remove(), 1000);
}

function startFire() {
    if (fireInterval) return;
    fireInterval = setInterval(spawnFire, 80);
}

function stopFire() {
    clearInterval(fireInterval);
    fireInterval = null;
}

function toggleFire() {
    if (fireInterval) stopFire();
    else startFire();
}
