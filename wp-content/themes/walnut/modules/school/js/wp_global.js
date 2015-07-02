jQuery(document).ready(function($) {
  var filters;
  console.log(ajaxurl);
  $('.image-upload').fileupload({
    url: ajaxurl + '?request="fileupload"',
    dataType: 'json',
    done: function(e, data) {
      var progress;
      $(this).closest('.row').find(".attachment_id").val(data.result.attachment_id);
      $(this).closest('.row').find(".attachment_url").val(data.result.attachment_url);
      $(this).closest('.row').find('.success_container').html('');
      if ((data.files[0].type === 'image/jpeg') || (data.files[0].type === 'image/png') || (data.files[0].type === 'image/gif')) {
        $(this).closest('.row').find('.success_container').append('<span><img id="attachment-id-' + data.result.attachment_id + '" src="' + data.result.attachment_url + '" width="150" height="100"   style="height:100px;"/>');
      } else {
        $(this).closest('.row').find('.success_container').append('<span>Invalid Image Type</span>');
      }
      progress = parseInt(data.loaded / data.total * 100, 10);
      $(this).closest('.row').find('.progress .bar').css('width', progress + '%');
      $(this).closest('.row').find('.progress').fadeOut('slow');
      return $(this).removeAttr("disabled");
    },
    start: function(e, data) {
      var progress;
      $(this).attr("disabled", "disabled");
      $(this).closest('.row').find('.progress').show();
      progress = parseInt(data.loaded / data.total * 100, 10);
      return $(this).closest('.row').find('.progress .bar').css('width', progress + '%');
    }
  });
  if ($('.date-field').length > 0) {
    $('.date-field').datepicker({
      dateFormat: 'dd-mm-yy'
    });
  }
  $('#parent').change(function() {
    if ($('#parent').val() === '-1') {
      return $('.textbook_fields').show();
    } else {
      return $('.textbook_fields').hide();
    }
  });
  if (window.location.href.substring('edit-tags.php?taxonomy=textbook')) {
    $('.search-form #tag-search-input').css('margin-left', '40px');
    filters = '<form method="get" style="float:left; margin-right:20px">';
    filters += '<input type="hidden" name="taxonomy" value="textbook">';
    filters += '<input type="hidden" name="post_type" value="content-piece">';
    filters += ' Textbook: <select class="tags_texbook_filters" id="tags_texbook_filter"></select>';
    filters += ' Chapter: <select class="tags_texbook_filters" id="tags_chapter_filter"><option  value="">--select--</option></select>';
    filters += ' Section: <select class="tags_texbook_filters" id="tags_section_filter"><option value="">--select--</option></select>';
    filters += '<input type="hidden" id="tags_filter_search_box" name="s" value="p=15">';
    filters += '<input type="submit" style="margin-left:10px" class="button" value="List Textbooks">';
    filters += '</form>';
    $('#tag-search-input').before(filters);
    $('#tag-search-input, #tags_filter_search_box').val('');
    $.get(ajaxurl + '?action=get-textbooks&fetch_all=true', function(resp) {
      var html, item, _i, _len, _ref;
      html = '<option value="">--select--</option>';
      _ref = resp.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        html += "<option value='" + item.term_id + "'>" + item.name + "</option>";
      }
      return $('#tags_texbook_filter').html(html);
    }).fail(function() {
      return console.log('error');
    });
  }
  return $('.tags_texbook_filters').change(function(e) {
    var fillElement, tID;
    if ($(e.target).val()) {
      $('#tags_filter_search_box').val('p=' + $(e.target).val());
    }
    if (e.target.id === 'tags_texbook_filter') {
      fillElement = '#tags_chapter_filter';
    } else if (e.target.id === 'tags_chapter_filter') {
      fillElement = '#tags_section_filter';
    }
    tID = $(e.target).val();
    return $.get(ajaxurl + '?action=get-textbooks&parent=' + tID, function(resp) {
      var html, item, _i, _len, _ref;
      html = '<option value="">--select--</option>';
      _ref = resp.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        html += "<option value='" + item.term_id + "'>" + item.name + "</option>";
      }
      return $(fillElement).html(html);
    }).fail(function() {
      return console.log('error');
    });
  });
});
