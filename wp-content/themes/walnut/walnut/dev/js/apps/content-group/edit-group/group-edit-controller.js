var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-group/edit-group/group-details/details-app', 'apps/content-group/edit-group/content-selection/content-selection-app', 'apps/content-group/edit-group/content-display/content-display-app'], function(App, RegionController) {
  return App.module("ContentGroupApp.Edit", function(Edit, App) {
    var ContentGroupEditLayout;
    Edit.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this._showContentSelectionApp = __bind(this._showContentSelectionApp, this);
        this._getContentGroupEditLayout = __bind(this._getContentGroupEditLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function(options) {
        var breadcrumb_items, group_id, layout;
        group_id = options.group_id;
        if (group_id) {
          this.contentGroupModel = App.request("get:content:group:by:id", group_id);
        } else {
          this.contentGroupModel = App.request("new:content:group");
        }
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
        App.execute("when:fetched", this.contentGroupModel, (function(_this) {
          return function() {
            return _this.show(layout, {
              loading: true
            });
          };
        })(this));
        this.listenTo(layout, 'show', this.showContentGroupViews);
        this.listenTo(layout, 'show', (function(_this) {
          return function() {
            if (group_id) {
              return _this._showContentSelectionApp(_this.contentGroupModel);
            }
          };
        })(this));
        return this.listenTo(this.contentGroupModel, 'change:id', this._showContentSelectionApp, this);
      };

      GroupController.prototype.showContentGroupViews = function() {
        return App.execute("show:editgroup:content:group:detailsapp", {
          region: this.layout.collectionDetailsRegion,
          model: this.contentGroupModel
        });
      };

      GroupController.prototype._getContentGroupEditLayout = function() {
        return new ContentGroupEditLayout;
      };

      GroupController.prototype._showContentSelectionApp = function(model) {
        this.contentGroupCollection = App.request("get:content:pieces:of:group", model);
        return App.execute("when:fetched", this.contentGroupCollection, (function(_this) {
          return function() {
            console.log(_this.contentGroupCollection);
            App.execute("show:content:selectionapp", {
              region: _this.layout.contentSelectionRegion,
              model: model,
              contentGroupCollection: _this.contentGroupCollection
            });
            return App.execute("show:editgroup:content:displayapp", {
              region: _this.layout.contentDisplayRegion,
              model: model,
              contentGroupCollection: _this.contentGroupCollection
            });
          };
        })(this));
      };

      return GroupController;

    })(RegionController);
    return ContentGroupEditLayout = (function(_super) {
      __extends(ContentGroupEditLayout, _super);

      function ContentGroupEditLayout() {
        return ContentGroupEditLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupEditLayout.prototype.template = '<div class="teacher-app"> <div id="collection-details-region"></div> <div id="content-selection-region"></div> </div> <div id="content-display-region"></div>';

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
