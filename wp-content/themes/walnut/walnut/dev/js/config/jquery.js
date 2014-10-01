define(['jquery', 'underscore'], function($, _) {
  var adjustPageDim;
  $(document).on("click", '.grid .tools .collapse, .grid .tools .expand, .grid-body-toggle', function(e) {
    var el, icon;
    el = $(e.target).parents(".grid").children(".grid-body");
    el.slideToggle(200);
    icon = $(e.target).parents(".grid").find(".tools a");
    if ($(icon).hasClass("collapse")) {
      return $(icon).removeClass("collapse").addClass("expand");
    } else {
      return $(icon).removeClass("expand").addClass("collapse");
    }
  });
  $(document).on("click", '.goto-prev-page', function() {
    return window.history.back();
  });
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
  $.showHeaderAndLeftNav = function() {
    if (_.isEmpty(App.headerRegion.$el)) {
      App.execute("show:headerapp", {
        region: App.headerRegion
      });
    }
    if (_.isEmpty(App.leftNavRegion.$el)) {
      App.execute("show:leftnavapp", {
        region: App.leftNavRegion
      });
    }
    return $('.page-content').removeClass('expand-page');
  };
  $.fn.removeAllAttr = function() {
    var attrs;
    attrs = ['class', 'tabindex', 'contenteditable', 'id', 'spellcheck', 'role', 'aria-label', 'title', 'aria-describedby', 'style'];
    return _.each(this, function(div) {
      return _.each(attrs, function(attr) {
        return $(div).removeAttr(attr);
      });
    });
  };
  $.fn.center = function(parent) {
    if (parent) {
      parent = this.parent();
    } else {
      parent = window;
    }
    this.css({
      position: "fixed",
      top: (($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px",
      left: (($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px"
    });
    $(window).on('scroll', (function(_this) {
      return function() {
        return _this.css({
          top: (($(parent).height() - _this.outerHeight()) / 2) + $(parent).scrollTop() + "px"
        });
      };
    })(this));
    return this;
  };
  $.timeMinSecs = function(timeInSeconds) {
    var display_time, hours, mins, seconds, time;
    hours = 0;
    time = timeInSeconds;
    mins = parseInt(timeInSeconds / 60);
    if (mins > 59) {
      hours = parseInt(mins / 60);
      mins = parseInt(mins % 60);
    }
    seconds = parseInt(time % 60);
    display_time = '';
    if (hours > 0) {
      display_time = hours + 'h ';
    }
    return display_time += mins + 'm ' + seconds + 's';
  };
  $(document).on("keyup", ".autogrow", (function(_this) {
    return function(e) {
      var ele;
      ele = $(e.target);
      if ($(ele).prop('clientHeight') < $(ele).prop('scrollHeight')) {
        $(ele).css({
          'height': $(ele).prop('scrollHeight') + "px"
        });
      }
      if ($(ele).prop('clientHeight') < $(ele).prop('scrollHeight')) {
        return $(ele).css({
          'height': ($(ele).prop('scrollHeight') * 2 - $(ele).prop('clientHeight')) + "px"
        });
      }
    };
  })(this));
  $.fn.selectSelectableElements = function(elementsToSelect) {
    $(".ui-selected", this).not(elementsToSelect).removeClass("ui-selected");
    return $(elementsToSelect).not(".ui-selected").addClass("ui-selected");
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
  return $(window).resize(adjustPageDim);
});
