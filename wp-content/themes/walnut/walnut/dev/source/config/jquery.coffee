define ['jquery'], ($)->
	$(window).scroll ()->
		if ($(@).scrollTop() > 100) 
			$('.scrollup').fadeIn();
		else 
			$('.scrollup').fadeOut();