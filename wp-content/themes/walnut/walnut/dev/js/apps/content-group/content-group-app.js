var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-group/edit-group/group-edit-controller', 'apps/content-group/view-group/group-view-controller', 'apps/content-group/groups-listing/group-listing-controller'], function(App) {
  return App.module("ContentGroupApp", function(ContentGroupApp, App) {
    var ContentGroupRouter, Controller;
    ContentGroupRouter = (function(_super) {
      __extends(ContentGroupRouter, _super);

      function ContentGroupRouter() {
        return ContentGroupRouter.__super__.constructor.apply(this, arguments);
      }

      ContentGroupRouter.prototype.appRoutes = {
        'add-module': 'addGroup',
        'view-group/:id': 'viewGroup',
        'edit-module/:id': 'editGroup',
        'module-list': 'groupsListing',
        'teachers/take-class/:classID/:div/textbook/:tID/module/:mID': 'takeClassSingleModule',
        'teachers/start-training/:classID/textbook/:tID/module/:mID': 'startTrainingSingleModule'
      };

      return ContentGroupRouter;

    })(Marionette.AppRouter);
    Controller = {
      addGroup: function() {
        return new ContentGroupApp.Edit.GroupController({
          region: App.mainContentRegion
        });
      },
      editGroup: function(id) {
        return new ContentGroupApp.Edit.GroupController({
          region: App.mainContentRegion,
          group_id: id
        });
      },
      viewGroup: function(id) {
        var breadcrumb_items;
        this.contentGroupModel = App.request("get:content:group:by:id", id);
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
        return new ContentGroupApp.View.GroupController({
          region: App.mainContentRegion,
          model: this.contentGroupModel
        });
      },
      groupsListing: function() {
        return new ContentGroupApp.GroupListing.Controller({
          region: App.mainContentRegion
        });
      },
      takeClassSingleModule: function(classID, div, tID, mID) {
        var opts;
        opts = {
          classID: classID,
          div: div,
          tID: tID,
          mID: mID,
          mode: 'take-class'
        };
        return this.gotoTakeSingleQuestionModule(opts);
      },
      startTrainingSingleModule: function(classID, tID, mID) {
        var opts;
        opts = {
          classID: classID,
          tID: tID,
          mID: mID,
          mode: 'training'
        };
        return this.gotoTakeSingleQuestionModule(opts);
      },
      gotoTakeSingleQuestionModule: function(opts) {
        var classID, div, mID, mode, tID;
        classID = opts.classID, div = opts.div, tID = opts.tID, mID = opts.mID, mode = opts.mode;
        this.textbook = App.request("get:textbook:by:id", tID);
        this.contentGroupModel = App.request("get:content:group:by:id", mID);
        App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            return App.execute("when:fetched", _this.contentGroupModel, function() {
              var breadcrumb_items, moduleName, textbookName;
              textbookName = _this.textbook.get('name');
              moduleName = _this.contentGroupModel.get('name');
              breadcrumb_items = {
                'items': [
                  {
                    'label': 'Dashboard',
                    'link': '#teachers/dashboard'
                  }, {
                    'label': 'Take Class',
                    'link': '#teachers/take-class/' + classID + '/' + div
                  }, {
                    'label': textbookName,
                    'link': '#teachers/take-class/' + classID + '/' + div + '/textbook/' + tID
                  }, {
                    'label': moduleName,
                    'link': 'javascript:;',
                    'active': 'active'
                  }
                ]
              };
              return App.execute("update:breadcrumb:model", breadcrumb_items);
            });
          };
        })(this));
        return new ContentGroupApp.View.GroupController({
          region: App.mainContentRegion,
          model: this.contentGroupModel,
          mode: mode,
          division: div,
          classID: classID
        });
      }
    };
    return ContentGroupApp.on("start", function() {
      return new ContentGroupRouter({
        controller: Controller
      });
    });
  });
});
