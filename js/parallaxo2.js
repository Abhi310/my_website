jQuery(document).ready(function($){
	var hijacking= $('body').data('hijacking'),
		animationType = $('body').data('animation'),
		delta = 0,
        scrollThreshold = 5,
        actual = 1,
        animating = false;

    var sectionsAvailable = $('.v_layer'),
    	verticalNav = $('.cd-vertical-nav'),
    	prevArrow = verticalNav.find('a.cd-prev'),
    	nextArrow = verticalNav.find('a.cd-next');

	var MQ = deviceType(),
		bindToggle = false;
	
	bindEvents(MQ, true);
	
	$(window).on('resize', function(){
		MQ = deviceType();
		bindEvents(MQ, bindToggle);
		if( MQ == 'desktop' ) bindToggle = false;
	});

    function bindEvents(MQ, bool) {
    	
    	if( MQ == 'desktop' && bool) {   		
			if( hijacking == 'on' ) {
				initHijacking();
				$(window).on('DOMMouseScroll mousewheel', scrollHijacking);
			} else {
				scrollAnimation();
				$(window).on('scroll', scrollAnimation);
			}
		} 
    }

	function scrollAnimation(){
		(!window.requestAnimationFrame) ? animateSection() : window.requestAnimationFrame(animateSection);
	}

	function animateSection() {
		var scrollTop = $(window).scrollTop(),
			windowHeight = $(window).height(),
			windowWidth = $(window).width();
		
		sectionsAvailable.each(function(){
			var actualBlock = $(this),
				offset = scrollTop - actualBlock.offset().top;

			var animationValues = setSectionAnimation(offset, windowHeight, animationType);
			
			transformSection(actualBlock.children('div'), animationValues[0], animationValues[1], animationValues[2], animationValues[3], animationValues[4]);
			( offset >= 0 && offset < windowHeight ) ? actualBlock.addClass('visible') : actualBlock.removeClass('visible');		
		});
	}

	function transformSection(element, translateY, scaleValue, rotateXValue, opacityValue, boxShadow) {
		element.velocity({
			translateY: translateY+'vh',
			scale: scaleValue,
			rotateX: rotateXValue,
			opacity: opacityValue,
			boxShadowBlur: boxShadow+'px',
			translateZ: 0,
		}, 0);
	}

	function initHijacking() {
		var visibleSection = sectionsAvailable.filter('.visible'),
			topSection = visibleSection.prevAll('.v_layer'),
			bottomSection = visibleSection.nextAll('.v_layer'),
			animationParams = selectAnimation(animationType, false),
			animationVisible = animationParams[0],
			animationTop = animationParams[1],
			animationBottom = animationParams[2];

		visibleSection.children('div').velocity(animationVisible, 1, function(){
			visibleSection.css('opacity', 1);
	    	topSection.css('opacity', 1);
	    	bottomSection.css('opacity', 1);
		});
        topSection.children('div').velocity(animationTop, 0);
        bottomSection.children('div').velocity(animationBottom, 0);
	}

	function scrollHijacking (event) {
        if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) { 
            delta--;
            ( Math.abs(delta) >= scrollThreshold) && prevSection();
        } else {
            delta++;
            (delta >= scrollThreshold) && nextSection();
        }
        return false;
    }

    function prevSection(event) {
    	typeof event !== 'undefined' && event.preventDefault();
    	
    	var visibleSection = sectionsAvailable.filter('.visible'),
    		middleScroll = ( hijacking == 'off' && $(window).scrollTop() != visibleSection.offset().top) ? true : false;
    	visibleSection = middleScroll ? visibleSection.next('.v_layer') : visibleSection;

    	var animationParams = selectAnimation(animationType, middleScroll, 'prev');
    	unbindScroll(visibleSection.prev('.v_layer'), animationParams[3]);

        if( !animating && !visibleSection.is(":first-child") ) {
        	animating = true;
            visibleSection.removeClass('visible').children('div').velocity(animationParams[2], animationParams[3], animationParams[4])
            .end().prev('.v_layer').addClass('visible').children('div').velocity(animationParams[0] , animationParams[3], animationParams[4], function(){
            	animating = false;
            	if( hijacking == 'off') $(window).on('scroll', scrollAnimation);
            });
            
            actual = actual - 1;
        }

        resetScroll();
    }

    function nextSection(event) {
    	typeof event !== 'undefined' && event.preventDefault();

        var visibleSection = sectionsAvailable.filter('.visible'),
    		middleScroll = ( hijacking == 'off' && $(window).scrollTop() != visibleSection.offset().top) ? true : false;

    	var animationParams = selectAnimation(animationType, middleScroll, 'next');
    	unbindScroll(visibleSection.next('.v_layer'), animationParams[3]);

        if(!animating && !visibleSection.is(":last-of-type") ) {
            animating = true;
            visibleSection.removeClass('visible').children('div').velocity(animationParams[1], animationParams[3], animationParams[4] )
            .end().next('.v_layer').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function(){
            	animating = false;
            	if( hijacking == 'off') $(window).on('scroll', scrollAnimation);
            });

            actual = actual +1;
        }
        resetScroll();
    }

    function unbindScroll(section, time) {
    	if( hijacking == 'off') {
    		$(window).off('scroll', scrollAnimation);
    		( animationType == 'catch') ? $('body, html').scrollTop(section.offset().top) : section.velocity("scroll", { duration: time });
    	}
    }

    function resetScroll() {
        delta = 0;
    }
	

	function deviceType() {
		return window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}

	function selectAnimation(animationName, middleScroll, direction) {
		var animationVisible = 'translateNone',
			animationTop = 'translateUp',
			animationBottom = 'translateDown',
			easing = 'ease',
			animDuration = 800;

		switch(animationName) {
		    case 'scaleDown':
		    	animationTop = 'scaleDown';
		    	easing = 'easeInCubic';
		        break;
		    case 'rotate':
		    	if( hijacking == 'off') {
		    		animationTop = 'rotation.scroll';
		    		animationBottom = 'translateNone';
		    	} else {
		    		animationTop = 'rotation';
		    		easing = 'easeInCubic';
		    	}
		        break;
		    case 'gallery':
		    	animDuration = 1500;
		    	if( middleScroll ) {
		    		animationTop = 'scaleDown.moveUp.scroll';
		    		animationVisible = 'scaleUp.moveUp.scroll';
		    		animationBottom = 'scaleDown.moveDown.scroll';
		    	} else {
		    		animationVisible = (direction == 'next') ? 'scaleUp.moveUp' : 'scaleUp.moveDown';
					animationTop = 'scaleDown.moveUp';
					animationBottom = 'scaleDown.moveDown';
		    	}
		        break;
		    case 'opacity':
		    	animDuration = 700;
				animationTop = 'hide.scaleUp';
				animationBottom = 'hide.scaleDown';
		        break;
		    case 'fixed':
		    	animationTop = 'translateNone';
		    	easing = 'easeInCubic';
		        break;
		    case 'parallax':
		    	animationTop = 'translateUp.half';
		    	easing = 'easeInCubic';
		        break;
		}

		return [animationVisible, animationTop, animationBottom, animDuration, easing];
	}

	function setSectionAnimation(sectionOffset, windowHeight, animationName ) {
		var scale = 1,
			translateY = 100,
			rotateX = '0deg',
			opacity = 1,
			boxShadowBlur = 0;
		
		if( sectionOffset >= -windowHeight && sectionOffset <= 0 ) {
			translateY = (-sectionOffset)*100/windowHeight;
			
			switch(animationName) {
			    case 'scaleDown':
			        scale = 1;
					opacity = 1;
					break;
				case 'rotate':
					translateY = 0;
					break;
				case 'gallery':
			        if( sectionOffset>= -windowHeight &&  sectionOffset< -0.9*windowHeight ) {
			        	scale = -sectionOffset/windowHeight;
			        	translateY = (-sectionOffset)*100/windowHeight;
			        	boxShadowBlur = 400*(1+sectionOffset/windowHeight);
			        } else if( sectionOffset>= -0.9*windowHeight &&  sectionOffset< -0.1*windowHeight) {
			        	scale = 0.9;
			        	translateY = -(9/8)*(sectionOffset+0.1*windowHeight)*100/windowHeight;
			        	boxShadowBlur = 40;
			        } else {
			        	scale = 1 + sectionOffset/windowHeight;
			        	translateY = 0;
			        	boxShadowBlur = -400*sectionOffset/windowHeight;
			        }
					break;
				case 'opacity':
					translateY = 0;
			        scale = (sectionOffset + 5*windowHeight)*0.2/windowHeight;
			        opacity = (sectionOffset + windowHeight)/windowHeight;
					break;
			}

		} else if( sectionOffset > 0 && sectionOffset <= windowHeight ) {
			translateY = (-sectionOffset)*100/windowHeight;
			
			switch(animationName) {
			    case 'scaleDown':
			        scale = (1 - ( sectionOffset * 0.3/windowHeight)).toFixed(5);
					opacity = ( 1 - ( sectionOffset/windowHeight) ).toFixed(5);
					translateY = 0;
					boxShadowBlur = 40*(sectionOffset/windowHeight);

					break;
				case 'rotate':
					opacity = ( 1 - ( sectionOffset/windowHeight) ).toFixed(5);
					rotateX = sectionOffset*90/windowHeight + 'deg';
					translateY = 0;
					break;
				case 'gallery':
			        if( sectionOffset >= 0 && sectionOffset < 0.1*windowHeight ) {
			        	scale = (windowHeight - sectionOffset)/windowHeight;
			        	translateY = - (sectionOffset/windowHeight)*100;
			        	boxShadowBlur = 400*sectionOffset/windowHeight;
			        } else if( sectionOffset >= 0.1*windowHeight && sectionOffset < 0.9*windowHeight ) {
			        	scale = 0.9;
			        	translateY = -(9/8)*(sectionOffset - 0.1*windowHeight/9)*100/windowHeight;
			        	boxShadowBlur = 40;
			        } else {
			        	scale = sectionOffset/windowHeight;
			        	translateY = -100;
			        	boxShadowBlur = 400*(1-sectionOffset/windowHeight);
			        }
					break;
				case 'opacity':
					translateY = 0;
			        scale = (sectionOffset + 5*windowHeight)*0.2/windowHeight;
			        opacity = ( windowHeight - sectionOffset )/windowHeight;
					break;
				case 'fixed':
					translateY = 0;
					break;
				case 'parallax':
					translateY = (-sectionOffset)*50/windowHeight;
					break;

			}

		} else if( sectionOffset < -windowHeight ) {
			translateY = 100;

			switch(animationName) {
			    case 'scaleDown':
			        scale = 1;
					opacity = 1;
					break;
				case 'gallery':
			        scale = 1;
					break;
				case 'opacity':
					translateY = 0;
			        scale = 0.8;
			        opacity = 0;
					break;
			}

		} else {
			translateY = -100;

			switch(animationName) {
			    case 'scaleDown':
			        scale = 0;
					opacity = 0.7;
					translateY = 0;
					break;
				case 'rotate':
					translateY = 0;
			        rotateX = '90deg';
			        break;
			    case 'gallery':
			        scale = 1;
					break;
				case 'opacity':
					translateY = 0;
			        scale = 1.2;
			        opacity = 0;
					break;
				case 'fixed':
					translateY = 0;
					break;
				case 'parallax':
					translateY = -50;
					break;
			}
		}

		return [translateY, scale, rotateX, opacity, boxShadowBlur]; 
	}
});
