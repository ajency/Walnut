var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-modules/edit-module/module-description/description-app', 'apps/content-modules/edit-module/content-selection/content-selection-app', 'apps/content-modules/edit-module/content-display/content-display-app'], function(App, RegionController) {
  return App.module("ContentModulesApp.Edit", function(Edit, App) {
    var ContentGroupEditLayout, NotEditView;
    Edit.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this._showContentSelectionApp = __bind(this._showContentSelectionApp, this);
        this._getContentGroupEditLayout = __bind(this._getContentGroupEditLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function(options) {
        this.group_id = options.group_id;
        if (this.group_id) {
          this.contentGroupModel = App.request("get:content:group:by:id", this.group_id);
        } else {
          this.contentGroupModel = App.request("new:content:group");
        }
        return App.execute("when:fetched", this.contentGroupModel, (function(_this) {
          return function() {
            return _this.showContentGroupView();
          };
        })(this));
      };

      GroupController.prototype.showContentGroupView = function() {
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
              'label': 'Create Content Group',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = layout = this._getContentGroupEditLayout();
        this.listenTo(layout, 'show', this.showContentGroupViews);
        this.listenTo(layout, 'show', (function(_this) {
          return function() {
            if (_this.group_id) {
              return _this._showContentSelectionApp(_this.contentGroupModel);
            }
          };
        })(this));
        this.listenTo(this.contentGroupModel, 'change:id', this._showContentSelectionApp, this);
        this.listenTo(this.layout.collectionDetailsRegion, 'close:content:selection:app', (function(_this) {
          return function() {
            console.log('close:content:selection:app ');
            return _this.layout.contentSelectionRegion.close();
          };
        })(this));
        return this.show(layout, {
          loading: true
        });
      };

      GroupController.prototype._getNotEditView = function(status) {
        return new NotEditView({
          status: status
        });
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
            if (model.get('post_status') === 'underreview') {
              App.execute("show:content:selectionapp", {
                region: _this.layout.contentSelectionRegion,
                model: model,
                contentGroupCollection: _this.contentGroupCollection
              });
            }
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
    ContentGroupEditLayout = (function(_super) {
      __extends(ContentGroupEditLayout, _super);

      function ContentGroupEditLayout() {
        return ContentGroupEditLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupEditLayout.prototype.template = '<div class="teacher-app" id="teacher-app"> <div id="collection-details-region"></div> <div id="content-selection-region"></div> </div> <div id="content-display-region"></div>';

      ContentGroupEditLayout.prototype.className = '';

      ContentGroupEditLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentSelectionRegion: '#content-selection-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupEditLayout;

    })(Marionette.Layout);
    return NotEditView = (function(_super) {
      __extends(NotEditView, _super);

      function NotEditView() {
        return NotEditView.__super__.constructor.apply(this, arguments);
      }

      NotEditView.prototype.template = '<div class="teacher-app"> <div id="collection-details-region"> <div class="tiles white grid simple vertical green animated fadeIn"> <div class="grid-title no-border"> <h3>This module is not editable</h3> <p>Current Status: {{currentStatus}}</p> </div> </div> </div> </div>';

      NotEditView.prototype.mixinTemplateHelpers = function(data) {
        var status;
        status = Marionette.getOption(this, 'status');
        switch (status) {
          case 'publish':
            data.currentStatus = 'Published';
            break;
          case 'archive':
            data.currentStatus = 'Archived';
            break;
          default:
            data.currentStatus = 'Not specified!';
        }
        return data;
      };

      return NotEditView;

    })(Marionette.ItemView);
  });
});
