
//LIMITS
const initial_opacity=1;
const final_opacity=0;

//WARNING
const warning = document.getElementById('warning');
let current_opacity= initial_opacity;
let target_ocpacity=initial_opacity;

// Evento de scroll com o wheel
window.addEventListener('wheel', (e) => {
    e.preventDefault(); //bloqueia o scroll normal da pagina
            
    const scrollAmount = e.deltaY;
    const newTarget_opacity= target_ocpacity - scrollAmount *0.7;

    //limite
    target_ocpacity=Math.min(Math.max(newTarget_opacity, -initial_opacity), final_opacity)
}, { passive: false }); //permite usar prevent default

function animate_warning(){
    current_opacity += (target_ocpacity - current_opacity) * 0.09;
    warning.style.opacity = current_opacity;
    requestAnimationFrame(animate_warning); //chama se a si propria-loop infinito
}

animate_warning();