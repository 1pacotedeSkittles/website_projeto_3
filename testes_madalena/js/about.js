
//CONTAINER
const rect1 = document.getElementById('rect1');
const main = document.getElementById('main');
const bg_img = document.getElementById('bg_img');
const rect2 = document.getElementById('rect2');

//LIMITS
const initial_limit=0;
const final_limit= window.innerWidth;

//max
let currentX = initial_limit;
//min
let targetX = initial_limit;


// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    const scrollAmount = e.deltaY;
    const newTargetX= targetX - scrollAmount * 0.7; // novo destino X

    //limite
    targetX= Math.max(Math.min(newTargetX,initial_limit), final_limit)
}, { passive: false }); //permite usar prevent default
 

// Animação suave com requestAnimationFrame
function animate() {
    // Interpolação suave (easing)
    currentX += (targetX - currentX) * 0.1;

    rect1.style.transform = `translateX(${currentX}px, -84vw) rotate(-45deg)`;
    main.style.transform = `translateX(${currentX}px, 0) rotate(-45deg)`;
    bg_img.style.transform = `translateX(${currentX}px, -120vh) rotate(-45deg)`;
    rect2.style.transform = `translateX(${currentX}px, -84vw) rotate(-45deg)`;

    requestAnimationFrame(animate); //chama se a si propria-loop infinito
}

animate();