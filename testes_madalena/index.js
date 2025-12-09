//CONTAINER

const container = document.getElementById('container');
let currentX = window.innerWidth;  // Começa à direita
let currentY = -window.innerHeight; // Começa acima
let targetX = -window.innerWidth;
let targetY = window.innerHeight;

// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    // Move diagonal: tanto X como Y baseado no deltaY do scroll
    const scrollAmount = e.deltaY; //quanto scroll (+:baixo; -:cima)
    targetX += scrollAmount * 0.7; // novo destino X
    targetY -= scrollAmount * 0.7; // novo destino Y
    //- pq queremos q o conteudo suba
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


//CONTAINER2

const container2 = document.getElementById('container2');
let currentX2 = -window.innerWidth;  // Começa à esquerda
let currentY2 = window.innerHeight;   // Começa abaixo
let targetX2 = window.innerWidth;
let targetY2 = -window.innerHeight;


// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    // Move diagonal: tanto X como Y baseado no deltaY do scroll
    const scrollAmount = e.deltaY; //quanto scroll (+:baixo; -:cima)
    targetX2 -= scrollAmount * 0.7; // novo destino X
    targetY2 += scrollAmount * 0.7; // novo destino Y
    //- pq queremos q o conteudo desça
}, { passive: false }); //permite usar prevent default
 
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