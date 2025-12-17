var $window = $(window);
var $imgA = $('.img-a');
var $imgB = $('.img-b');
var $textOverlays = $('.text-overlay'); 
var numPairs = $imgA.length; 

var $wrapper = $('#wrapper');
var wrapper_height = $wrapper.height();
var wrapper_width = $wrapper.width();

var segment_height = $window.height();

// Margem de segurança exterior para o texto
var TEXT_OUTER_MARGIN = 20; 

//parar o scroll
//var scrollLocked=false;
//var scrollLock_position=0;


// FUNÇÃO PARA CALCULAR UMA POSIÇÃO ALEATÓRIA DENTRO DE ZONAS SEGURAS
function getRandomPosition(text_width, text_height) {
    // Definimos a zona de exclusão central (50% do ecrã)
    var exclusion_min_x = wrapper_width * 0.25;
    var exclusion_max_x = wrapper_width * 0.75;
    var exclusion_min_y = wrapper_height * 0.25;
    var exclusion_max_y = wrapper_height * 0.75;

    var new_top, new_left;
    
    // Coordenadas máximas ajustadas para a margem de segurança exterior
    var max_y = wrapper_height - text_height - TEXT_OUTER_MARGIN;
    var min_y = TEXT_OUTER_MARGIN;

    var max_x = wrapper_width - text_width - TEXT_OUTER_MARGIN;
    var min_x = TEXT_OUTER_MARGIN;
    
    if (max_y < min_y) max_y = min_y;
    if (max_x < min_x) max_x = min_x;


    // Tentamos 10 vezes gerar uma posição segura
    for (var i = 0; i < 10; i++) {
        // Gera um ponto aleatório DENTRO DA ZONA SEGURA EXTERIOR
        new_top = Math.random() * (max_y - min_y) + min_y;
        new_left = Math.random() * (max_x - min_x) + min_x;

        // NOVO: Condição para garantir que NENHUMA PARTE do texto intersecta a zona de exclusão central.
        // O texto é seguro se estiver inteiramente à esquerda, à direita, acima ou abaixo da zona central.
        var is_safe = (
            (new_left + text_width < exclusion_min_x) || // Inteiramente à esquerda
            (new_left > exclusion_max_x)               || // Inteiramente à direita
            (new_top + text_height < exclusion_min_y)  || // Inteiramente acima
            (new_top > exclusion_max_y)                   // Inteiramente abaixo
        );

        if (is_safe) {
            // Posição segura encontrada
            return { top: new_top, left: new_left };
        }
    }
    
    // Fallback: retorna uma posição fixa segura (canto superior esquerdo)
    return { top: min_y, left: min_x }; 
}

//var total_scroll_height=numPairs*segment_height;
var total_scroll_height=$(document).height() - $(window).height();

//CONTAINER
const final = document.getElementById('final');
const wrapper = document.getElementById('wrapper');

$window.scroll(function() {
   /* var scroll_top = $window.scrollTop();

    if (scroll_top == total_scroll_height) {
        console.log('MOSTRANDO FINAL');
        final.style.visibility= 'visible';
        final.style.opacity= '1';
        wrapper.style.opacity= '0';
        //scrollLocked=true;
        //scrollLock_position=scroll_top;
        //window.scrollTo(0, total_scroll_height*0.95);

    } else{
        console.log('MOSTRANDO WRAPPER');
        final.style.visibility= 'hidden';        
        wrapper.style.opacity= '1';
        final.style.opacity= '0';
    }

    if(scrollLocked){
        window.scrollTo(0, total_scroll_height*0.95);
        return;
    }*/

    $imgA.each(function(index) {
        var $a = $(this);
        var $b = $imgB.eq(index);
        
        var $text = $textOverlays.eq(index); 
        var text_width = $text.outerWidth();
        var text_height = $text.outerHeight();

        var a_height = $a.outerHeight(); 
        var a_width = $a.outerWidth();
        var b_height = $b.outerHeight();
        var b_width = $b.outerWidth();

        var start_scroll = index * segment_height;
        var end_scroll = start_scroll + segment_height;
        
        var normalized_scroll = 0;
        
        if (scroll_top < start_scroll) {
            normalized_scroll = 0;
            $text.removeClass('active');
        } else if (scroll_top >= start_scroll && scroll_top < end_scroll) {
            var segment_scroll = scroll_top - start_scroll;
            normalized_scroll = segment_scroll / segment_height;
            
            // Verifica se o par ativo está próximo do centro (entre 40% e 60% do scroll)
            if (normalized_scroll >= 0.4 && normalized_scroll <= 0.6) {
                
                // APLICA POSIÇÃO ALEATÓRIA UMA VEZ AO ENTRAR NA ZONA
                if (!$text.hasClass('active')) {
                    var random_pos = getRandomPosition(text_width, text_height);
                    $text.css({
                        'top': random_pos.top + 'px',
                        'left': random_pos.left + 'px'
                    });
                }
                
                // FADE IN (via CSS Transition): Adiciona a classe
                $text.addClass('active'); 
            } else {
                // FADE OUT (via CSS Transition): Remove a classe
                $text.removeClass('active'); 
            }

        } else {
            normalized_scroll = 1;
            $text.removeClass('active'); 
        }

        // --- CÁLCULO DAS POSIÇÕES PARA MOVIMENTO CONTÍNUO (45º E CENTRADO) ---

        var margin = 20; // 20 pixels de margem
        
        // 1. Posição Central (Onde a imagem deve estar em normalized_scroll = 0.5)
        var center_y = (wrapper_height / 2) - (a_height / 2); 
        var center_x = (wrapper_width / 2) - (a_width / 2);

        // --- IMAGEM A ---
        var a_top_end = wrapper_height - margin;
        var a_left_end = -a_width + margin;
        var a_range_exit_y = a_top_end - center_y;
        var a_range_exit_x = a_left_end - center_x;
        var a_limit = Math.min(a_range_exit_y, Math.abs(a_range_exit_x));
        var a_top_range = 2 * a_limit; 
        var a_left_range = 2 * (-a_limit); 
        var a_top_start = center_y - a_limit;
        var a_left_start = center_x - (-a_limit); 


        // --- IMAGEM B ---
        var b_bottom_end = wrapper_height - margin;
        var b_right_end = -b_width + margin;   
        var b_range_exit_y = b_bottom_end - (center_y);
        var b_range_exit_x = b_right_end - (center_x); 
        var b_limit = Math.min(b_range_exit_y, Math.abs(b_range_exit_x));
        var b_bottom_range = 2 * b_limit; 
        var b_right_range = 2 * (-b_limit); 
        var b_bottom_start = center_y - b_limit;
        var b_right_start = center_x - (-b_limit); 


        // Aplica o movimento LERP
        $a.css({
            'top': a_top_start + (normalized_scroll * a_top_range),
            'left': a_left_start + (normalized_scroll * a_left_range)
        });
        
        $b.css({
            'bottom': b_bottom_start + (normalized_scroll * b_bottom_range),
            'right': b_right_start + (normalized_scroll * b_right_range)
        });

        // Controla a visibilidade da IMAGEM
        if (scroll_top >= start_scroll && scroll_top < end_scroll) {
            $a.css('display', 'block'); 
            $b.css('display', 'block');
        } else {
            $a.hide();
            $b.hide();
        }
    });
});

//SCRIPT ABOUT MODIFIED
/*window.addEventListener('wheel', (e) => {
    if(scrollLocked){
        e.preventDefault();
    }
}, { passive: false }); //permite usar prevent default*/