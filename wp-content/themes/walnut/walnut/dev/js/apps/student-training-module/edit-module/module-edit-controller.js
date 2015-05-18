var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/student-training-module/edit-module/module-edit-views', 'apps/student-training-module/edit-module/module-description/module-description-controller'], function(App, RegionController) {
  return App.module("StudentTrainingApp.Edit", function(Edit, App) {
    Edit.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this._showContentSelectionApp = __bind(this._showContentSelectionApp, this);
        this._getModuleEditLayout = __bind(this._getModuleEditLayout, this);
        this.showGroupDetailsApp = __bind(this.showGroupDetailsApp, this);
        this._getContentGroupCollection = __bind(this._getContentGroupCollection, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function(options) {
        this.id = options.id, this.groupType = options.groupType;
        this.studentTrainingCollection = null;
        this.studentTrainingModel = this.id ? App.request("get:student:training:by:id", this.id) : App.request("new:student:training:module");
        this.studentTrainingModel.set('type', 'student_training');
        return App.execute("when:fetched", this.studentTrainingModel, (function(_this) {
          return function() {
            _this.studentTrainingCollection = _this._getContentGroupCollection();
            return App.execute("when:fetched", _this.studentTrainingCollection, function() {
              return _this.showContentGroupView();
            });
          };
        })(this));
      };

      GroupController.prototype._getContentGroupCollection = function() {
        this.studentTrainingCollection = App.request("get:content:pieces:of:group", this.studentTrainingModel);
        return this.studentTrainingCollection;
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
        this.layout = this._getModuleEditLayout();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            return _this.showGroupDetailsApp();
          };
        })(this));
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
        return App.execute("show:student:training:edit:description", {
          region: this.layout.collectionDetailsRegion,
          model: this.studentTrainingModel,
          studentTrainingCollection: this.studentTrainingCollection
        });
      };

      GroupController.prototype._getModuleEditLayout = function() {
        return new Edit.Views.EditLayout;
      };

      GroupController.prototype._showContentSelectionApp = function(model) {
        return App.execute("when:fetched", this.studentTrainingCollection, (function(_this) {
          return function() {
            if (model.get('post_status') === 'underreview') {
              App.execute("show:content:selectionapp", {
                region: _this.layout.contentSelectionRegion,
                model: model,
                studentTrainingCollection: _this.studentTrainingCollection
              });
            }
            return App.execute("show:editgroup:content:displayapp", {
              region: _this.layout.contentDisplayRegion,
              model: model,
              studentTrainingCollection: _this.studentTrainingCollection
            });
          };
        })(this));
      };

      return GroupController;

    })(RegionController);
    return App.commands.setHandler('show:student:training:edit:module:controller', function(opts) {
      return new Edit.GroupController(opts);
    });
  });
});
