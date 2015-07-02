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

    if (window.location.href).substring 'edit-tags.php?taxonomy=textbook'

        $('#col-container').prepend '<div style="float:right; width:430px">
                                    Advanced Search : p=English, n=Syllables<br>
                                    where p= Name or ID of parent and n= name of chapter or section</div>'

        filters = '<form method="get" style="float:right">';
        filters += '<input type="hidden" name="taxonomy" value="textbook">';
        filters += '<input type="hidden" name="post_type" value="content-piece">';
        filters += ' Textbook: <select class="tags_texbook_filters" id="tags_texbook_filter"></select>';
        filters += ' Chapter: <select class="tags_texbook_filters" id="tags_chapter_filter"><option  value="">--select--</option></select>';
        filters += ' Section: <select class="tags_texbook_filters" id="tags_section_filter"><option value="">--select--</option></select>';
        filters += '<input type="hidden" id="tags_filter_search_box" name="s" value="p=15">';
        filters += '<input type="submit" class="button" value="List Textbooks">';
        filters += '</form><br class="clear"><br>';

        $('.search-form').before(filters);
        $('#tags_filter_search_box').val ''
        $('#tag-search-input').css 'width', '300px'

        $.get ajaxurl + '?action=get-textbooks&fetch_all=true', ( resp )->
                html = '<option value="">--select--</option>'
                for item in resp.data
                    html += "<option value='#{item.term_id}'>#{item.name}</option>"
                $('#tags_texbook_filter').html(html);
        .fail ->
            console.log('error');

    $('.tags_texbook_filters').change (e)->

        if $(e.target).val()
            $('#tags_filter_search_box').val 'p='+$(e.target).val()

        if e.target.id is 'tags_texbook_filter'
            fillElement = '#tags_chapter_filter'
        else if e.target.id is 'tags_chapter_filter'
            fillElement = '#tags_section_filter'

        tID = $(e.target).val()

        $.get ajaxurl + '?action=get-textbooks&parent='+tID, ( resp )->
                html = '<option value="">--select--</option>'
                for item in resp.data
                    html += "<option value='#{item.term_id}'>#{item.name}</option>"
                $(fillElement).html(html);
        .fail ->
            console.log('error');
