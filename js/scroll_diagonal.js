var $window = $(window);
var $imgA = $('.img-a');
var $imgB = $('.img-b');
var $textOverlays = $('.text-overlay');
var numPairs = $imgA.length;

// REFERÊNCIA: Usar as dimensões da janela (viewport) para garantir o centro
var viewport_height = $window.height();
var viewport_width = $window.width();
var segment_height = $window.height();

// Margens de texto
var TEXT_OUTER_MARGIN = 20;
var TOP_ADDITIONAL_MARGIN = 10;

function getRandomPosition(text_width, text_height) {
    var min_y = TEXT_OUTER_MARGIN + TOP_ADDITIONAL_MARGIN;
    var max_y = viewport_height - text_height - TEXT_OUTER_MARGIN;
    var min_x = TEXT_OUTER_MARGIN;
    var max_x = viewport_width - text_width - TEXT_OUTER_MARGIN;

    // Zona de exclusão central (50%)
    var ex_min_x = viewport_width * 0.25;
    var ex_max_x = viewport_width * 0.75;
    var ex_min_y = viewport_height * 0.25;
    var ex_max_y = viewport_height * 0.75;

    for (var i = 0; i < 15; i++) {
        var top = Math.random() * (max_y - min_y) + min_y;
        var left = Math.random() * (max_x - min_x) + min_x;
        if (left + text_width < ex_min_x || left > ex_max_x || top + text_height < ex_min_y || top > ex_max_y) {
            return { top: top, left: left };
        }
    }
    return { top: min_y, left: min_x };
}

function setImages() {
    $imgA.each(function(i) {
        $(this).attr('src', 'images/' + (i * 2 + 1) + '.png');
        $imgB.eq(i).attr('src', 'images/' + (i * 2 + 2) + '.png');
    });
}

$window.scroll(function() {
    var scroll_top = $window.scrollTop();
    var $finalViewport = $('#final_viewport');

    // Ativa o final após todos os segmentos
    if (scroll_top >= (numPairs * viewport_height)) {
        $finalViewport.addClass('visible');
    } else {
        $finalViewport.removeClass('visible');
    }

    $imgA.each(function(index) {
        var $a = $(this);
        var $b = $imgB.eq(index);
        var $text = $textOverlays.eq(index);

        var start = index * segment_height;
        var end = start + segment_height;

        if (scroll_top >= start && scroll_top < end) {
            var norm = (scroll_top - start) / segment_height;

            // Texto Fade In/Out
            if (norm >= 0.4 && norm <= 0.6) {
                if (!$text.hasClass('active')) {
                    var pos = getRandomPosition($text.outerWidth(), $text.outerHeight());
                    $text.css({ 'top': pos.top + 'px', 'left': pos.left + 'px' });
                }
                $text.addClass('active');
            } else { $text.removeClass('active'); }

            // CÁLCULO DE MOVIMENTO CENTRADO
            var margin = 20;
            var center_y = (viewport_height / 2) - ($a.outerHeight() / 2);
            var center_x = (viewport_width / 2) - ($a.outerWidth() / 2);

            // Limite para manter 45 graus
            var limit = Math.min(viewport_height - margin - center_y, Math.abs(viewport_width - margin - center_x - $a.outerWidth()));

            var range_y = 2 * limit;
            var range_x = 2 * -limit;
            var start_y = center_y - limit;
            var start_x = center_x + limit;

            $a.css({
                'top': start_y + (norm * range_y),
                'left': start_x + (norm * range_x),
                'display': 'block'
            });

            $b.css({
                'bottom': start_y + (norm * range_y),
                'right': start_x + (norm * range_x),
                'display': 'block'
            });
        } else {
            $a.hide(); $b.hide(); $text.removeClass('active');
        }
    });
});

setImages();
$window.trigger('scroll');