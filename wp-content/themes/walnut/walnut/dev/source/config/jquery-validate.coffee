define ['jquery', 'jqueryvalidate'], ($)->

	$.validator.setDefaults
			errorElement: 'span'
			errorClass: 'error'
			focusInvalid: false
			ignore: []
			errorPlacement:  (error, element) -> # // render error placement for each input type
				icon = $(element).parent('.input-with-icon').children('i')
				parent = $(element).parent('.input-with-icon')
				icon.removeClass('icon-ok').addClass('icon-exclamation')  
				parent.removeClass('success-control').addClass('error-control')  
				#$('<span class="error"></span>').insertAfter(element).append(error)

			success: (label, element) ->
				icon = $(element).parent('.input-with-icon').children('i')
				parent = $(element).parent('.input-with-icon')
				icon.removeClass("icon-exclamation").addClass('icon-ok')
				parent.removeClass('error-control').addClass('success-control')
		   