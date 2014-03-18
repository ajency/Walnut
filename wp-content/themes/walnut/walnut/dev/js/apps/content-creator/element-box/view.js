var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ElementBox.Views", function(Views, App) {
    var ElementView;
    ElementView = (function(_super) {
      __extends(ElementView, _super);

      function ElementView() {
        return ElementView.__super__.constructor.apply(this, arguments);
      }

      ElementView.prototype.tagName = 'li';

      ElementView.prototype.template = '<a href="#" class="drag builder-element" > <i class="fa fa-font"></i> <div class="aj-imp-builder-title"><%= element %></div> </a>';

      ElementView.prototype.onRender = function() {
        return this.$el.attr('data-element', this.model.get('element'));
      };

      return ElementView;

    })(Marionette.ItemView);
    return Views.ElementBoxView = (function(_super) {
      __extends(ElementBoxView, _super);

      function ElementBoxView() {
        return ElementBoxView.__super__.constructor.apply(this, arguments);
      }

      ElementBoxView.prototype.template = '<h4 class="text-white b-b b-grey p-b-10"> <span class="semi-bold">Tool</span>box </h4> <div class> <ul class="elements"> </ul> <div class="clearfix"></div> </div>';

      ElementBoxView.prototype.itemView = ElementView;

      ElementBoxView.prototype.itemViewContainer = 'ul.elements';

      ElementBoxView.prototype.onShow = function() {
        return this.$el.find('*[data-element]').draggable({
          connectToSortable: '.droppable-column',
          helper: 'clone',
          delay: 5,
          addClasses: false,
          distance: 5,
          revert: 'invalid'
        });
      };

      return ElementBoxView;

    })(Marionette.CompositeView);
  });
});