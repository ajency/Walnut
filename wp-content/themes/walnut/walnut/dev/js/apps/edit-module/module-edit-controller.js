var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/edit-module/module-edit-views', 'apps/edit-module/module-description/module-description-controller', 'apps/edit-module/content-selection/app', 'apps/edit-module/content-display/content-display-app'], function(App, RegionController) {
  return App.module("ContentModulesApp.Edit", function(Edit, App) {
    Edit.GroupController = (function(superClass) {
      extend(GroupController, superClass);

      function GroupController() {
        this._showContentSelectionApp = bind(this._showContentSelectionApp, this);
        this._getContentGroupEditLayout = bind(this._getContentGroupEditLayout, this);
        this.showGroupDetailsApp = bind(this.showGroupDetailsApp, this);
        this._getContentGroupCollection = bind(this._getContentGroupCollection, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function(options) {
        this.group_id = options.group_id, this.groupType = options.groupType;
        this.contentGroupCollection = null;
        if (this.group_id) {
          if (this.groupType === 'teaching-module') {
            this.contentGroupModel = App.request("get:content:group:by:id", this.group_id);
          }
          if (this.groupType === 'quiz') {
            this.contentGroupModel = App.request("get:quiz:by:id", this.group_id);
          }
        } else {
          if (this.groupType === 'teaching-module') {
            this.contentGroupModel = App.request("new:content:group");
          }
          if (this.groupType === 'quiz') {
            this.contentGroupModel = App.request("new:quiz");
          }
        }
        return App.execute("when:fetched", this.contentGroupModel, (function(_this) {
          return function() {
            _this.contentGroupCollection = _this._getContentGroupCollection();
            return App.execute("when:fetched", _this.contentGroupCollection, function() {
              return _this.showContentGroupView();
            });
          };
        })(this));
      };

      GroupController.prototype._getContentGroupCollection = function() {
        if (this.groupType === 'teaching-module') {
          this.contentGroupCollection = App.request("get:content:pieces:of:group", this.contentGroupModel);
        }
        if (this.groupType === 'quiz') {
          this.contentGroupCollection = new Backbone.Collection;
          _.each(this.contentGroupModel.get('content_layout'), (function(_this) {
            return function(content) {
              var contentModel;
              if (content.type === 'content-piece') {
                contentModel = App.request("get:content:piece:by:id", content.id);
              } else {
                content.data.lvl1 = parseInt(content.data.lvl1);
                content.data.lvl2 = parseInt(content.data.lvl2);
                content.data.lvl3 = parseInt(content.data.lvl3);
                contentModel = new Backbone.Model(content.data);
              }
              return _this.contentGroupCollection.add(contentModel);
            };
          })(this));
        }
        return this.contentGroupCollection;
      };

      GroupController.prototype.showContentGroupView = function() {
        var breadcrumb_items;
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
        this.layout = this._getContentGroupEditLayout();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            _this.showGroupDetailsApp();
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
        return this.show(this.layout, {
          loading: true
        });
      };

      GroupController.prototype.showGroupDetailsApp = function() {
        return App.execute("show:editgroup:content:group:detailsapp", {
          region: this.layout.collectionDetailsRegion,
          model: this.contentGroupModel,
          contentGroupCollection: this.contentGroupCollection
        });
      };

      GroupController.prototype._getContentGroupEditLayout = function() {
        return new Edit.Views.ContentGroupEditLayout;
      };

      GroupController.prototype._showContentSelectionApp = function(model) {
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
    return App.commands.setHandler('show:edit:module:controller', function(opts) {
      return new Edit.GroupController(opts);
    });
  });
});
