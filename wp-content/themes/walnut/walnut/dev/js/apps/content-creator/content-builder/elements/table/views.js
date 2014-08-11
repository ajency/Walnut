var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'bootbox'], function(App, bootbox) {
  return App.module('ContentCreator.ContentBuilder.Element.Table.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.TableView = (function(_super) {
      __extends(TableView, _super);

      function TableView() {
        this.destroyEditor = __bind(this.destroyEditor, this);
        this.configureEditor = __bind(this.configureEditor, this);
        return TableView.__super__.constructor.apply(this, arguments);
      }

      TableView.prototype.className = 'imp-table';

      TableView.prototype.template = '<div class="table-settings-bar"> <div class="form-inline"> <div class="control-group"> <label for="spinner-01">Columns: </label> <div class="input-group spinner column-spinner"> <input type="text" class="form-control" value="{{column}}"> <div class="input-group-btn-vertical"> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-up"></i></button> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></button> </div> </div> </div> <div class="control-group"> <label for="spinner-02">Rows: </label> <div class="input-group spinner row-spinner"> <input type="text" class="form-control" value="{{row}}"> <div class="input-group-btn-vertical"> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-up"></i></button> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></button> </div> </div> </div> <div class="control-group check-props"> <label for="properties">Properties: </label> <div class="props"> <label class="checkbox" for="checkbox-bordered"> <input type="checkbox" value="" id="checkbox-bordered" data-toggle="checkbox"> Bordered </label> <label class="checkbox" for="checkbox-striped"> <input type="checkbox" value="" id="checkbox-striped" data-toggle="checkbox"> Striped </label> </div> </div> <div class="control-group styles"> <label for="style">Style: </label> <select id="table-style"> <option value="style-1">Style 1</option> <option value="style-2">Style 2</option> </select> </div> </div> </div> <div class="table-holder"></div>';

      TableView.prototype.ui = {
        editableData: 'table td ',
        editableHead: 'table th '
      };

      TableView.prototype.events = {
        'click @ui.editableData,@ui.editableHead': 'showEditor',
        'click .cke_editable': function(e) {
          return e.stopPropagation();
        },
        'click a': function(e) {
          return e.preventDefault();
        },
        'click .table-holder': 'destroyEditor',
        'click .spinner .btn:first-of-type': 'increaseCount',
        'click .spinner .btn:last-of-type': 'decreaseCount',
        'column:resize:stop.rc table': 'saveTableMarkup',
        'change #checkbox-bordered': 'changeBordered',
        'change #checkbox-striped': 'changeStriped',
        'change #table-style': 'changeStyle'
      };

      TableView.prototype.onShow = function() {
        this.$el.find('.table-holder').html(_.stripslashes(this.model.get('content')));
        if (this.$el.find('table').hasClass('table-bordered')) {
          this.$el.find('#checkbox-bordered').prop('checked', true);
        }
        if (this.$el.find('table').hasClass('table-striped')) {
          this.$el.find('#checkbox-striped').prop('checked', true);
        }
        this.$el.find('#table-style').val(this.model.get('style'));
        this.$el.find('table').resizableColumns();
        return this.$el.find('[data-toggle="checkbox"]').checkbox();
      };

      TableView.prototype.increaseCount = function(evt) {
        evt.stopPropagation();
        $(evt.target).closest('.spinner').find('input').val(parseInt($(evt.target).closest('.spinner').find('input').val(), 10) + 1);
        if ($(evt.target).closest('.spinner').hasClass('column-spinner')) {
          this.columnChanged(parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
        if ($(evt.target).closest('.spinner').hasClass('row-spinner')) {
          return this.rowChanged(parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
      };

      TableView.prototype.decreaseCount = function(evt) {
        evt.stopPropagation();
        $(evt.target).closest('.spinner').find('input').val(parseInt($(evt.target).closest('.spinner').find('input').val(), 10) - 1);
        if ($(evt.target).closest('.spinner').hasClass('column-spinner')) {
          this.columnChanged(parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
        if ($(evt.target).closest('.spinner').hasClass('row-spinner')) {
          return this.rowChanged(parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
      };

      TableView.prototype.rowChanged = function(row) {
        var html, index, _i, _ref;
        if (row > this.model.get('row')) {
          this.model.set('row', row);
          html = '<tr>';
          for (index = _i = 1, _ref = this.model.get('column'); 1 <= _ref ? _i <= _ref : _i >= _ref; index = 1 <= _ref ? ++_i : --_i) {
            html += '<td><div>demo</div></td>';
          }
          html += '</tr>';
          this.$el.find('tbody').append(html);
          return this.saveTableMarkup();
        } else {
          return bootbox.confirm('Removing a ROW might cause a loss of data. Do you want to continue?', (function(_this) {
            return function(result) {
              if (result) {
                _this.model.set('row', row);
                _this.$el.find('tbody tr:last-of-type').remove();
                return _this.saveTableMarkup();
              } else {
                return _this.$el.find('.row-spinner input').val(_this.model.get('row'));
              }
            };
          })(this));
        }
      };

      TableView.prototype.columnChanged = function(column) {
        var tableRows;
        if (column > this.model.get('column')) {
          this.model.set('column', column);
          this.$el.find('thead tr').append('<th><div>demo</div></th>');
          tableRows = this.$el.find('tbody tr');
          _.each(tableRows, function(row, index) {
            return $(row).append('<td><div>demo</div></td>');
          });
          this.$el.find('table').resizableColumns('destroy');
          this.$el.find('table').resizableColumns();
          return this.saveTableMarkup();
        } else {
          return bootbox.confirm('Removing a COLUMN might cause a loss of data. Do you want to continue?', (function(_this) {
            return function(result) {
              if (result) {
                _this.model.set('column', column);
                _this.$el.find('thead tr th:last-of-type').remove();
                tableRows = _this.$el.find('tbody tr td:last-of-type').remove();
                return _this.saveTableMarkup();
              } else {
                return _this.$el.find('.column-spinner input').val(_this.model.get('column'));
              }
            };
          })(this));
        }
      };

      TableView.prototype.showEditor = function(evt) {
        var id;
        evt.stopPropagation();
        if (this.editor) {
          this.editor.destroy();
          this.$el.find('td div, th div').removeAttr('contenteditable').removeAttr('style').removeAttr('id');
          this.saveTableMarkup();
        }
        console.log('showEditor');
        id = _.uniqueId('text-');
        $(evt.target).closest('td,th').find('div').attr('contenteditable', 'true').attr('id', id);
        CKEDITOR.on('instanceCreated', this.configureEditor);
        this.editor = CKEDITOR.inline(document.getElementById(id));
        return this.editor.config.placeholder = 'Click to enter text.';
      };

      TableView.prototype.configureEditor = function(event) {
        var editor, element;
        editor = event.editor;
        element = editor.element;
        if (element.getAttribute('id') === this.$el.attr('id')) {
          return editor.on('configLoaded', function() {
            return editor.config.placeholder = 'Enter Data';
          });
        }
      };

      TableView.prototype.destroyEditor = function(evt) {
        evt.stopPropagation();
        if (this.editor) {
          this.editor.destroy();
          this.editor = null;
          console.log('editor destroyed');
          this.$el.find('td div, th div').removeAttr('contenteditable').removeAttr('style').removeAttr('id');
          this.$el.find('table').resizableColumns('destroy');
          this.$el.find('table').resizableColumns();
          return this.saveTableMarkup();
        }
      };

      TableView.prototype.saveTableMarkup = function() {
        console.log('save table');
        return this.trigger('save:table', this.$el.find('.table-holder'));
      };

      TableView.prototype.changeBordered = function(e) {
        if ($(e.target).prop('checked')) {
          this.$el.find('table').addClass('table-bordered');
        } else {
          this.$el.find('table').removeClass('table-bordered');
        }
        return this.saveTableMarkup();
      };

      TableView.prototype.changeStriped = function(e) {
        if ($(e.target).prop('checked')) {
          this.$el.find('table').addClass('table-striped');
        } else {
          this.$el.find('table').removeClass('table-striped');
        }
        return this.saveTableMarkup();
      };

      TableView.prototype.changeStyle = function(e) {
        this.$el.find('table').removeClass('style-1 style-2').addClass(_.slugify($(e.target).val()));
        this.model.set('style', _.slugify($(e.target).val()));
        return this.saveTableMarkup();
      };

      return TableView;

    })(Marionette.ItemView);
  });
});
