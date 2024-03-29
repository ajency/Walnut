var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Views", function(Views, App) {
    return Views.ContentBuilderView = (function(superClass) {
      extend(ContentBuilderView, superClass);

      function ContentBuilderView() {
        return ContentBuilderView.__super__.constructor.apply(this, arguments);
      }

      ContentBuilderView.prototype.template = '<div id="myCanvas" class="droppable-column" height="300"></div>';

      ContentBuilderView.prototype.onRender = function() {
        return this.$el.attr('id', 'site-page-content-region');
      };

      ContentBuilderView.prototype.onShow = function() {
        console.log('sortable');
        return this.$el.find('.droppable-column').sortable({
          revert: 'invalid',
          items: '> .element-wrapper',
          connectWith: '.droppable-column,.column',
          start: function(e, ui) {
            console.log('moving');
            ui.placeholder.height(ui.item.height());
            window.dragging = true;
          },
          stop: function(e, ui) {
            window.dragging = false;
          },
          handle: '.aj-imp-drag-handle',
          helper: 'clone',
          opacity: .65,
          receive: (function(_this) {
            return function(evt, ui) {
              var type;
              if (ui.item.prop("tagName") === 'LI') {
                type = ui.item.attr('data-element');
                return _this.trigger("add:new:element", $(evt.target), type);
              }
            };
          })(this)
        });
      };

      return ContentBuilderView;

    })(Marionette.ItemView);
  });
});
