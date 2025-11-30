const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;
let fireInterval = null;
let lumiereInterval = null;

const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if(audio) { audio.currentTime=0; audio.play().catch(e=>console.log("Erro de áudio: "+e)); }
}

function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition='background 1.5s ease, color 1.5s ease';
    setTimeout(()=>{ body.style.transition=''; }, 1600);
}

function toggleBook() {
    isOpen = !isOpen;
    if(isOpen){
        bookContainer.classList.add('open');
        const pageTurnDelay = 200;
        setTimeout(()=>playSound('soundPage'),300);
        setTimeout(()=>playSound('soundPage'),300+pageTurnDelay);
        setTimeout(()=>playSound('soundPage'),300+2*pageTurnDelay);
        magicTimeout = setTimeout(startMagic,500);
    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopMagic();
    }
}

// PARTICULAS
function createParticle() {
    if(!isOpen) return;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random()*12+4;
    particle.style.width=`${size}px`;
    particle.style.height=`${size}px`;
    let currentColors = body.classList.contains('dark-mode')? ['#ffffff','#cfcfcf','#a0a0ff','#ffd700','#e0e0ff']: colors;
    const color = currentColors[Math.floor(Math.random()*currentColors.length)];
    particle.style.background=color;
    particle.style.boxShadow=`0 0 ${size*3}px ${color}`;
    const rect=bookContainer.getBoundingClientRect();
    const startX=rect.left+rect.width/2;
    const startY=rect.top+rect.height/2;
    particle.style.left=`${startX}px`;
    particle.style.top=`${startY}px`;
    const tx=(Math.random()-0.5)*120;
    const txEnd=(Math.random()-0.5)*700;
    particle.style.setProperty('--tx',`${tx}px`);
    particle.style.setProperty('--tx-end',`${txEnd}px`);
    const duration=Math.random()*2+2;
    particle.style.animation=`floatUp ${duration}s ease-out forwards`;
    document.body.appendChild(particle);
    setTimeout(()=>particle.remove(),duration*1000);
}

function startMagic() { stopMagic(); for(let i=0;i<50;i++) setTimeout(createParticle,i*25); particleInterval=setInterval(createParticle,25);}
function stopMagic(){ if(particleInterval) clearInterval(particleInterval); }

// PAGINAS VOANDO
function flyPages() {
    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');
    pages.forEach((page,i)=>{
        setTimeout(()=>{
            const flyingPage=page.cloneNode(true);
            const rect=page.getBoundingClientRect();
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
            requestAnimationFrame(()=>{
                flyingPage.style.transform=`translate(${endX}px,${endY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                flyingPage.style.opacity=0;
            });
            setTimeout(()=>flyingPage.remove(),4000);
        },i*100);
    });
}

// FOGO
function spawnFire() {
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

function startFire(){ if(fireInterval) return; fireInterval=setInterval(spawnFire,80); }
function stopFire(){ clearInterval(fireInterval); fireInterval=null; }
function toggleFire(){ if(fireInterval) stopFire(); else startFire(); }

// NOVOS BOTÕES
function magicSound(){ playSound('soundPage'); }

function rainbowParticles(){
    const extraColors=['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff'];
    const originalColors=[...colors];
    colors.push(...extraColors);
    startMagic();
    setTimeout(()=>{ colors.length=originalColors.length; },3000);
}

function shakeBook(){
    bookContainer.classList.add('shake');
    setTimeout(()=>bookContainer.classList.remove('shake'),500);

}

function resetBook() {
    // Fecha o livro
    isOpen = false;
    bookContainer.classList.remove('open');

    // Para partículas mágicas
    stopMagic();

    // Para fogo
    stopFire();

    // Para halo Lumière
    if (lumiereInterval) {
        clearInterval(lumiereInterval);
        lumiereInterval = null;
    }

    // Remove todas as partículas visíveis
    document.querySelectorAll('.particle, .fire, .lumiere-particle').forEach(el => el.remove());

}

// LUMIERE - halo mágico
function lumiere() {
    if (lumiereInterval) {
        clearInterval(lumiereInterval);
        lumiereInterval = null;
        return;
    }

    const haloColors = ['#ffeaa7','#fab1a0','#74b9ff','#a29bfe','#81ecec','#fd79a8'];

 function lumiere() {
    if (lumiereInterval) {
        clearInterval(lumiereInterval);
        lumiereInterval = null;
        return;
    }

    const haloColors = ['#ffeaa7','#fab1a0','#74b9ff','#a29bfe','#81ecec','#fd79a8'];

    lumiereInterval = setInterval(() => {
        const rect = bookContainer.getBoundingClientRect();
        const particle = document.createElement('div');
        particle.classList.add('lumiere-particle');

        const size = Math.random() * 20 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const color = haloColors[Math.floor(Math.random() * haloColors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size*2}px ${color}, 0 0 ${size*4}px ${color}`;

        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 300 + 200;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;

        particle.style.setProperty('--dx', `${endX - startX}px`);
        particle.style.setProperty('--dy', `${endY - startY}px`);

        const duration = Math.random() * 2 + 2;
        particle.style.animation = `lumiereMove ${duration}s ease-out forwards`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    }, 50);
}


}
