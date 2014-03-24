var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.Views", function(Views, App) {
    return Views.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = '<div class="builder_actions"> <button type="button" class="btn btn-success btn-cons2" id="save-question"> <i class="fa fa-check"></i> Save</button> <button type="button" class="btn btn-success btn-cons2"> <i class="fa fa-eye"></i> Preview</button> </div> <div class="tiles green"> <div class="tiles-head"> <h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4> </div> </div> <div id="question-property" class="docket"></div> <div id="question-elements" class="docket"></div>';

      Layout.prototype.events = {
        'click  #save-question': 'saveQuestion'
      };

      Layout.prototype.saveQuestion = function() {
        return App.execute("save:question");
      };

      Layout.prototype.regions = {
        questPropertyRegion: '#question-property',
        questElementRegion: '#question-elements'
      };

      return Layout;

    })(Marionette.Layout);
  });
});
