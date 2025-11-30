const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;

// Cores mágicas para partículas
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// SOM
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) { audio.currentTime = 0; audio.play().catch(e => console.log("Erro de áudio: " + e)); }
}

// THEME
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition = 'background 1.5s ease, color 1.5s ease';
    setTimeout(() => { body.style.transition = ''; }, 1600);
}

// ABRIR / FECHAR LIVRO
function toggleBook() {
    isOpen = !isOpen;
    if (isOpen) {
        bookContainer.classList.add('open');
        const pageTurnDelay = 200;
        setTimeout(() => playSound('soundPage'), 300);
        setTimeout(() => playSound('soundPage'), 300 + pageTurnDelay);
        setTimeout(() => playSound('soundPage'), 300 + 2 * pageTurnDelay);
        magicTimeout = setTimeout(startMagic, 500);
    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopMagic();
    }
}

// PARTICULAS MÁGICAS
function createParticle() {
    if (!isOpen) return;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 12 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    const color = body.classList.contains('dark-mode')
        ? ['#ffffff','#cfcfcf','#a0a0ff','#ffd700','#e0e0ff'][Math.floor(Math.random()*5)]
        : colors[Math.floor(Math.random()*colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size*3}px ${color}`;
    const rect = bookContainer.getBoundingClientRect();
    const startX = rect.left + rect.width/2;
    const startY = rect.top + rect.height/2;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    const tx = (Math.random() - 0.5) * 120;
    const txEnd = (Math.random() - 0.5) * 700;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--tx-end', `${txEnd}px`);
    const duration = Math.random() * 2 + 2;
    particle.style.animation = `floatUp ${duration}s ease-out forwards`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration*1000);
}

function startMagic() {
    stopMagic();
    for(let i=0;i<50;i++) setTimeout(createParticle, i*25);
    particleInterval = setInterval(createParticle, 25);
}

function stopMagic() { if(particleInterval) clearInterval(particleInterval); }

// PÁGINAS VOANDO
function flyPages(event){
    if(event){event.stopPropagation(); event.preventDefault && event.preventDefault();}
    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');
    pages.forEach((page,i)=>{
        setTimeout(()=>{
            const flyingPage = page.cloneNode(true);
            const rect = page.getBoundingClientRect();
            flyingPage.style.position='absolute';
            flyingPage.style.left=`${rect.left}px`;
            flyingPage.style.top=`${rect.top}px`;
            flyingPage.style.width=`${rect.width}px`;
            flyingPage.style.height=`${rect.height}px`;
            flyingPage.style.zIndex=1000;
            flyingPage.style.pointerEvents='none';
            flyingPage.style.transition='transform 4s ease-out, opacity 4s ease-out';
            document.body.appendChild(flyingPage);
            const endX=(Math.random()-0.5)*window.innerWidth*2;
            const endY=(Math.random()-0.5)*window.innerHeight*2;
            const rotateX=(Math.random()-0.5)*1080;
            const rotateY=(Math.random()-0.5)*1080;
            requestAnimationFrame(()=>{ flyingPage.style.transform=`translate(${endX}px,${endY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; flyingPage.style.opacity=0; });
            setTimeout(()=>flyingPage.remove(),4000);
        },i*100);
    });
}

// FOGO
let fireInterval=null;
function spawnFire(){
    const rect=bookContainer.getBoundingClientRect();
    const flame=document.createElement("div");
    flame.classList.add("fire");
    const startX=rect.left+rect.width/2-10+(Math.random()*20-10);
    const startY=rect.top+rect.height/2+30+(Math.random()*20-10);
    flame.style.left=`${startX}px`;
    flame.style.top=`${startY}px`;
    const size=Math.random()*12+6;
    flame.style.width=`${size}px`;
    flame.style.height=`${size}px`;
    document.body.appendChild(flame);
    setTimeout(()=>flame.remove(),1200);
}
function startFire(){ if(fireInterval)return; fireInterval=setInterval(spawnFire,80); }
function stopFire(){ clearInterval(fireInterval); fireInterval=null; }
function toggleFire(event){ if(event){event.stopPropagation(); event.preventDefault && event.preventDefault();} if(fireInterval) stopFire(); else startFire(); }

// EVENT LISTENERS
document.getElementById('flyBtn').addEventListener('click',flyPages);
document.getElementById('fireBtn').addEventListener('click',toggleFire);
bookContainer.addEventListener('click',toggleBook);
