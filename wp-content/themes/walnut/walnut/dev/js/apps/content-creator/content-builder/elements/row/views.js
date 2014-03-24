var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Row.Views', function(Views, App, Backbone, Marionette, $, _) {
    var ColumnView;
    ColumnView = (function(_super) {
      __extends(ColumnView, _super);

      function ColumnView() {
        return ColumnView.__super__.constructor.apply(this, arguments);
      }

      ColumnView.prototype.className = 'column empty-column';

      ColumnView.prototype.tagName = 'div';

      ColumnView.prototype.template = '';

      ColumnView.prototype.onShow = function() {
        this.$el.attr('data-position', this.model.get('position'));
        this.$el.addClass("col-md-" + (this.model.get('className'))).attr('data-class', this.model.get('className'));
        return this.$el.sortable({
          revert: 'invalid',
          items: '> .element-wrapper',
          connectWith: '.droppable-column,.column',
          handle: '.aj-imp-drag-handle',
          start: function(e, ui) {
            ui.placeholder.height(ui.item.height());
            window.dragging = true;
          },
          stop: function(e, ui) {
            window.dragging = false;
          },
          helper: 'clone',
          opacity: .65,
          remove: function(evt, ui) {
            if ($(evt.target).children().length === 0) {
              return $(evt.target).addClass('empty-column');
            }
          },
          update: function(e, ui) {
            return $(e.target).removeClass('empty-column');
          }
        });
      };

      ColumnView.prototype.onClose = function() {
        if (this.$el.hasClass('ui-sortable')) {
          return this.$el.sortable('destroy');
        }
      };

      return ColumnView;

    })(Marionette.ItemView);
    return Views.RowView = (function(_super) {
      __extends(RowView, _super);

      function RowView() {
        this.adjustColumnsInRow = __bind(this.adjustColumnsInRow, this);
        return RowView.__super__.constructor.apply(this, arguments);
      }

      RowView.prototype.className = 'row';

      RowView.prototype.template = '&nbsp;';

      RowView.prototype.itemView = ColumnView;

      RowView.prototype.initialize = function(opt) {
        var col, column, i, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        if (opt == null) {
          opt = {};
        }
        this.collection = new Backbone.Collection;
        if (opt.model.get('elements').length === 0) {
          _ref = [1, 2];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(this.collection.add({
              position: i,
              element: 'Column',
              className: 6,
              elements: []
            }));
          }
          return _results;
        } else {
          _ref1 = opt.model.get('elements');
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            column = _ref1[_j];
            col = _.clone(column);
            delete col.elements;
            _results1.push(this.collection.add(col));
          }
          return _results1;
        }
      };

      RowView.prototype.onShow = function() {
        this.$el.attr('id', _.uniqueId('row-'));
        return _.delay((function(_this) {
          return function() {
            return _this.setColumnResizer();
          };
        })(this), 400);
      };

      RowView.prototype.onStyleChanged = function(newStyle, old) {
        if (!_(old).isEmpty()) {
          this.$el.removeClass(old);
        }
        this.$el.addClass(newStyle);
        return this.setColumnResizer();
      };

      RowView.prototype.onColumnCountChanged = function(columnCount) {
        return this.adjustColumnsInRow(columnCount);
      };

      RowView.prototype.columnCount = function() {
        return this.$el.children('.column').length;
      };

      RowView.prototype.getColumns = function() {
        return this.$el.children('.column');
      };

      RowView.prototype.getResizers = function() {
        return this.$el.closest('.element-wrapper').find('.element-controls > .aj-imp-col-divider');
      };

      RowView.prototype.getColumnAt = function(index) {
        var columns;
        columns = this.$el.children('.column');
        return columns[index];
      };

      RowView.prototype.clearResizers = function() {
        var resizer, _i, _len, _ref, _results;
        _ref = this.getResizers();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resizer = _ref[_i];
          if ($(resizer).hasClass('ui-draggable')) {
            $(resizer).draggable('destroy');
            _results.push($(resizer).remove());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      RowView.prototype.destroySortableColumns = function() {
        return this.$el.children('.column').sortable('destroy');
      };

      RowView.prototype.onClose = function() {
        this.clearResizers();
        return this.destroySortableColumns();
      };

      RowView.prototype.setColumnResizer = function() {
        var numberOfResizers, template;
        this.clearResizers();
        if (this.columnCount() === 1) {
          return;
        }
        template = '<div class="aj-imp-col-divider"> <p title="Move"> <span class="fa fa-ellipsis-h"></span> </p> </div>';
        numberOfResizers = this.columnCount() - 1;
        return _.each(_.range(numberOfResizers), (function(_this) {
          return function(ele, index) {
            var column, left, resizer;
            column = _this.getColumnAt(index + 1);
            left = $(column).position().left;
            resizer = $(template);
            resizer.attr('data-position', index + 1);
            resizer.css('left', left);
            _this.$el.closest('.element-wrapper').children('.element-controls').append(resizer);
            return _this.makeResizer(resizer);
          };
        })(this));
      };

      RowView.prototype.makeResizer = function(resizer) {
        var row, snap;
        row = resizer.parent();
        snap = row.width();
        snap = snap / 12;
        return resizer.draggable({
          axis: "x",
          containment: row,
          grid: [snap, 0],
          start: (function(_this) {
            return function(event, ui) {
              if (_.isUndefined(ui.helper.start)) {
                return ui.helper.start = ui.originalPosition;
              }
            };
          })(this),
          stop: (function(_this) {
            return function(event, ui) {
              return ui.helper.start = ui.position;
            };
          })(this),
          drag: (function(_this) {
            return function(event, ui) {
              var p, position, s;
              p = Math.round(ui.position.left);
              s = Math.round(ui.helper.start.left);
              if (p > s) {
                ui.helper.start = ui.position;
                position = $(event.target).attr("data-position");
                return _this.resizeColumns("right", parseInt(position));
              } else if (p < s) {
                ui.helper.start = ui.position;
                position = $(event.target).attr("data-position");
                return _this.resizeColumns("left", parseInt(position));
              }
            };
          })(this)
        });
      };

      RowView.prototype.resizeColumns = function(direction, position) {
        var columns, currentClassOne, currentClassZero;
        columns = [];
        columns.push(this.getColumnAt(position - 1));
        columns.push(this.getColumnAt(position));
        currentClassZero = parseInt($(columns[0]).attr('data-class'));
        currentClassOne = parseInt($(columns[1]).attr('data-class'));
        if (currentClassZero - 1 === 0 || currentClassOne - 1 === 0) {
          return;
        }
        $(columns[0]).removeClass("col-md-" + currentClassZero);
        $(columns[1]).removeClass("col-md-" + currentClassOne);
        switch (direction) {
          case "right":
            currentClassZero++;
            currentClassOne--;
            break;
          case "left":
            currentClassZero--;
            currentClassOne++;
        }
        $(columns[0]).attr('data-class', currentClassZero).addClass("col-md-" + currentClassZero);
        return $(columns[1]).attr('data-class', currentClassOne).addClass("col-md-" + currentClassOne);
      };

      RowView.prototype.addNewColumn = function(colClass, position) {
        return this.collection.add({
          position: position,
          element: 'Column',
          className: parseInt(colClass),
          elements: []
        });
      };

      RowView.prototype.removeColumn = function($column) {
        var column, _position;
        _position = parseInt($column.attr('data-position'));
        column = this.collection.findWhere({
          position: _position
        });
        return this.collection.remove(column);
      };

      RowView.prototype.adjustColumnsInRow = function(count) {
        var colClass, cols, colsToRemove, emptyColsLen, emptyColumns, extraColumns, i, nCols, requestedColumns, _i, _len, _ref;
        requestedColumns = count;
        if (requestedColumns === this.columnCount()) {
          return;
        }
        colClass = 12 / requestedColumns;
        if (requestedColumns > this.columnCount()) {
          extraColumns = requestedColumns - this.columnCount();
          _.each(this.getColumns(), (function(_this) {
            return function(column, index) {
              var currentClass;
              currentClass = $(column).attr('data-class');
              return $(column).removeClass("col-md-" + currentClass).addClass("col-md-" + colClass).attr('data-class', colClass);
            };
          })(this));
          count = this.columnCount();
          _ref = _.range(extraColumns);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            this.addNewColumn(colClass, count + i + 1);
          }
        } else if (requestedColumns < this.columnCount()) {
          emptyColumns = [];
          _.each(this.getColumns(), function(column, index) {
            if ($(column).isEmptyColumn()) {
              return emptyColumns.push($(column));
            }
          });
          emptyColsLen = emptyColumns.length;
          if (emptyColsLen === 0) {
            alert("None of the columns are empty. Please delete elements inside columns to remove");
            return;
          }
          if (this.columnCount() - requestedColumns > emptyColsLen) {
            alert("Unable to perform this action");
            return;
          }
          colsToRemove = 0;
          if (this.columnCount() - requestedColumns <= emptyColsLen) {
            colsToRemove = this.columnCount() - requestedColumns;
          } else {
            colsToRemove = emptyColsLen - requestedColumns;
          }
          nCols = [];
          cols = this.getColumns().toArray().reverse();
          _.each(cols, (function(_this) {
            return function(column, index) {
              if (colsToRemove === 0 || !$(column).isEmptyColumn()) {
                return;
              }
              _this.removeColumn($(column));
              return colsToRemove--;
            };
          })(this));
          _.each(this.getColumns(), function(column, index) {
            var currentClass;
            currentClass = $(column).attr('data-class');
            return $(column).removeClass("col-md-" + currentClass).addClass("col-md-" + colClass).attr('data-class', colClass);
          });
        }
        return this.setColumnResizer();
      };

      return RowView;

    })(Marionette.CollectionView);
  });
});