define(['jquery'], function($) {
  return $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      return $('.scrollup').fadeIn();
    } else {
      return $('.scrollup').fadeOut();
    }
  });
});
