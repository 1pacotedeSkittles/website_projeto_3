$(window).scroll(function() {
    var windowScrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();

    $('.scroll-placeholder').each(function() {
        var $placeholder = $(this);
        var $section = $placeholder.find('.diagonal-reveal');
        
        var $imageLeft = $section.find('.image-left-container');
        var $imageRight = $section.find('.image-right-container');
        var $textContent = $section.find('.text-content');
        
        var placeholderTop = $placeholder.offset().top; 
        var placeholderHeight = $placeholder.outerHeight();
        
        // --- CÁLCULO DE PROGRESSO GERAL (0 a 1) ---
        var effectStart = placeholderTop; 
        var totalEffectDuration = placeholderHeight; 
        
        var distanceScrolled = windowScrollTop - effectStart;
        
        var progress = distanceScrolled / totalEffectDuration;
        progress = Math.min(1, Math.max(0, progress));

        
        // --- 1. MOVIMENTO VERTICAL (100% -> -150%) ---
        var totalVerticalMovement = 250; 
        var verticalTranslate = 100 - (progress * totalVerticalMovement); 


        // --- 2. MOVIMENTO HORIZONTAL CONTÍNUO ---
        var p = progress;

        
        // --- IMAGEM DA ESQUERDA (CORRIGIDA) ---
        // Trajetória: Começa em 100% (fora direita) e move para -100% (fora esquerda)
        // Isto faz com que a imagem comece na direita (ancoragem 50%) e atravesse o centro.
        var leftStart = 100;
        var leftEnd = -100; 
        var leftMovementRange = leftEnd - leftStart; // -200
        var leftTranslateX = leftStart + (p * leftMovementRange);

        // --- IMAGEM DA DIREITA (Mantida) ---
        // Trajetória: Começa em 100% e move para -200% (saída rápida para a esquerda)
        var rightStart = 100;
        var rightEnd = -200; 
        var rightMovementRange = rightEnd - rightStart; // -300
        var rightTranslateX = rightStart + (p * rightMovementRange);

        
        // --- 3. APLICAÇÃO DA TRANSFORMAÇÃO COMBINADA ---
        
        // A Imagem da Esquerda tem de ter um movimento oposto (negativo) no início,
        // mas a lógica acima usa valores de 100 a -100. Vamos manter a lógica anterior,
        // mas com valores que garantam a convergência e saída.
        
        // CORREÇÃO: Usamos o X da Esquerda com sinal negativo para que comece fora da esquerda.
        $imageLeft.css({
            'transform': 'translateX(' + (-leftTranslateX) + '%) translateY(' + verticalTranslate + '%) translateZ(0)'
        });

        $imageRight.css({
            'transform': 'translateX(' + rightTranslateX + '%) translateY(' + verticalTranslate + '%) translateZ(0)'
        });
        
        // --- 4. REVELAÇÃO DO TEXTO ---
        var revealStart = 0.4; // O texto começa a aparecer quando a rolagem atinge 40% do placeholder
        var revealEnd = 0.7;   // O texto desaparece quando a rolagem atinge 70% do placeholder
        
        // Usamos uma lógica mais simples de ligar/desligar:
        if (progress >= revealStart && progress <= revealEnd) {
            $textContent.addClass('revealed');
        } else {
            $textContent.removeClass('revealed');
        }
    });
});

$(window).scroll();