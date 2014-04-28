var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    var GridRow;
    GridRow = (function(_super) {
      __extends(GridRow, _super);

      function GridRow() {
        return GridRow.__super__.constructor.apply(this, arguments);
      }

      GridRow.prototype.className = 'row';

      GridRow.prototype.template = '<div class="col-sm-4"><label>{{optionNo}}</label></div> <div class="col-sm-8"> <input data-id="{{optionNo}}" type="text" value="{{marks}}" class="form-control"> </div>';

      GridRow.prototype.events = {
        'blur input': function(evt) {
          return this.model.set('marks', $(evt.target).val());
        }
      };

      return GridRow;

    })(Marionette.ItemView);
    return Views.MarksView = (function(_super) {
      __extends(MarksView, _super);

      function MarksView() {
        return MarksView.__super__.constructor.apply(this, arguments);
      }

      MarksView.prototype.template = '<div class="row"> <div class="col-sm-4"><div class="text-right">Option</div></div> <div class="col-sm-8"><div>Marks</div></div> </div> <div class="items"> </div>';

      MarksView.prototype.itemView = GridRow;

      MarksView.prototype.itemViewContainer = 'div.items';

      MarksView.prototype.initialize = function(options) {
        return this.mcqModel = options.mcq_model;
      };

      MarksView.prototype.onRender = function() {
        return console.log(this.collection);
      };

      MarksView.prototype.onShow = function() {
        _.each(this.mcqModel.get('correct_answer'), (function(_this) {
          return function(option) {
            return _this.$el.find('input[data-id="' + option + '"]').prop('disabled', false);
          };
        })(this));
        return _.each(_.difference(_.range(1, this.mcqModel.get('optioncount') + 1), this.mcqModel.get('correct_answer')), (function(_this) {
          return function(option) {
            return _this.$el.find('input[data-id="' + option + '"]').val(0).prop('disabled', true);
          };
        })(this));
      };

      return MarksView;

    })(Marionette.CompositeView);
  });
});
