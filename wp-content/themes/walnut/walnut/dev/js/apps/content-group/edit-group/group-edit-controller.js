var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/edit-group/templates/content-group.html', 'apps/content-group/edit-group/group-details/details-app', 'apps/content-group/edit-group/content-selection/content-selection-app', 'apps/content-group/edit-group/content-display/content-display-app'], function(App, RegionController, contentGroupTpl) {
  return App.module("ContentGroupApp.Edit", function(Edit, App) {
    var ContentGroupEditLayout;
    Edit.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this.newModelAdded = __bind(this.newModelAdded, this);
        this._getContentGroupEditLayout = __bind(this._getContentGroupEditLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function() {
        var breadcrumb_items, contentGroupCollection, layout;
        contentGroupCollection = App.request("get:content:groups");
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'Create Content Group',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = layout = this._getContentGroupEditLayout();
        this.listenTo(layout, 'show', this.showContentGroupViews);
        this.show(layout, {
          loading: true
        });
        return this.listenTo(contentGroupCollection, 'add', this.newModelAdded, this);
      };

      GroupController.prototype.showContentGroupViews = function() {
        var contentGroupModel;
        contentGroupModel = App.request("save:content:group:details", '');
        return App.execute("show:editgroup:content:group:detailsapp", {
          region: this.layout.collectionDetailsRegion,
          model: contentGroupModel
        });
      };

      GroupController.prototype._getContentGroupEditLayout = function() {
        return new ContentGroupEditLayout;
      };

      GroupController.prototype.newModelAdded = function(model) {
        App.execute("show:content:selectionapp", {
          region: this.layout.contentSelectionRegion,
          model: model
        });
        return App.execute("show:editgroup:content:displayapp", {
          region: this.layout.contentDisplayRegion,
          model: model
        });
      };

      return GroupController;

    })(RegionController);
    return ContentGroupEditLayout = (function(_super) {
      __extends(ContentGroupEditLayout, _super);

      function ContentGroupEditLayout() {
        return ContentGroupEditLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupEditLayout.prototype.template = contentGroupTpl;

      ContentGroupEditLayout.prototype.className = '';

      ContentGroupEditLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentSelectionRegion: '#content-selection-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupEditLayout;

    })(Marionette.Layout);
  });
});
