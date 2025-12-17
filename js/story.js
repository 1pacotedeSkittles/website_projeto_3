var $window = $(window);
var $imgA = $('.img-a');
var $imgB = $('.img-b');
var $textOverlays = $('.text-overlay'); 
var numPairs = $imgA.length; 

var $wrapper = $('#wrapper');

// CORREÇÃO: Usar as dimensões da janela (viewport) como referência para o centro
var viewport_height = $window.height();
var viewport_width = $window.width();

var segment_height = $window.height();

// Margem de segurança exterior para o texto
var TEXT_OUTER_MARGIN = 20; 
var TOP_ADDITIONAL_MARGIN = 10; 

// ... (mantenha as funções shuffleArray e getRandomPosition iguais, 
// apenas certifique-se que getRandomPosition usa viewport_width/height)

function getRandomPosition(text_width, text_height) {
    var exclusion_min_x = viewport_width * 0.25;
    var exclusion_max_x = viewport_width * 0.75;
    var exclusion_min_y = viewport_height * 0.25;
    var exclusion_max_y = viewport_height * 0.75;

    var new_top, new_left;
    var min_y = TEXT_OUTER_MARGIN + TOP_ADDITIONAL_MARGIN; 
    var max_y = viewport_height - text_height - TEXT_OUTER_MARGIN;
    var min_x = TEXT_OUTER_MARGIN;
    var max_x = viewport_width - text_width - TEXT_OUTER_MARGIN;
    
    if (max_y < min_y) max_y = min_y;
    if (max_x < min_x) max_x = min_x;

    for (var i = 0; i < 10; i++) {
        new_top = Math.random() * (max_y - min_y) + min_y;
        new_left = Math.random() * (max_x - min_x) + min_x;

        var is_safe = (
            (new_left + text_width < exclusion_min_x) || 
            (new_left > exclusion_max_x)               || 
            (new_top + text_height < exclusion_min_y)  || 
            (new_top > exclusion_max_y)
        );

        if (is_safe) return { top: new_top, left: new_left };
    }
    return { top: min_y, left: min_x }; 
}

// ... (mantenha setRandomImages igual)

var total_scroll_height = $(document).height() - $(window).height();
const final = document.getElementById('final_viewport');

$window.scroll(function() {
    var scroll_top = $window.scrollTop();

    if (scroll_top >= total_scroll_height * 0.7) {
        final.style.opacity = '1';
    } else {
        final.style.opacity = '0';
    }
    
    $imgA.each(function(index) {
        var $a = $(this);
        var $b = $imgB.eq(index);
        var $text = $textOverlays.eq(index); 
        
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
            
            if (normalized_scroll >= 0.4 && normalized_scroll <= 0.6) {
                if (!$text.hasClass('active')) {
                    var random_pos = getRandomPosition($text.outerWidth(), $text.outerHeight());
                    $text.css({ 'top': random_pos.top + 'px', 'left': random_pos.left + 'px' });
                }
                $text.addClass('active'); 
            } else {
                $text.removeClass('active'); 
            }
        } else {
            normalized_scroll = 1;
            $text.removeClass('active'); 
        }

        // --- CÁLCULO DAS POSIÇÕES CORRIGIDO ---
        var margin = 20; 
        
        // Posição Central baseada no Viewport (Janela)
        var center_y = (viewport_height / 2) - (a_height / 2); 
        var center_x = (viewport_width / 2) - (a_width / 2);

        // IMAGEM A (Superior Direita -> Inferior Esquerda)
        var a_top_end = viewport_height - margin;
        var a_left_end = -a_width + margin;
        var a_limit = Math.min(a_top_end - center_y, Math.abs(a_left_end - center_x));
        
        var a_top_range = 2 * a_limit; 
        var a_left_range = 2 * (-a_limit); 
        var a_top_start = center_y - a_limit;
        var a_left_start = center_x + a_limit; 

        // IMAGEM B (Inferior Esquerda -> Superior Direita)
        var b_bottom_end = viewport_height - margin;
        var b_right_end = -b_width + margin;   
        var b_limit = Math.min(b_bottom_end - center_y, Math.abs(b_right_end - center_x));

        var b_bottom_range = 2 * b_limit; 
        var b_right_range = 2 * (-b_limit); 
        var b_bottom_start = center_y - b_limit;
        var b_right_start = center_x + b_limit; 

        // Aplica o movimento
        $a.css({
            'top': a_top_start + (normalized_scroll * a_top_range),
            'left': a_left_start + (normalized_scroll * a_left_range)
        });
        
        $b.css({
            'bottom': b_bottom_start + (normalized_scroll * b_bottom_range),
            'right': b_right_start + (normalized_scroll * b_right_range)
        });

        if (scroll_top >= start_scroll && scroll_top < end_scroll) {
            $a.show(); $b.show();
        } else {
            $a.hide(); $b.hide();
        }
    });
});

setRandomImages();
$window.trigger('scroll');
