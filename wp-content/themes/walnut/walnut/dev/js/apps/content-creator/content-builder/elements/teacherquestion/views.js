var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.TeacherQuestion.Views', function(Views, App, Backbone, Marionette, $, _) {
    var RowView;
    RowView = (function(_super) {
      __extends(RowView, _super);

      function RowView() {
        return RowView.__super__.constructor.apply(this, arguments);
      }

      RowView.prototype.className = 'teacher-question-row column';

      RowView.prototype.template = '<span></span>';

      RowView.prototype.onShow = function() {
        if (this.model.get('position') === 1) {
          this.$el.find('span').text('Question');
        } else {
          this.$el.find('span').text('Answer');
        }
        this.$el.attr('data-position', this.model.get('position'));
        return this.$el.sortable({
          revert: 'invalid',
          items: '> .element-wrapper',
          connectWith: '.droppable-column, .column',
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

      RowView.prototype.onClose = function() {
        if (this.$el.hasClass('ui-sortable')) {
          return this.$el.sortable('destroy');
        }
      };

      RowView.prototype.onAddDefaultTextElement = function() {
        return App.request("add:new:element", this.$el, 'Text');
      };

      return RowView;

    })(Marionette.ItemView);
    return Views.MainView = (function(_super) {
      __extends(MainView, _super);

      function MainView() {
        this._addTextForChild = __bind(this._addTextForChild, this);
        return MainView.__super__.constructor.apply(this, arguments);
      }

      MainView.prototype.className = 'teacher-question';

      MainView.prototype.template = '&nbsp;';

      MainView.prototype.itemView = RowView;

      MainView.prototype.initialize = function(opt) {
        var i, ro, row, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        if (opt == null) {
          opt = {};
        }
        this.model = opt.model;
        this.collection = new Backbone.Collection;
        if (opt.model.get('elements').length === 0) {
          _ref = [1, 2];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(this.collection.add({
              position: i,
              element: 'TeacherQuestRow',
              elements: []
            }));
          }
          return _results;
        } else {
          _ref1 = opt.model.get('elements');
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            row = _ref1[_j];
            ro = _.clone(row);
            delete ro.elements;
            _results1.push(this.collection.add(ro));
          }
          return _results1;
        }
      };

      MainView.prototype.onShow = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (this.model.get('elements').length === 0) {
          return this.collection.each(this._addTextForChild);
        }
      };

      MainView.prototype._addTextForChild = function(model) {
        var itemview;
        console.log(this.children.findByModel(model));
        itemview = this.children.findByModel(model);
        return itemview.triggerMethod("add:default:text:element");
      };

      return MainView;

    })(Marionette.CollectionView);
  });
});
