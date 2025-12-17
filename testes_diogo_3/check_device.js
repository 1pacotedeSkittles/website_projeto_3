// check-device.js
(function() {
    const larguraMinima = 1024;

    if (window.innerWidth < larguraMinima) {
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background:#1a1a1a; color:white; font-family:sans-serif; text-align:center;">
                <h1>⚠️ Acesso Limitado</h1>
                <p>Este site não está otimizado para dispositivos móveis.</p>
                <p>Por favor, utilize um computador.</p>
            </div>
        `;
        // Impede que qualquer outro script que venha depois execute lógica pesada
        window.stop(); 
        throw new Error("Bloqueio de dispositivo móvel ativo.");
    }
})();