var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/element-box/elementboxapp', 'apps/content-creator/content-builder/app', 'apps/content-creator/property-dock/controller', 'apps/content-creator/preview-content-piece/preview-controller'], function(App, RegionController) {
  return App.module("ContentCreator", function(ContentCreator, App, Backbone, Marionette, $, _) {
    var ContentCreatorController, ContentCreatorRouter, Controller;
    ContentCreator.closequestionelementproperty = true;
    ContentCreator.closequestionelements = true;
    ContentCreator.closequestioneproperty = true;
    ContentCreatorRouter = (function(_super) {
      __extends(ContentCreatorRouter, _super);

      function ContentCreatorRouter() {
        return ContentCreatorRouter.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorRouter.prototype.appRoutes = {
        '': 'showContentCreator',
        'preview-item': 'previewContentPiece'
      };

      return ContentCreatorRouter;

    })(Marionette.AppRouter);
    Controller = {
      showContentCreator: function() {
        return new ContentCreatorController({
          region: App.mainContentRegion
        });
      },
      previewContentPiece: function(contentID) {
        return new ContentCreator.View.PreviewController({
          region: App.mainContentRegion,
          contentID: contentID
        });
      }
    };
    ContentCreator.on("start", function() {
      return new ContentCreatorRouter({
        controller: Controller
      });
    });
    ContentCreatorController = (function(_super) {
      __extends(ContentCreatorController, _super);

      function ContentCreatorController() {
        return ContentCreatorController.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorController.prototype.initialize = function(options) {
        var breadcrumb_items, eventObj;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'Content Creator',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = this._getContentCreatorLayout();
        eventObj = App.createEventObject();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:element:box", {
              region: _this.layout.elementBoxRegion,
              eventObj: eventObj
            });
            App.execute("show:content:builder", {
              region: _this.layout.contentBuilderRegion,
              eventObj: eventObj
            });
            return App.execute("show:property:dock", {
              region: _this.layout.PropertyRegion
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

      ContentCreatorLayout.prototype.className = '';

      ContentCreatorLayout.prototype.template = '<div class="page-title"> <h3>Add <span class="semi-bold">Question</span></h3> </div> <div class="creator"> <div class="tiles" id="toolbox"></div> <div class="" id="content-builder"></div> <div class="dock tiles" id="property-dock"></div> </div>';

      ContentCreatorLayout.prototype.regions = {
        elementBoxRegion: '#toolbox',
        contentBuilderRegion: '#content-builder',
        PropertyRegion: '#property-dock'
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
