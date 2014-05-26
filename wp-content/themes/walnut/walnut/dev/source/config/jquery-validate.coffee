define ['jquery', 'jqueryvalidate'], ($)->
    $.validator.setDefaults
        errorElement: 'span'
        errorClass: 'error'
        focusInvalid: false
        ignore: []
        errorPlacement: (error, element) -> # // render error placement for each input type

            #Handling error classes for select2 dropdowns
            $(element).prev '.select2-container'
            .find '.select2-choice'
            .addClass 'error'

            icon = $(element).parent('.input-with-icon').children('i')
            parent = $(element).parent('.input-with-icon')
            icon.removeClass('icon-ok').addClass('icon-exclamation')
            parent.removeClass('success-control').addClass('error-control')
    #$('<span class="error"></span>').insertAfter(element).append(error)

        success: (label, element) ->

            #Handling error classes for select2 dropdowns
            $(element).prev '.select2-container'
            .find '.select2-choice'
            .removeClass 'error'

            icon = $(element).parent('.input-with-icon').children('i')
            parent = $(element).parent('.input-with-icon')
            icon.removeClass("icon-exclamation").addClass('icon-ok')
            parent.removeClass('error-control').addClass('success-control')
		   