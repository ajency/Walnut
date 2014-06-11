$(document).ready(function() {		
		//$('#left-panel').addClass('animated bounceInRight');
		$('#project-progress').css('width', '50%');
		$('#msgs-badge').addClass('animated bounceIn');	
		
		$('#my-task-list').popover({
			html:true			
		})
		
	 $('.toggle').hide('fast');
    $('.togglelink').on('click', function (e) {
        e.preventDefault();
        var elem = $(this).next('.toggle')
        $('.toggle').not(elem).hide('fast');
        elem.toggle('fast');
    });
});

