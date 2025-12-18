var $window = $(window);
var $wrapper = $('#wrapper');

var total_scroll_height = $(document).height() - $(window).height();
const final = document.getElementById('final_viewport');

// 1. Função para baralhar arrays (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 2. Função para obter posição aleatória do texto (evitando o centro)
function getRandomPosition(text_width, text_height, vh, vw) {
    var margin = 40;
    var min_y = margin;
    var max_y = vh - text_height - margin;
    var min_x = margin;
    var max_x = vw - text_width - margin;

    var ex_min_x = vw * 0.25;
    var ex_max_x = vw * 0.75;
    var ex_min_y = vh * 0.25;
    var ex_max_y = vh * 0.75;

    for (var i = 0; i < 20; i++) {
        var top = Math.random() * (max_y - min_y) + min_y;
        var left = Math.random() * (max_x - min_x) + min_x;
        if (left + text_width < ex_min_x || left > ex_max_x || top + text_height < ex_min_y || top > ex_max_y) {
            return { top: top, left: left };
        }
    }
    return { top: min_y, left: min_x };
}

// 3. Carregar o JSON e Inicializar tudo
fetch('js/images_data.json')
    .then(response => {
        if (!response.ok) throw new Error("Erro ao carregar o JSON");
        return response.json();
    })
    .then(data => {
        // Filtrar imagens ímpares (Grupo A) e pares (Grupo B)
        let groupA = data.images.filter(img => img.id % 2 !== 0);
        let groupB = data.images.filter(img => img.id % 2 === 0);

        // Baralhar os grupos
        shuffle(groupA);
        shuffle(groupB);

        // Limpar o wrapper antes de inserir (caso existam elementos estáticos no HTML)
        $wrapper.find('img, .text-overlay').remove();

        // Gerar o HTML dinamicamente
        for (let i = 0; i < groupA.length; i++) {
            let pairNum = i + 1;
            let html = `
                <img class="img-a" src="${groupA[i].path}" alt="A${pairNum}">
                <img class="img-b" src="${groupB[i].path}" alt="B${pairNum}">
                <div class="text-overlay">
                    <h2>PAR ${pairNum}</h2>
                    <p>${groupA[i].desc} + ${groupB[i].desc}</p>
                </div>
            `;
            $wrapper.append(html);
        }

        // Iniciar a lógica de scroll após a criação dos elementos
        initScrollAnimation(groupA.length);
    })
    .catch(error => console.error("Erro:", error));

// 4. Lógica de Animação de Scroll
function initScrollAnimation(numPairs) {
    var $imgA = $('.img-a');
    var $imgB = $('.img-b');
    var $textOverlays = $('.text-overlay');

    $window.scroll(function() {
        var scroll_top = $window.scrollTop();
        var vh = $window.height();
        var vw = $window.width();
        var segment_height = vh;

        if (scroll_top >= total_scroll_height * 0.60) {
            final.style.opacity = '1';
        } else {
            final.style.opacity = '0';
        }

        $imgA.each(function(index) {
            var $a = $(this);
            var $b = $imgB.eq(index);
            var $text = $textOverlays.eq(index);

            var start = index * segment_height;
            var end = start + segment_height;

            if (scroll_top >= start && scroll_top < end) {
                var norm = (scroll_top - start) / segment_height;

                // Ativação do Texto
                if (norm >= 0.4 && norm <= 0.6) {
                    if (!$text.hasClass('active')) {
                        var pos = getRandomPosition($text.outerWidth(), $text.outerHeight(), vh, vw);
                        $text.css({ 'top': pos.top + 'px', 'left': pos.left + 'px' });
                    }
                    $text.addClass('active');
                } else {
                    $text.removeClass('active');
                }

                // Cálculo do Movimento Diagonal Centrado
                var margin = 20;
                var center_y = (vh / 2) - ($a.outerHeight() / 2);
                var center_x = (vw / 2) - ($a.outerWidth() / 2);

                var limit = Math.min(vh - margin - center_y, Math.abs(vw - margin - center_x - $a.outerWidth()));
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

    $window.trigger('scroll');
}