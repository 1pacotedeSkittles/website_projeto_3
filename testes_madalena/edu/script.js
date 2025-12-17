var $window = $(window);
var $imgA = $('.img-a');
var $imgB = $('.img-b');
var $textOverlays = $('.text-overlay'); 
var numPairs = $imgA.length; 

var $content = $('#content_story');
var content_height = $content.height();
var content_width = $content.width();

var segment_height = $window.height();

// Margem de segurança exterior para o texto
var TEXT_OUTER_MARGIN = 20; 
// Offset adicional para a margem superior
var TOP_ADDITIONAL_MARGIN = 10; 


// FUNÇÃO PARA BARALHAR UM ARRAY (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// FUNÇÃO PARA CALCULAR UMA POSIÇÃO ALEATÓRIA DENTRO DE ZONAS SEGURAS
function getRandomPosition(text_width, text_height) {
    // Definimos a zona de exclusão central (50% do ecrã)
    var exclusion_min_x = content_width * 0.25;
    var exclusion_max_x = content_width * 0.75;
    var exclusion_min_y = content_height * 0.25;
    var exclusion_max_y = content_height * 0.75;

    var new_top, new_left;
    
    // Coordenadas mínimas e máximas ajustadas para a margem de segurança exterior
    var min_y = TEXT_OUTER_MARGIN + TOP_ADDITIONAL_MARGIN; 
    var max_y = content_height - text_height - TEXT_OUTER_MARGIN;
    
    var min_x = TEXT_OUTER_MARGIN;
    var max_x = content_width - text_width - TEXT_OUTER_MARGIN;
    
    if (max_y < min_y) max_y = min_y;
    if (max_x < min_x) max_x = min_x;


    // Tentamos 10 vezes gerar uma posição segura
    for (var i = 0; i < 10; i++) {
        // Gera um ponto aleatório DENTRO DA ZONA SEGURA EXTERIOR
        new_top = Math.random() * (max_y - min_y) + min_y;
        new_left = Math.random() * (max_x - min_x) + min_x;

        // Condição para garantir que NENHUMA PARTE do texto intersecta a zona de exclusão central.
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

// --- FUNÇÃO PARA DEFINIR IMAGENS ALEATÓRIAS (AGORA SEM REPETIÇÃO) ---
function setRandomImages() {
    let odd_numbers = [];
    let even_numbers = [];
    const max_image_id = 42;

    // 1. Criar arrays de números ímpares (1 a 41) e pares (2 a 42)
    for (let i = 1; i <= max_image_id; i++) {
        if (i % 2 !== 0) {
            odd_numbers.push(i);
        } else {
            even_numbers.push(i);
        }
    }

    // 2. Baralhar as listas para garantir unicidade e aleatoriedade
    shuffleArray(odd_numbers);
    shuffleArray(even_numbers);

    $imgA.each(function(index) {
        var $a = $(this);
        var $b = $imgB.eq(index);
        
        // 3. Atribuir o número único na posição [index]
        // Se houver mais pares do que imagens, usará 'undefined', mas com 4 pares é seguro.
        var random_odd_num = odd_numbers[index];
        var random_even_num = even_numbers[index];
        
        // Imagem A (Ímpar)
        $a.attr('src', '../img/' + random_odd_num + '.png');
        //$a.attr('alt', 'Imagem ' + random_odd_num + ' (Esquerda - Ímpar)');
        
        // Imagem B (Par)
        $b.attr('src', '../img/' + random_even_num + '.png');
        //$b.attr('alt', 'Imagem ' + random_even_num + ' (Direita - Par)');
    });
}

//var total_scroll_height=numPairs*segment_height;
var total_scroll_height=$(document).height() - $(window).height();
//CONTAINER
const final = document.getElementById('final_viewport');

$window.scroll(function() {
    var scroll_top = $window.scrollTop();

     if (scroll_top >= total_scroll_height*0.85) {
        final.style.opacity= '1';

    } else{
        final.style.opacity= '0';
    }
    
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
        var center_y = (content_height / 2) - (a_height / 2); 
        var center_x = (content_width / 2) - (a_width / 2);

        // --- IMAGEM A ---
        var a_top_end = content_height - margin;
        var a_left_end = -a_width + margin;
        var a_range_exit_y = a_top_end - center_y;
        var a_range_exit_x = a_left_end - center_x;
        var a_limit = Math.min(a_range_exit_y, Math.abs(a_range_exit_x));
        var a_top_range = 2 * a_limit; 
        var a_left_range = 2 * (-a_limit); 
        var a_top_start = center_y - a_limit;
        var a_left_start = center_x + a_limit; 


        // --- IMAGEM B ---
        var b_bottom_end = content_height - margin;
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

// Define as imagens aleatórias no carregamento da página
setRandomImages();

// Executa o scroll uma vez ao carregar a página para definir as posições e visibilidade iniciais
$window.trigger('scroll');