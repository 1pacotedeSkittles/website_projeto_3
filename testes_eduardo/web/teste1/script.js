var $window = $(window);
var $imgA = $('.img-a');
var $imgB = $('.img-b');
var numPairs = $imgA.length; 

var $wrapper = $('#wrapper');
var wrapper_height = $wrapper.height();
var wrapper_width = $wrapper.width();

var segment_height = $window.height();

$window.scroll(function() {
    var scroll_top = $window.scrollTop();
    
    $imgA.each(function(index) {
        var $a = $(this);
        var $b = $imgB.eq(index);

        // Captura as dimensões de cada imagem
        var a_height = $a.outerHeight(); 
        var a_width = $a.outerWidth();
        var b_height = $b.outerHeight();
        var b_width = $b.outerWidth();

        // Define o segmento de scroll onde a transição deste par acontece
        var start_scroll = index * segment_height;
        var end_scroll = start_scroll + segment_height;
        
        var normalized_scroll = 0;
        
        if (scroll_top < start_scroll) {
            normalized_scroll = 0;
        } else if (scroll_top >= start_scroll && scroll_top < end_scroll) {
            var segment_scroll = scroll_top - start_scroll;
            normalized_scroll = segment_scroll / segment_height;
        } else {
            normalized_scroll = 1;
        }

        // --- CALCULO DAS POSIÇÕES PARA MOVIMENTO CONTÍNUO ---

        var margin = 20; // 20 pixels de margem

        // 1. Posições de Início (Scroll = 0 no segmento): FORA DA VISTA, mas perto
        var a_top_start = -a_height + margin;
        var a_left_start = -a_width + margin;
        var b_bottom_start = -b_height + margin;
        var b_right_start = -b_width + margin;

        // 2. Posições Finais (Scroll = 1 no segmento): FORA DA VISTA NO LADO OPOSTO, mas perto
        var a_top_end = wrapper_height - margin;
        var a_left_end = wrapper_width - margin;
        var b_bottom_end = wrapper_height - margin;
        var b_right_end = wrapper_width - margin;   

        // 3. Intervalo de Movimento (Range = End_Pos - Start_Pos)
        var a_top_range = a_top_end - a_top_start;
        var a_left_range = a_left_end - a_left_start;
        var b_bottom_range = b_bottom_end - b_bottom_start;
        var b_right_range = b_right_end - b_right_start;


        // Aplica o movimento LERP
        $a.css({
            'top': a_top_start + (normalized_scroll * a_top_range),
            'left': a_left_start + (normalized_scroll * a_left_range)
        });
        
        $b.css({
            'bottom': b_bottom_start + (normalized_scroll * b_bottom_range),
            'right': b_right_start + (normalized_scroll * b_right_range)
        });

        // Controla a visibilidade: mostra apenas o par ativo
        if (scroll_top >= start_scroll && scroll_top < end_scroll) {
            // CORREÇÃO: Força o display: block para garantir a visibilidade
            $a.css('display', 'block'); 
            $b.css('display', 'block');
        } else {
            $a.hide();
            $b.hide();
        }
    });
});

// Executa o scroll uma vez ao carregar a página para definir as posições e visibilidade iniciais
$window.trigger('scroll');