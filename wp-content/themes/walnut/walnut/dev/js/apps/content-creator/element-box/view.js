var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/element-box/templates/toolbox.html'], function(App, Template) {
  return App.module("ContentCreator.ElementBox.Views", function(Views, App) {
    return Views.ElementBoxView = (function(_super) {
      __extends(ElementBoxView, _super);

      function ElementBoxView() {
        return ElementBoxView.__super__.constructor.apply(this, arguments);
      }

      ElementBoxView.prototype.template = Template;

      ElementBoxView.prototype.onShow = function() {
        var contentType, elementSet;
        this.$el.find('*[data-element]').draggable({
          connectToSortable: '.droppable-column',
          helper: 'clone',
          delay: 5,
          addClasses: false,
          distance: 5,
          revert: 'invalid'
        });
        contentType = Marionette.getOption(this, 'contentType');
        if (contentType === 'teacher_question') {
          elementSet = ['Row', 'TeacherQuestion', 'Image', 'Text', 'ImageWithText', 'Video', 'Audio'];
        } else {
          elementSet = ['Row', 'Hotspot', 'Mcq', 'Fib', 'BigAnswer', 'Sort', 'Image', 'Text', 'ImageWithText', 'Video', 'Audio'];
        }
        return _.each(this.$el.find('li'), function(el, ind) {
          var elementName;
          elementName = $(el).attr('data-element');
          if (!_.contains(elementSet, elementName)) {
            return $(el).hide();
          }
        });
      };

      return ElementBoxView;

    })(Marionette.ItemView);
  });
});
