var $window = $(window);
var $wrapper = $('#wrapper');
var $final = $('#final_viewport');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomPosition(text_width, text_height, vh, vw) {
    var margin = 40;
    var min_y = margin, max_y = vh - text_height - margin;
    var min_x = margin, max_x = vw - text_width - margin;
    var ex_min_x = vw * 0.25, ex_max_x = vw * 0.75;
    var ex_min_y = vh * 0.25, ex_max_y = vh * 0.75;

    for (var i = 0; i < 20; i++) {
        var top = Math.random() * (max_y - min_y) + min_y;
        var left = Math.random() * (max_x - min_x) + min_x;
        if (left + text_width < ex_min_x || left > ex_max_x || top + text_height < ex_min_y || top > ex_max_y) {
            return { top: top, left: left };
        }
    }
    return { top: min_y, left: min_x };
}

// 3. Carregar o JSON (Caminho relativo ao story.html)
fetch('js/images_data.json')
    .then(response => {
        if (!response.ok) throw new Error("Não foi possível carregar o ficheiro JSON.");
        return response.json();
    })
    .then(data => {
        // Filtra garantindo que o ID existe e é número
        let groupA = data.images.filter(img => img.id && img.id % 2 !== 0);
        let groupB = data.images.filter(img => img.id && img.id % 2 === 0);

        shuffle(groupA);
        shuffle(groupB);

        $wrapper.empty();

        // Usa o menor comprimento para não quebrar se os grupos forem desiguais
        let totalPairs = Math.min(groupA.length, groupB.length);

        for (let i = 0; i < totalPairs; i++) {
            let pairNum = i + 1;
            let html = `
                <div class="pair-section" style="height: 100vh; position: relative;">
                    <img class="img-a" src="${groupA[i].path}" alt="A${pairNum}" style="display:none; position:fixed;">
                    <img class="img-b" src="${groupB[i].path}" alt="B${pairNum}" style="display:none; position:fixed;">
                    <div class="text-overlay" style="position:fixed;">
                        <h2>PAR ${pairNum}</h2>
                        <p>${groupA[i].desc} <br><br> ${groupB[i].desc}</p>
                    </div>
                </div>
            `;
            $wrapper.append(html);
        }

        initScrollAnimation();
    })
    .catch(error => console.error("Erro na inicialização:", error));

function initScrollAnimation() {
    var $imgA = $('.img-a');
    var $imgB = $('.img-b');
    var $textOverlays = $('.text-overlay');

    $window.scroll(function() {
        var scroll_top = $window.scrollTop();
        var vh = $window.height();
        var vw = $window.width();
        var total_height = $(document).height() - vh;

        // Lógica do Final
        if (scroll_top >= total_height * 0.95) {
            $final.addClass('visible');
            $wrapper.css('opacity', '0');
        } else {
            $final.removeClass('visible');
            $wrapper.css('opacity', '1');
        }

        $imgA.each(function(index) {
            var $a = $(this);
            var $b = $imgB.eq(index);
            var $text = $textOverlays.eq(index);

            var start = index * vh;
            var end = start + vh;

            if (scroll_top >= start && scroll_top < end) {
                var norm = (scroll_top - start) / vh;

                if (norm >= 0.4 && norm <= 0.6) {
                    if (!$text.hasClass('active')) {
                        var pos = getRandomPosition($text.outerWidth(), $text.outerHeight(), vh, vw);
                        $text.css({ 'top': pos.top + 'px', 'left': pos.left + 'px' });
                    }
                    $text.addClass('active');
                } else {
                    $text.removeClass('active');
                }

                var margin = 20;
                var center_y = (vh / 2) - ($a.height() / 2);
                var center_x = (vw / 2) - ($a.width() / 2);
                var limit = Math.min(vh - margin - center_y, Math.abs(vw - margin - center_x - $a.width()));

                $a.css({
                    'top': (center_y - limit) + (norm * 2 * limit) + 'px',
                    'left': (center_x + limit) + (norm * 2 * -limit) + 'px',
                    'display': 'block'
                });

                $b.css({
                    'bottom': (center_y - limit) + (norm * 2 * limit) + 'px',
                    'right': (center_x + limit) + (norm * 2 * -limit) + 'px',
                    'display': 'block'
                });
            } else {
                $a.hide(); $b.hide(); $text.removeClass('active');
            }
        });
    });
}