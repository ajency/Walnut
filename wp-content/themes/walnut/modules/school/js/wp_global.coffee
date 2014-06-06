jQuery(document).ready ($)-> 
    console.log ajaxurl
    $('.image-upload').fileupload 
        url: ajaxurl+'?request="fileupload"',
        dataType: 'json',
        done: (e, data)-> 
            $(@).closest '.row'
                .find ".attachment_id"
                .val data.result.attachment_id

            $(@).closest('.row').find(".attachment_url").val data.result.attachment_url;
            $(@).closest('.row').find('.success_container').html('');
            if((data.files[0].type=='image/jpeg')|| (data.files[0].type=='image/png') || (data.files[0].type=='image/gif'))
                $(@).closest('.row').find('.success_container').append('<span><img id="attachment-id-' + data.result.attachment_id + '" src="' + data.result.attachment_url + '" width="150" height="100"   style="height:100px;"/>')
            else
                $(@).closest('.row').find('.success_container').append('<span>Invalid Image Type</span>')
            progress = parseInt(data.loaded / data.total * 100, 10);
            $(@).closest('.row').find('.progress .bar').css 'width', progress + '%'

            $(@).closest('.row').find('.progress').fadeOut 'slow'
            $(@).removeAttr "disabled";
        ,
        start: (e, data) ->
            $(@).attr("disabled", "disabled");
            $(@).closest('.row').find('.progress').show();
            progress = parseInt(data.loaded / data.total * 100, 10);
            $(@).closest('.row').find('.progress .bar').css 'width', progress + '%'
            

    if($('.date-field').length>0)
        $('.date-field').datepicker 
            dateFormat : 'dd-mm-yy'
            
    $('#parent').change ->
        if($('#parent').val()=='-1')
            $('.textbook_fields').show();
        else
            $('.textbook_fields').hide();
            


