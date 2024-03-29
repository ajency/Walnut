var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/edit-group/templates/content-group.html', 'apps/content-group/view-group/group-details/details-app', 'apps/content-group/view-group/content-display/content-display-app'], function(App, RegionController, contentGroupTpl) {
  return App.module("ContentGroupApp.View", function(View, App) {
    var ContentGroupViewLayout;
    View.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this._getContentGroupViewLayout = __bind(this._getContentGroupViewLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function(opts) {
        var breadcrumb_items, layout, modelID;
        modelID = opts.modelID;
        this.contentGroupModel = App.request("get:content:group:by:id", modelID);
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'View Content Group',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = layout = this._getContentGroupViewLayout();
        this.listenTo(layout, 'show', this.showContentGroupViews);
        return this.show(layout, {
          loading: true
        });
      };

      GroupController.prototype.showContentGroupViews = function() {
        return App.execute("when:fetched", this.contentGroupModel, (function(_this) {
          return function() {
            App.execute("show:viewgroup:content:group:detailsapp", {
              region: _this.layout.collectionDetailsRegion,
              model: _this.contentGroupModel
            });
            return App.execute("show:viewgroup:content:displayapp", {
              region: _this.layout.contentDisplayRegion,
              model: _this.contentGroupModel
            });
          };
        })(this));
      };

      GroupController.prototype._getContentGroupViewLayout = function() {
        return new ContentGroupViewLayout;
      };

      return GroupController;

    })(RegionController);
    return ContentGroupViewLayout = (function(_super) {
      __extends(ContentGroupViewLayout, _super);

      function ContentGroupViewLayout() {
        return ContentGroupViewLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupViewLayout.prototype.template = contentGroupTpl;

      ContentGroupViewLayout.prototype.className = '';

      ContentGroupViewLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupViewLayout;

    })(Marionette.Layout);
  });
});
