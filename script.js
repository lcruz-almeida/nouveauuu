const bookContainer = document.getElementById('bookContainer');
const fireContainer = document.getElementById('fireContainer'); // AQUI!
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;
let fireActive = false; 

// Cores mágicas para partículas
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// FUNÇÃO PARA TOCAR SOM (mantida)
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Erro de áudio: " + e));
    }
}

// Alternar tema (mantida)
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition = 'background 1.5s ease, color 1.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 1600);
}

// Abrir/fechar livro (mantida)
function toggleBook() {
    if (fireActive && isOpen) return; 

    isOpen = !isOpen;
    if (isOpen) {
        bookContainer.classList.add('open');
        // Sons e magia...
        const pageTurnDelay = 200;
        setTimeout(() => playSound('soundPage'), 300);
        setTimeout(() => playSound('soundPage'), 300 + pageTurnDelay);
        setTimeout(() => playSound('soundPage'), 300 + 2 * pageTurnDelay);
        magicTimeout = setTimeout(startMagic, 500);
    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopMagic();
        if (fireActive) stopFire(); 
    }
}

// ... (Seu código para partículas e flyPages aqui) ... 
// Atenção: As funções createParticle, startMagic, stopMagic e flyPages não foram alteradas

// ==========================
// 🔥 FOGO DENTRO DO LIVRO (Funcionalidade ajustada)
// ==========================

function startFire() {
    if (fireActive) return;
    
    fireActive = true;
    
    // 1. Abrir o livro se estiver fechado
    if (!isOpen) {
        bookContainer.classList.add('open');
        isOpen = true;
    }
    
    // 2. Ativar a animação da chama (torna-a visível)
    if (fireContainer) { // Adicionado verificação para garantir que o elemento existe
        fireContainer.classList.add('active');
    }
    bookContainer.classList.add('fire-active'); 
    
    // 3. Desligar as partículas
    stopMagic(); 
}

function stopFire() {
    fireActive = false;
    
    // Desativar a animação da chama (torna-a invisível)
    if (fireContainer) { // Adicionado verificação
        fireContainer.classList.remove('active');
    }
    bookContainer.classList.remove('fire-active');
    
    // Fechar o livro
    if (isOpen) { 
        toggleBook(); 
    }
}

function toggleFire() {
    if (fireActive) {
        stopFire();
    } else {
        startFire();
    }
}
