var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/templates/content-collection.html', 'apps/content-collection/collection-details/details-app', 'apps/content-collection/content-selection/content-selection-app-2', 'apps/content-collection/content-display/content-display-app'], function(App, RegionController, contentCollectionTpl) {
  return App.module("ContentCollectionApp.Controller", function(Controller, App) {
    var ContentCreatorLayout;
    Controller.ContentCollectionController = (function(_super) {
      __extends(ContentCollectionController, _super);

      function ContentCollectionController() {
        this._getContentCreatorLayout = __bind(this._getContentCreatorLayout, this);
        this.showContentCollectionViews = __bind(this.showContentCollectionViews, this);
        return ContentCollectionController.__super__.constructor.apply(this, arguments);
      }

      ContentCollectionController.prototype.initialize = function() {
        var breadcrumb_items, layout;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'Create Content Collection',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = layout = this._getContentCreatorLayout();
        this.listenTo(layout, 'show', this.showContentCollectionViews);
        return this.show(layout, {
          loading: true
        });
      };

      ContentCollectionController.prototype.showContentCollectionViews = function() {
        App.execute("show:collections:detailsapp", {
          region: this.layout.collectionDetailsRegion
        });
        App.execute("show:content:selectionapp", {
          region: this.layout.contentSelectionRegion
        });
        return App.execute("show:content:displayapp", {
          region: this.layout.contentDisplayRegion
        });
      };

      ContentCollectionController.prototype._getContentCreatorLayout = function() {
        return new ContentCreatorLayout;
      };

      return ContentCollectionController;

    })(RegionController);
    ContentCreatorLayout = (function(_super) {
      __extends(ContentCreatorLayout, _super);

      function ContentCreatorLayout() {
        return ContentCreatorLayout.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorLayout.prototype.template = contentCollectionTpl;

      ContentCreatorLayout.prototype.className = '';

      ContentCreatorLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentSelectionRegion: '#content-selection-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentCreatorLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:create:collection", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ContentCollectionController(opt);
    });
  });
});
