//CONTAINER

const container = document.getElementById('container');
const rect = container.getBoundingClientRect();
let currentX = rect.x + rect.width / 2; // centro X
let currentY = rect.y + rect.height / 2; // centro Y
let targetX = currentX;
let targetY = currentY;

//CONTAINER2

const container2 = document.getElementById('container2');
const rect2 = container2.getBoundingClientRect();
let currentX2 = rect2.x + rect2.width / 2; // centro X
let currentY2 = rect2.y + rect2.height / 2; // centro Y
let targetX2 = currentX2;
let targetY2 = currentY2;

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