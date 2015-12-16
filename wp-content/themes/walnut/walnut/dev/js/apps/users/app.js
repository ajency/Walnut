var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/users/list/controller', 'apps/users/edit/controller'], function(App) {
  return App.module("UsersApp", function(UsersApp, App) {
    var Controller, UsersRouter;
    UsersRouter = (function(superClass) {
      extend(UsersRouter, superClass);

      function UsersRouter() {
        return UsersRouter.__super__.constructor.apply(this, arguments);
      }

      UsersRouter.prototype.appRoutes = {
        'parents': 'listUser',
        'parents/edited/:id': 'listUser',
        'add-parent': 'addUser',
        'edit-parent/:id': 'addUser'
      };

      return UsersRouter;

    })(Marionette.AppRouter);
    Controller = {
      listUser: function(editedID) {
        if (editedID == null) {
          editedID = 0;
        }
        return new UsersApp.List.Controller({
          region: App.mainContentRegion,
          editedID: editedID
        });
      },
      addUser: function(id) {
        if (id == null) {
          id = 0;
        }
        return new UsersApp.Edit.Controller({
          region: App.mainContentRegion,
          id: id
        });
      }
    };
    return UsersApp.on("start", function() {
      return new UsersRouter({
        controller: Controller
      });
    });
  });
});
