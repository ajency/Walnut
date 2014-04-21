define(['jquery', 'underscore'], function($, _) {
  var adjustPageDim;
  $.fn.isEmptyColumn = function(params) {
    if (params == null) {
      params = {};
    }
    return this.children('.element-wrapper').length === 0;
  };
  $.fn.canBeDeleted = function() {
    var columns, empty;
    columns = this.children('.column');
    empty = true;
    _.each(columns, (function(_this) {
      return function(column, index) {
        if (!$(column).isEmptyColumn()) {
          return empty = false;
        }
      };
    })(this));
    return empty;
  };
  adjustPageDim = _.debounce(function() {
    var height, minHeight;
    height = $(window).height();
    minHeight = height - 40;
    $('.aj-upper-content').css('min-height', minHeight);
    return $('.aj-upper-content').children().css('min-height', minHeight);
  }, 30);
  $(document).ready(function() {
    return adjustPageDim();
  });
  $(window).resize(adjustPageDim);
  return $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      return $('.scrollup').fadeIn();
    } else {
      return $('.scrollup').fadeOut();
    }
  });
});
