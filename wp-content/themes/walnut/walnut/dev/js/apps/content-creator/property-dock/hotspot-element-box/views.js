var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.QuestionElementBox.Views", function(Views, App) {
    return Views.QuestionElementBoxView = (function(_super) {
      __extends(QuestionElementBoxView, _super);

      function QuestionElementBoxView() {
        return QuestionElementBoxView.__super__.constructor.apply(this, arguments);
      }

      QuestionElementBoxView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> Hotspot Properties </div> <div class="docket-body"> <ul> <li> <a href="#" class="drag builder-element"> <i class="fa fa-circle-o"></i> </a> </li> <li> <a href="#" class="drag builder-element"> <i class="fa fa-square-o"></i> </a> </li> <div class="clearfix"></div> </ul> </div> </div> </div>';

      return QuestionElementBoxView;

    })(Marionette.ItemView);
  });
});
