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

      GridRow.prototype.tagName = 'tr';

      GridRow.prototype.template = '<td>{{optionNo}}</td> <td><input type="text" value="{{marks}}"></td>';

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

      MarksView.prototype.tagName = 'table';

      MarksView.prototype.template = '<thead> <tr> <th>Option</th> <th>Marks</th> </tr> </thead> <tbody> </tbody>';

      MarksView.prototype.itemView = GridRow;

      MarksView.prototype.itemViewContainer = 'tbody';

      MarksView.prototype.onRender = function() {
        return console.log(this.collection);
      };

      return MarksView;

    })(Marionette.CompositeView);
  });
});
