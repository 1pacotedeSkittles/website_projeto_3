
//CONTAINER
const rect1 = document.getElementById('rect1');
const buttons = document.getElementById('buttons');
const content = document.getElementById('content');
const rect2 = document.getElementById('rect2');

//LIMITS
const min_limit=-window.innerWidth;
const max_limit= 0;
//max
let currentX = min_limit;
let parallaxX=0;
//min
let targetX = min_limit;


// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    const scrollAmount = e.deltaY;
    const newTargetX= targetX + scrollAmount * 0.7; // novo destino X
    
    //limite
    targetX= Math.max(min_limit, Math.min(newTargetX,max_limit))
}, { passive: false }); //permite usar prevent default
 

// Animação suave com requestAnimationFrame
function animate() {
    // Interpolação suave (easing)
    currentX += (targetX - currentX) * 0.1;
    //parallaxX = currentX * 0.5;

    const vw =window.innerWidth/100;
    const rect1_initialX=83*vw;
    const rect2_initialX=-2*vw;
    const rectsY=-84*vw;
    let add =15*vw;


    rect1.style.transform = `translate(${rect1_initialX + currentX + add }px , ${rectsY}px) rotate(-45deg)`;
    rect2.style.transform = `translate(${rect2_initialX + currentX}px , ${rectsY}px) rotate(-45deg)`;

    requestAnimationFrame(animate); //chama se a si propria-loop infinito
}

animate();