// ... (Seu código existente até aqui: bookContainer, fireContainer, body, isOpen, fireActive, etc.) ...

// ==========================
// 🔥 FOGO DENTRO DO LIVRO (Lógica para o estilo da imagem)
// ==========================

function startFire() {
    if (fireActive) return; // Não faz nada se o fogo já estiver ativo
    
    fireActive = true;
    
    // Abrir o livro APENAS um pouco, se não estiver aberto
    if (!isOpen) {
        bookContainer.classList.add('open'); // O CSS vai definir o quão aberto ele fica
        isOpen = true; // Marca como aberto para não reabrir
    }
    
    // Ativar a animação da chama e o efeito de calor no livro
    if (fireContainer) {
        fireContainer.classList.add('active');
    }
    bookContainer.classList.add('fire-active'); 
    
    // Desligar partículas mágicas para focar no fogo, se existirem
    stopMagic(); 
}

function stopFire() {
    fireActive = false;
    
    // Desativar a animação da chama e o efeito de calor
    if (fireContainer) {
        fireContainer.classList.remove('active');
    }
    bookContainer.classList.remove('fire-active');
    
    // Fechar o livro completamente ao desligar o fogo
    if (isOpen) {
        bookContainer.classList.remove('open');
        isOpen = false;
    }
}

function toggleFire() {
    if (fireActive) {
        stopFire();
    } else {
        startFire();
    }
}

// ... (Resto do seu JavaScript) ...
