var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/users/list/composite-view'], function(App, RegionController) {
  return App.module('UsersApp.List', function(ListApp, App) {
    return ListApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var usersCollection;
        usersCollection = App.request("get:user:collection", {
          role: 'parent'
        });
        if (options.editedID) {
          App.navigate('parents', {
            replace: true
          });
        }
        return App.execute("when:fetched", usersCollection, (function(_this) {
          return function() {
            _this.view = new ListApp.Views.UsersListView({
              collection: usersCollection,
              editedID: options.editedID ? options.editedID : void 0
            });
            return _this.show(_this.view);
          };
        })(this));
      };

      return Controller;

    })(RegionController);
  });
});
