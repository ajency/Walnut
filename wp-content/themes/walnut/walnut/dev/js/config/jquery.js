var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  $(window).resize(adjustPageDim);
  $.toggleCheckAll = function(element, exclude) {
    var checkbox, checkboxes, _i, _len, _ref, _results;
    if (exclude == null) {
      exclude = [];
    }
    if (element.find('#check_all').is(':checked')) {
      checkboxes = element.find('.tab_checkbox');
      _results = [];
      for (_i = 0, _len = checkboxes.length; _i < _len; _i++) {
        checkbox = checkboxes[_i];
        if (_ref = parseInt(checkbox.value), __indexOf.call(exclude, _ref) < 0) {
          _results.push($(checkbox).trigger('click').prop('checked', true));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return element.find('.tab_checkbox').removeAttr('checked');
    }
  };
  $.getCheckedItems = function(element) {
    var items;
    items = _.chain(element.find('.tab_checkbox')).map(function(checkbox) {
      if ($(checkbox).is(':checked')) {
        return $(checkbox).val();
      }
    }).compact().value();
    return items;
  };
  return $.allowRoute = function(route) {
    var user;
    user = App.request("get:user:model");
    if (route === 'textbooks' || route === 'content-pieces' || route === 'add-module' || route === 'edit-module' || route === 'view-module' || route === 'module-list' || route === 'dummy-module' || route === 'view-quiz' || route === 'create-quiz' || route === 'edit-quiz' || route === 'quiz-list' || route === 'dummy-quiz' || route === 'quiz-report' || route === 'dashboard') {
      if (user.get('ID')) {
        return true;
      } else {
        App.navigate("login", true);
        return false;
      }
    } else {
      switch (route) {
        case 'login':
          if (!user.get('ID')) {
            return true;
          }
          break;
        case 'admin/view-all-modules':
          if (user.current_user_can('administrator') || user.current_user_can('school-admin')) {
            return true;
          }
      }
    }
  };
});
