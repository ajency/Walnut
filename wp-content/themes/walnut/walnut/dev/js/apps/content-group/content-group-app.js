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
        'edit-group': 'editGroup',
        'view-group/:id': 'viewGroup',
        'list-groups': 'groupsListing',
        'teachers/take-class/:classID/:div/textbook/:tID/module/:mID': 'takeClassSingleModule'
      };

      return ContentGroupRouter;

    })(Marionette.AppRouter);
    Controller = {
      editGroup: function() {
        return new ContentGroupApp.Edit.GroupController({
          region: App.mainContentRegion
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
        return new ContentGroupApp.ListingView.GroupController({
          region: App.mainContentRegion
        });
      },
      takeClassSingleModule: function(classID, div, tID, mID) {
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
          module: 'take-class'
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
