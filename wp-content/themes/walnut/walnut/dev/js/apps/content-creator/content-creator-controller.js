var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/element-box/elementboxapp', 'apps/content-creator/content-builder/app', 'apps/content-creator/property-dock/controller', 'apps/content-creator/options-bar/options-bar-app'], function(App, RegionController) {
  return App.module("ContentCreator.Controller", function(Controller, App) {
    var ContentCreatorLayout;
    Controller.ContentCreatorController = (function(_super) {
      __extends(ContentCreatorController, _super);

      function ContentCreatorController() {
        return ContentCreatorController.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorController.prototype.initialize = function(options) {
        var breadcrumb_items;
        this.contentType = options.contentType;
        this.contentPieceModel = App.request("get:page:json", 196);
        App.execute("when:fetched", this.contentPieceModel, (function(_this) {
          return function() {
            if (!_this.contentPieceModel.get('ID')) {
              return _this.contentPieceModel.set({
                'content_type': _this.contentType
              });
            }
          };
        })(this));
        this.saveModelCommand = new Backbone.Wreqr.Commands();
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
        this.layout = this._getContentCreatorLayout(this.contentPieceModel);
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            console.log(_this.saveModelCommand);
            App.execute("show:options:bar", {
              region: _this.layout.optionsBarRegion,
              contentType: _this.contentType,
              contentPieceModel: _this.contentPieceModel,
              saveModelCommand: _this.saveModelCommand
            });
            App.execute("show:element:box", {
              region: _this.layout.elementBoxRegion,
              contentType: _this.contentType
            });
            App.execute("show:content:builder", {
              region: _this.layout.contentBuilderRegion,
              contentPieceModel: _this.contentPieceModel
            });
            return App.execute("show:property:dock", {
              region: _this.layout.PropertyRegion,
              saveModelCommand: _this.saveModelCommand
            });
          };
        })(this));
        return this.show(this.layout);
      };

      ContentCreatorController.prototype._getContentCreatorLayout = function() {
        return new ContentCreatorLayout;
      };

      return ContentCreatorController;

    })(RegionController);
    return ContentCreatorLayout = (function(_super) {
      __extends(ContentCreatorLayout, _super);

      function ContentCreatorLayout() {
        return ContentCreatorLayout.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorLayout.prototype.className = 'content-creator-layout';

      ContentCreatorLayout.prototype.template = '<div id="options-bar-region"></div> <div class="page-title"> <h3>Add <span class="semi-bold">Question</span></h3> </div> <div class="creator"> <div class="tiles" id="toolbox"></div> <div class="" id="content-builder"></div> <div class="dock tiles" id="property-dock"></div> </div>';

      ContentCreatorLayout.prototype.regions = {
        elementBoxRegion: '#toolbox',
        contentBuilderRegion: '#content-builder',
        PropertyRegion: '#property-dock',
        optionsBarRegion: '#options-bar-region'
      };

      return ContentCreatorLayout;

    })(Marionette.Layout);
  });
});
