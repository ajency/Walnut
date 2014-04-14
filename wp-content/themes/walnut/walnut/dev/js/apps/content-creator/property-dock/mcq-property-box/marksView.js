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

      GridRow.prototype.template = '<div class="col-sm-4"><label>{{optionNo}}</label></div> <div class="col-sm-8"> <input type="text" value="{{marks}}" class="form-control"> </div>';

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

      MarksView.prototype.template = '<div class="row"> <div class="col-sm-4"><h5>Option</h5></div> <div class="col-sm-8"><h5>Marks</h5></div> </div> <div class="items"> </div>';

      MarksView.prototype.itemView = GridRow;

      MarksView.prototype.itemViewContainer = 'div.items';

      MarksView.prototype.onRender = function() {
        return console.log(this.collection);
      };

      return MarksView;

    })(Marionette.CompositeView);
  });
});
