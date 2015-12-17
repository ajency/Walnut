var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.TeacherQuestion.Views', function(Views, App, Backbone, Marionette, $, _) {
    var RowView;
    RowView = (function(superClass) {
      extend(RowView, superClass);

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
    return Views.MainView = (function(superClass) {
      extend(MainView, superClass);

      function MainView() {
        this._addTextForChild = bind(this._addTextForChild, this);
        return MainView.__super__.constructor.apply(this, arguments);
      }

      MainView.prototype.className = 'teacher-question';

      MainView.prototype.template = '&nbsp;';

      MainView.prototype.itemView = RowView;

      MainView.prototype.initialize = function(opt) {
        var i, j, k, len, len1, ref, ref1, results, results1, ro, row;
        if (opt == null) {
          opt = {};
        }
        this.model = opt.model;
        this.collection = new Backbone.Collection;
        if (opt.model.get('elements').length === 0) {
          ref = [1, 2];
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            results.push(this.collection.add({
              position: i,
              element: 'TeacherQuestRow',
              elements: []
            }));
          }
          return results;
        } else {
          ref1 = opt.model.get('elements');
          results1 = [];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            row = ref1[k];
            ro = _.clone(row);
            delete ro.elements;
            results1.push(this.collection.add(ro));
          }
          return results1;
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
