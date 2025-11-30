const bookContainer = document.getElementById('bookContainer');
const fireContainer = document.getElementById('fireContainer'); 
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;
let fireActive = false; 

// Cores mágicas para partículas
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// FUNÇÃO PARA TOCAR SOM
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Erro de áudio: " + e));
    }
}

// Alternar tema (dark/light)
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition = 'background 1.5s ease, color 1.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 1600);
}

// Abrir/fechar livro
function toggleBook() {
    // Se o fogo estiver ativo e o livro aberto, não permitir fechar
    if (fireActive && isOpen) return; 

    isOpen = !isOpen;
    if (isOpen) {
        bookContainer.classList.add('open');
        // Sons das páginas
        const pageTurnDelay = 200;
        setTimeout(() => playSound('soundPage'), 300);
        setTimeout(() => playSound('soundPage'), 300 + pageTurnDelay);
        setTimeout(() => playSound('soundPage'), 300 + 2 * pageTurnDelay);
        // Iniciar partículas mágicas após páginas viradas
        magicTimeout = setTimeout(startMagic, 500);
    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopMagic();
        // Garantir que o fogo para se o livro for fechado manualmente
        if (fireActive) stopFire(); 
    }
}

// CRIAR PARTÍCULAS MÁGICAS
function createParticle() {
    if (!isOpen) return;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 12 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    let currentColors = body.classList.contains('dark-mode') ? ['#ffffff', '#cfcfcf', '#a0a0ff', '#ffd700', '#e0e0ff'] : colors;
    const color = currentColors[Math.floor(Math.random() * currentColors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
    const rect = bookContainer.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    const tx = (Math.random() - 0.5) * 120;
    const txEnd = (Math.random() - 0.5) * 700;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--tx-end', `${txEnd}px`);
    const duration = Math.random() * 2 + 2;
    particle.style.animation = `floatUp ${duration}s ease-out forwards`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

function startMagic() {
    stopMagic(); 
    for(let i = 0; i < 50; i++) setTimeout(createParticle, i * 25);
    particleInterval = setInterval(createParticle, 25);
}

function stopMagic() {
    if (particleInterval) clearInterval(particleInterval);
    particleInterval = null; 
}

// FAZER AS PÁGINAS VOAREM PELO ECRÃ
function flyPages() {
    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');
    pages.forEach((page, i) => {
        setTimeout(() => {
            const flyingPage = page.cloneNode(true);
            const rect = page.getBoundingClientRect();
            flyingPage.style.position = 'absolute';
            flyingPage.style.left = `${rect.left}px`;
            flyingPage.style.top = `${rect.top}px`;
            flyingPage.style.width = `${rect.width}px`;
            flyingPage.style.height = `${rect.height}px`;
            flyingPage.style.zIndex = 1000;
            flyingPage.style.pointerEvents = 'none';
            flyingPage.style.transition = 'transform 4s ease-out, opacity 4s ease-out';
            document.body.appendChild(flyingPage);

            // Trajetória aleatória simulando vento
            const endX = (Math.random() - 0.5) * window.innerWidth * 2;
            const endY = (Math.random() - 0.5) * window.innerHeight * 2;
            const rotateX = (Math.random() - 0.5) * 1080;
            const rotateY = (Math.random() - 0.5) * 1080;

            requestAnimationFrame(() => {
                flyingPage.style.transform = `translate(${endX}px, ${endY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                flyingPage.style.opacity = 0;
            });

            setTimeout(() => flyingPage.remove(), 4000);
        }, i * 100);
    });
}


// ==========================
// 🔥 FOGO DENTRO DO LIVRO
// ==========================

function startFire() {
    if (fireActive) return;
    
    fireActive = true;
    
    // 1. Abrir o livro se estiver fechado
    if (!isOpen) {
        bookContainer.classList.add('open');
        isOpen = true;
    }
    
    // 2. Ativar a animação da chama e o efeito de calor
    fireContainer.classList.add('active');
    bookContainer.classList.add('fire-active'); 
    
    // 3. Desligar as partículas mágicas para focar no fogo
    stopMagic(); 
}

function stopFire() {
    fireActive = false;
    
    // Desativar a animação da chama e o efeito de calor
    fireContainer.classList.remove('active');
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
