
//LIMITS
const initial_limit=window.innerWidth;
const final_limit=0;

const initial_opacity=1;
const final_opacity=0;

//WARNING
const warning = document.getElementById('warning');
let current_opacity= initial_opacity;
let target_ocpacity=initial_opacity;

//CONTAINER
const container = document.getElementById('first_line');
//max
let currentX = initial_limit;
//min
let targetX = initial_limit;

//CONTAINER2
const container2 = document.getElementById('second_line');
const buttons = document.getElementById('buttons');

let currentX2 = -initial_limit;
let targetX2 = -initial_limit;


// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    const scrollAmount = e.deltaY;
    const newTargetX= targetX - scrollAmount * 0.7; // novo destino X
    const newTargetX2= targetX2 + scrollAmount * 0.7; // novo destino X
    const newTarget_opacity= target_ocpacity - scrollAmount *0.7;

    //limite
    targetX= Math.min(Math.max(newTargetX,final_limit), initial_limit)
    targetX2= Math.min(Math.max(newTargetX2,-initial_limit), final_limit)
    target_ocpacity=Math.min(Math.max(newTarget_opacity, -initial_opacity), final_opacity)
}, { passive: false }); //permite usar prevent default
 

// Animação suave com requestAnimationFrame
function animate() {
    // Interpolação suave (easing)
    currentX += (targetX - currentX) * 0.1;
    container.style.transform = `translate(${currentX}px)`;

    requestAnimationFrame(animate); //chama se a si propria-loop infinito
}

animate();

// Animação suave com requestAnimationFrame
function animate2() {
    // Interpolação suave (easing)
    currentX2 += (targetX2 - currentX2) * 0.1;
    container2.style.transform = `translate(${currentX2}px)`;
    buttons.style.transform = `translate(${currentX2}px)`;

    requestAnimationFrame(animate2); //chama se a si propria-loop infinito
}

animate2();

function animate_warning(){
    current_opacity += (target_ocpacity - current_opacity) * 0.09;
    warning.style.opacity = current_opacity;
    requestAnimationFrame(animate_warning); //chama se a si propria-loop infinito
}

animate_warning();