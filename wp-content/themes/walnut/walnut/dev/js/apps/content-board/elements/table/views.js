var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'bootbox'], function(App, bootbox) {
  return App.module('ContentPreview.ContentBoard.Element.Table.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.TableView = (function(superClass) {
      extend(TableView, superClass);

      function TableView() {
        return TableView.__super__.constructor.apply(this, arguments);
      }

      TableView.prototype.className = 'imp-table';

      TableView.prototype.template = '';

      TableView.prototype.onShow = function() {
        return this.$el.html(_.stripslashes(this.model.get('content')));
      };

      return TableView;

    })(Marionette.ItemView);
  });
});
