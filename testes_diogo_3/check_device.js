(function() {
    // 1. Criamos o estilo e injetamos no HEAD
    const style = document.createElement('style');
    style.innerHTML = `
        /* Estilo da mensagem (escondida por padrão) */
        #bloqueio-mobile {
            display: none; 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh;
            background: #1a1a1a; 
            color: white; 
            z-index: 10000; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center;
            font-family: sans-serif;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }

        /* A MÁGICA: Só ativa quando o ecrã for menor que 1024px */
        @media (max-width: 1023px) {
            #bloqueio-mobile { 
                display: flex !important; 
            }
            body { 
                overflow: hidden !important; /* Bloqueia o scroll do site */
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Criamos a DIV apenas uma vez
    const criarMensagem = () => {
        if (!document.getElementById('bloqueio-mobile')) {
            const div = document.createElement('div');
            div.id = 'bloqueio-mobile';
            div.innerHTML = `
                <h1>⚠️ Acesso Limitado</h1>
                <p>Este site não está otimizado para dispositivos móveis.</p>
                <p>Por favor, utilize um computador.</p>
            `;
            document.body.prepend(div);
        }
    };

    // 3. Garante que a DIV é criada assim que o Body estiver pronto
    if (document.body) {
        criarMensagem();
    } else {
        document.addEventListener('DOMContentLoaded', criarMensagem);
    }
})();