var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.TeacherQuestion.Views', function(Views, App, Backbone, Marionette, $, _) {
    var RowView;
    RowView = (function(superClass) {
      extend(RowView, superClass);

      function RowView() {
        this._removeButtonAndShowAnswer = bind(this._removeButtonAndShowAnswer, this);
        return RowView.__super__.constructor.apply(this, arguments);
      }

      RowView.prototype.className = 'teacher-question-row column';

      RowView.prototype.template = '<span></span>';

      RowView.prototype.onShow = function() {
        if (parseInt(this.model.get('position')) === 1) {
          this.$el.find('span').text('Question');
        } else {
          this.$el.find('span').text('Answer');
          _.delay((function(_this) {
            return function() {
              _this.$el.hide();
              _this.$el.after('<div class="teacher-question-row column"><span>Answer</span><button type="button" id="show-answer" class="btn btn-default btn-sm btn-small">View Answer</button></div>');
              return _this.$el.next().find('button#show-answer').on('click', _this._removeButtonAndShowAnswer);
            };
          })(this), 0);
        }
        return this.$el.attr('data-position', this.model.get('position'));
      };

      RowView.prototype._removeButtonAndShowAnswer = function(evt) {
        $(evt.target).parent().hide();
        return this.$el.show();
      };

      RowView.prototype.onClose = function() {
        if (this.$el.hasClass('ui-sortable')) {
          return this.$el.sortable('destroy');
        }
      };

      return RowView;

    })(Marionette.ItemView);
    return Views.MainView = (function(superClass) {
      extend(MainView, superClass);

      function MainView() {
        return MainView.__super__.constructor.apply(this, arguments);
      }

      MainView.prototype.className = 'teacher-question';

      MainView.prototype.template = '&nbsp;';

      MainView.prototype.itemView = RowView;

      MainView.prototype.initialize = function(opt) {
        var i, len, ref, results, ro, row;
        if (opt == null) {
          opt = {};
        }
        this.model = opt.model;
        this.collection = new Backbone.Collection;
        ref = opt.model.get('elements');
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          row = ref[i];
          ro = _.clone(row);
          delete ro.elements;
          results.push(this.collection.add(ro));
        }
        return results;
      };

      return MainView;

    })(Marionette.CollectionView);
  });
});
