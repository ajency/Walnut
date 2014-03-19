var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/element-box/elementboxapp', 'apps/content-creator/content-builder/app'], function(App, RegionController) {
  return App.module("ContentCreator", function(ContentCreator, App) {
    var ContentCreatorController;
    ContentCreatorController = (function(_super) {
      __extends(ContentCreatorController, _super);

      function ContentCreatorController() {
        return ContentCreatorController.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorController.prototype.initialize = function(options) {
        this.layout = this._getContentCreatorLayout();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:element:box", {
              region: _this.layout.elementBoxRegion
            });
            return App.execute("show:content:builder", {
              region: _this.layout.contentBuilderRegion
            });
          };
        })(this));
        return this.show(this.layout);
      };

      ContentCreatorController.prototype._getContentCreatorLayout = function() {
        return new ContentCreator.ContentCreatorLayout;
      };

      return ContentCreatorController;

    })(RegionController);
    ContentCreator.ContentCreatorLayout = (function(_super) {
      __extends(ContentCreatorLayout, _super);

      function ContentCreatorLayout() {
        return ContentCreatorLayout.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorLayout.prototype.className = 'content';

      ContentCreatorLayout.prototype.template = '<div class="page-title"> <h3>Add <span class="semi-bold">Question</span></h3> </div> <div class="creator"> <div class="tiles" id="toolbox"></div> <div class="" id="content-builder"></div> <div class="dock tiles"> <div class="tiles green"> <div class="tiles-head"> <h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4> </div> </div> <div id="questionProperties" class="docket"></div> <div id="hotspotProperties" class="docket"></div> </div> </div>';

      ContentCreatorLayout.prototype.regions = {
        elementBoxRegion: '#toolbox',
        contentBuilderRegion: '#content-builder',
        questionPropertiesRegion: '#questionProperties',
        hotspotPropertiesRegion: '#hotspotProperties'
      };

      return ContentCreatorLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:content:creator", function(options) {
      return new ContentCreatorController({
        region: options.region
      });
    });
  });
});
