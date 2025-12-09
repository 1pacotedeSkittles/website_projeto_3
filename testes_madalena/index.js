//CONTAINER

const container = document.getElementById('container');
let currentX = 0;  // Começa à direita
let currentY = 0; // Começa acima
let targetX = 0;
let targetY = 0;

//CONTAINER2

const container2 = document.getElementById('container2');
let currentX2 = 0;  // Começa à esquerda
let currentY2 = 0;   // Começa abaixo
let targetX2 = 0;
let targetY2 = 0;

// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    // Move diagonal: tanto X como Y baseado no deltaY do scroll
    const scrollAmount = e.deltaY; //quanto scroll (+:baixo; -:cima)
    targetX -= scrollAmount * 0.7; // novo destino X
    targetY += scrollAmount * 0.7; // novo destino Y
    //- pq queremos q o conteudo suba

    targetX2 += scrollAmount * 0.7; // novo destino X
    targetY2 -= scrollAmount * 0.7; // novo destino Y
    //+ pq queremos q o conteudo desça
}, { passive: false }); //permite usar prevent default
 

// Animação suave com requestAnimationFrame
function animate() {
    // Interpolação suave (easing)
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    //target-current - dist que falta percorrer
    //0.1 - move 10% dessa dist, cria o efeito smooth

    container.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animate); //chama se a si propria-loop infinito
}

animate();

// Animação suave com requestAnimationFrame
function animate2() {
    // Interpolação suave (easing)
    currentX2 += (targetX2 - currentX2) * 0.1;
    currentY2 += (targetY2 - currentY2) * 0.1;

    //target-current - dist que falta percorrer
    //0.1 - move 10% dessa dist, cria o efeito smooth

    container2.style.transform = `translate(${currentX2}px, ${currentY2}px)`;

    requestAnimationFrame(animate2); //chama se a si propria-loop infinito
}

animate2();