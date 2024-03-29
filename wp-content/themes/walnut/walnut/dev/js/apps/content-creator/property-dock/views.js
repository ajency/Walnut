var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.Views", function(Views, App) {
    return Views.Layout = (function(superClass) {
      extend(Layout, superClass);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = '<div class="tiles default"> <div class="tiles-head"> <h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4> </div> </div> <div id="question-elements-property" class="docket"></div> <div id="question-property" class="docket"></div> <div id="question-elements" class="docket"></div>';

      Layout.prototype.className = 'dock tiles';

      Layout.prototype.regions = {
        questElementPropRegion: '#question-elements-property',
        questPropertyRegion: '#question-property',
        questElementRegion: '#question-elements'
      };

      Layout.prototype.onShow = function() {
        this.$el.find('#question-property, #question-elements-property, #question-elements').on('click', function(evt) {
          return evt.stopPropagation();
        });
        return $('.content-creator-layout').on('click', (function(_this) {
          return function() {
            if (_this.questPropertyRegion != null) {
              _this.questPropertyRegion.close();
            }
            if (_this.questElementPropRegion != null) {
              _this.questElementPropRegion.close();
            }
            if (_this.questElementRegion != null) {
              return _this.questElementRegion.close();
            }
          };
        })(this));
      };

      return Layout;

    })(Marionette.Layout);
  });
});
