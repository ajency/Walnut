define(['jquery', 'jqueryvalidate'], function($) {
  return $.validator.setDefaults({
    errorElement: 'span',
    errorClass: 'error',
    focusInvalid: false,
    ignore: [],
    errorPlacement: function(error, element) {
      var icon, parent;
      $(element).prev('.select2-container').find('.select2-choice').addClass('error');
      icon = $(element).parent('.input-with-icon').children('i');
      parent = $(element).parent('.input-with-icon');
      icon.removeClass('icon-ok').addClass('icon-exclamation');
      return parent.removeClass('success-control').addClass('error-control');
    },
    success: function(label, element) {
      var icon, parent;
      $(element).prev('.select2-container').find('.select2-choice').removeClass('error');
      icon = $(element).parent('.input-with-icon').children('i');
      parent = $(element).parent('.input-with-icon');
      icon.removeClass("icon-exclamation").addClass('icon-ok');
      return parent.removeClass('error-control').addClass('success-control');
    }
  });
});
