var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentModulesApp", function(ContentModulesApp, App) {
    var ContentModulesRouter, Controller;
    ContentModulesRouter = (function(_super) {
      __extends(ContentModulesRouter, _super);

      function ContentModulesRouter() {
        return ContentModulesRouter.__super__.constructor.apply(this, arguments);
      }

      ContentModulesRouter.prototype.appRoutes = {
        'add-student-training-module': 'addStudentModule',
        'view-student-training-module/:id': 'viewStudentModule',
        'edit-student-training-module/:id': 'editStudentModule',
        'view-student-training-modules': 'listStudentModules'
      };

      return ContentModulesRouter;

    })(Marionette.AppRouter);
    Controller = {
      addStudentModule: function() {
        console.log('add student module');
        if ($.allowRoute('add-module')) {
          return App.execute('show:edit:module:controller', {
            region: App.mainContentRegion,
            groupType: 'teaching-module'
          });
        }
      },
      editStudentModule: function(id) {},
      viewStudentModule: function(id) {},
      listStudentModules: function() {}
    };
    return ContentModulesApp.on("start", function() {
      return new ContentModulesRouter({
        controller: Controller
      });
    });
  });
});
