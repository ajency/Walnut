var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Row.Views', function(Views, App, Backbone, Marionette, $, _) {
    var ColumnView;
    ColumnView = (function(superClass) {
      extend(ColumnView, superClass);

      function ColumnView() {
        return ColumnView.__super__.constructor.apply(this, arguments);
      }

      ColumnView.prototype.className = 'column empty-column';

      ColumnView.prototype.tagName = 'div';

      ColumnView.prototype.template = '';

      ColumnView.prototype.onShow = function() {
        this.$el.attr('data-position', this.model.get('position'));
        return this.$el.addClass("col-md-" + (this.model.get('className'))).attr('data-class', this.model.get('className'));
      };

      ColumnView.prototype.onClose = function() {
        if (this.$el.hasClass('ui-sortable')) {
          return this.$el.sortable('destroy');
        }
      };

      return ColumnView;

    })(Marionette.ItemView);
    return Views.RowView = (function(superClass) {
      extend(RowView, superClass);

      function RowView() {
        return RowView.__super__.constructor.apply(this, arguments);
      }

      RowView.prototype.className = 'row';

      RowView.prototype.template = '&nbsp;';

      RowView.prototype.itemView = ColumnView;

      RowView.prototype.initialize = function(opt) {
        var col, column, i, len, ref, results;
        if (opt == null) {
          opt = {};
        }
        this.collection = new Backbone.Collection;
        ref = opt.model.get('elements');
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          column = ref[i];
          col = _.clone(column);
          delete col.elements;
          results.push(this.collection.add(col));
        }
        return results;
      };

      RowView.prototype.onShow = function() {
        return this.$el.attr('id', _.uniqueId('row-'));
      };

      RowView.prototype.columnCount = function() {
        return this.$el.children('.column').length;
      };

      RowView.prototype.getColumns = function() {
        return this.$el.children('.column');
      };

      RowView.prototype.getColumnAt = function(index) {
        var columns;
        columns = this.$el.children('.column');
        return columns[index];
      };

      RowView.prototype.destroySortableColumns = function() {
        return this.$el.children('.column').sortable('destroy');
      };

      RowView.prototype.onClose = function() {
        return this.destroySortableColumns();
      };

      RowView.prototype.addNewColumn = function(colClass, position) {
        return this.collection.add({
          position: position,
          element: 'Column',
          className: parseInt(colClass),
          elements: []
        });
      };

      return RowView;

    })(Marionette.CollectionView);
  });
});
