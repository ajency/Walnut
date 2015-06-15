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

      TableView.prototype.className = 'snp-table';

      TableView.prototype.template = '<div class="table-holder"></div>';

      TableView.prototype.ui = {
        editableData: 'table td ',
        editableHead: 'table th '
      };

      TableView.prototype.events = {
        'focus @ui.editableData,@ui.editableHead': 'showEditor',
        'focus .cke_editable': function(e) {
          return e.stopPropagation();
        },
        'click a': function(e) {
          return e.preventDefault();
        },
        'focus .table-holder': 'destroyEditor',
        'column:resize:stop.rc table': 'saveTableMarkup'
      };

      TableView.prototype.modelEvents = {
        'change:row': 'rowChanged',
        'change:column': 'columnChanged',
        'change:bordered': 'changeBordered',
        'change:striped': 'changeStriped',
        'change:style': 'changeStyle',
        'destroy': function() {
          return $('#myCanvas').unbind("click");
        }
      };

      TableView.prototype.onShow = function() {
        $('#myCanvas').bind("click", (function(_this) {
          return function(evt) {
            if (!$.contains($('#myCanvas')[0], evt.target)) {
              return _this.destroyEditor(evt);
            }
          };
        })(this));
        this.$el.find('.table-holder').html(_.stripslashes(this.model.get('content')));
        this.$el.find('.table-holder tr div').attr('tabindex', 0);
        return this.$el.find('table').resizableColumns();
      };

      TableView.prototype.rowChanged = function(model, rows) {
        var currentRows, html, index, _i, _ref, _results;
        currentRows = this.$el.find('tbody tr').length;
        if (currentRows === rows) {

        } else if (currentRows < rows) {
          _results = [];
          while (currentRows !== rows) {
            html = '<tr>';
            for (index = _i = 1, _ref = model.get('column'); 1 <= _ref ? _i <= _ref : _i >= _ref; index = 1 <= _ref ? ++_i : --_i) {
              html += '<td><div tabindex=0>demo</div></td>';
            }
            html += '</tr>';
            this.$el.find('tbody').append(html);
            this.saveTableMarkup();
            _results.push(currentRows++);
          }
          return _results;
        } else {
          return bootbox.confirm('Removing a ROW might cause a loss of data. Do you want to continue?', (function(_this) {
            return function(result) {
              var _results1;
              if (result) {
                _results1 = [];
                while (currentRows !== rows) {
                  _this.$el.find('tbody tr:last-of-type').remove();
                  _this.saveTableMarkup();
                  _results1.push(currentRows--);
                }
                return _results1;
              } else {
                return model.set('row', currentRows);
              }
            };
          })(this));
        }
      };

      TableView.prototype.columnChanged = function(model, columns) {
        var currentColumns, tableRows, _results;
        currentColumns = this.$el.find('thead th').length;
        if (currentColumns === columns) {

        } else if (currentColumns < columns) {
          _results = [];
          while (currentColumns !== columns) {
            this.$el.find('thead tr').append('<th><div tabindex=0>demo</div></th>');
            tableRows = this.$el.find('tbody tr');
            _.each(tableRows, function(row, index) {
              return $(row).append('<td><div tabindex=0>demo</div></td>');
            });
            this.$el.find('table').resizableColumns('destroy');
            this.$el.find('table').resizableColumns();
            console.log('in columns increase');
            this.saveTableMarkup();
            _results.push(currentColumns++);
          }
          return _results;
        } else {
          return bootbox.confirm('Removing a COLUMN might cause a loss of data. Do you want to continue?', (function(_this) {
            return function(result) {
              var _results1;
              if (result) {
                _results1 = [];
                while (currentColumns !== columns) {
                  _this.$el.find('thead tr th:last-of-type').remove();
                  tableRows = _this.$el.find('tbody tr td:last-of-type').remove();
                  _this.$el.find('table').resizableColumns('destroy');
                  _this.$el.find('table').resizableColumns();
                  _this.saveTableMarkup();
                  _results1.push(currentColumns--);
                }
                return _results1;
              } else {
                return model.set('column', currentColumns);
              }
            };
          })(this));
        }
      };

      TableView.prototype.showEditor = function(evt) {
        var id;
        evt.stopPropagation();
        this.trigger('show:table:property');
        if (this.editor) {
          this.editor.destroy();
          this.$el.find('td div, th div').removeAttr('contenteditable').removeAttr('style').removeAttr('id');
          this.saveTableMarkup();
        }
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
        console.log('destroy editor');
        evt.stopPropagation();
        this.trigger('show:table:property');
        if (this.editor && !($(evt.target).hasClass('cke_editable'))) {
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
        return this.trigger('save:table', this.$el.find('.table-holder'));
      };

      TableView.prototype.changeBordered = function(model, bordered) {
        if (bordered) {
          this.$el.find('table').addClass('table-bordered');
        } else {
          this.$el.find('table').removeClass('table-bordered');
        }
        return this.saveTableMarkup();
      };

      TableView.prototype.changeStriped = function(model, striped) {
        if (striped) {
          this.$el.find('table').addClass('table-striped');
        } else {
          this.$el.find('table').removeClass('table-striped');
        }
        return this.saveTableMarkup();
      };

      TableView.prototype.changeStyle = function(model, style) {
        this.$el.find('table').removeClass('style-1 style-2').addClass(style);
        return this.saveTableMarkup();
      };

      TableView.prototype.onSaveTableMarkup = function() {
        return this.saveTableMarkup();
      };

      return TableView;

    })(Marionette.ItemView);
  });
});
