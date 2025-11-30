const bookContainer = document.getElementById('bookContainer');
const body = document.body;
const flameHolder = document.getElementById('flameHolder');
let isOpen = false;
let particleInterval;
let magicTimeout;

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
    setTimeout(() => { body.style.transition = ''; }, 1600);
}

// Abrir/fechar livro
function toggleBook() {
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

    let currentColors = body.classList.contains('dark-mode')
        ? ['#ffffff', '#cfcfcf', '#a0a0ff', '#ffd700', '#e0e0ff']
        : colors;

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

let fireInterval = null;
let sparkInterval = null;
let mainFlame = null;

function createMainFlame() {
    // se já existe, devolve
    if (mainFlame) return mainFlame;

    const flame = document.createElement("div");
    flame.classList.add("flame");

    // camadas
    const outer = document.createElement("div");
    outer.classList.add("outer");
    const mid = document.createElement("div");
    mid.classList.add("mid");
    const core = document.createElement("div");
    core.classList.add("core");

    flame.appendChild(outer);
    flame.appendChild(mid);
    flame.appendChild(core);

    flameHolder.appendChild(flame);
    mainFlame = flame;

    return flame;
}

function spawnSpark() {
    // cria faíscas pequenas com trajectória aleatória
    const s = document.createElement("div");
    s.classList.add("spark");

    const w = 6 + Math.random() * 8;
    s.style.width = `${w}px`;
    s.style.height = `${w}px`;

    const offsetX = (Math.random() - 0.5) * 80; // espalhar dentro do holder
    const startLeft = 50 + offsetX; // em percent (após ajustarmos abaixo)
    s.style.left = `${startLeft}%`;

    // começar perto da base
    s.style.bottom = `${10 + Math.random() * 10}px`;
    s.style.opacity = 1;

    // animação manual via JS: translateY e drift
    const duration = 800 + Math.random() * 900;
    s.style.transition = `transform ${duration}ms cubic-bezier(.2,.6,.2,1), opacity ${duration}ms ease-out`;
    flameHolder.appendChild(s);

    // forçar layout
    requestAnimationFrame(() => {
        const endX = (Math.random() - 0.5) * 100;
        const endY = -120 - Math.random() * 80;
        const rot = (Math.random() - 0.5) * 80;
        s.style.transform = `translate(${endX}px, ${endY}px) rotate(${rot}deg) scale(${0.6 + Math.random()})`;
        s.style.opacity = 0;
    });

    setTimeout(() => s.remove(), duration + 50);
}

// Função para começar o fogo
function startFire() {
    // se já ativo, ignora
    if (fireInterval) return;

    // se o livro não estiver aberto, abre-o (mas sem tocar no resto)
    if (!isOpen) {
        isOpen = true;
        bookContainer.classList.add('open');
        // disparar sons leves de página
        setTimeout(() => playSound('soundPage'), 200);
    }

    // marcar estado visual
    bookContainer.classList.add('fire-on');

    // criar chama principal
    createMainFlame();

    // spawna faíscas periodicamente
    sparkInterval = setInterval(spawnSpark, 120);

    // opcional: efeito contínuo de pequenas partículas (como antes)
    fireInterval = setInterval(() => {
        // cria pequenas partículas amareladas dentro do holder (apenas visuais)
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = 4 + Math.random() * 10;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${flameHolder.getBoundingClientRect().left + flameHolder.clientWidth/2 + (Math.random()-0.5)*40}px`;
        p.style.top = `${flameHolder.getBoundingClientRect().top + flameHolder.clientHeight/2 + (Math.random()-0.5)*30}px`;
        p.style.background = ['#ffd700','#ff9a9e','#ffb86b','#fff7cc'][Math.floor(Math.random()*4)];
        p.style.boxShadow = `0 0 ${size*2}px ${p.style.background}`;
        const tx = (Math.random()-0.5)*40;
        const txEnd = (Math.random()-0.5)*120;
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--tx-end', `${txEnd}px`);
        const duration = 600 + Math.random()*900;
        p.style.animation = `floatUp ${duration/1000}s ease-out forwards`;
        document.body.appendChild(p);
        setTimeout(()=>p.remove(), duration+100);
    }, 160);
}

// Função para parar o fogo
function stopFire() {
    if (sparkInterval) { clearInterval(sparkInterval); sparkInterval = null; }
    if (fireInterval) { clearInterval(fireInterval); fireInterval = null; }

    // remove a chama principal
    if (mainFlame) {
        mainFlame.remove();
        mainFlame = null;
    }

    // limpar faíscas remanescentes no holder
    const sparks = flameHolder.querySelectorAll('.spark');
    sparks.forEach(s => s.remove());

    // limpar partículas criadas no document.body (as nossas pequenas partículas de fogo)
    const bodyParticles = document.querySelectorAll('body > .particle');
    bodyParticles.forEach(p => {
        // só remover as que parecem ter sido criadas pelo fogo (pequenas e amareladas)
        // não fazemos distinção fina — remove partículas com mix-blend ou proximidade ao livro
        if (parseFloat(getComputedStyle(p).width) <= 18) p.remove();
    });

    // remover classe visual
    bookContainer.classList.remove('fire-on');
}

function toggleFire() {
    if (fireInterval || sparkInterval || mainFlame) {
        stopFire();
    } else {
        startFire();
    }
}
