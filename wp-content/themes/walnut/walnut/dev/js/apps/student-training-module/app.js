var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/student-training-module/edit-module/module-edit-controller', 'apps/student-training-module/view-module/single-module-controller', 'apps/content-modules/modules-listing/app'], function(App) {
  return App.module("StudentTrainingApp", function(StudentTrainingApp, App) {
    var Controller, StudentTrainingRouter;
    StudentTrainingRouter = (function(superClass) {
      extend(StudentTrainingRouter, superClass);

      function StudentTrainingRouter() {
        return StudentTrainingRouter.__super__.constructor.apply(this, arguments);
      }

      StudentTrainingRouter.prototype.appRoutes = {
        'add-student-training-module': 'addStudentModule',
        'view-student-training-module/:id': 'viewStudentModule',
        'edit-student-training-module/:id': 'editStudentModule',
        'view-student-training-modules': 'listStudentModules'
      };

      return StudentTrainingRouter;

    })(Marionette.AppRouter);
    Controller = {
      addStudentModule: function() {
        if ($.allowRoute('add-module')) {
          return App.execute('show:student:training:edit:module:controller', {
            region: App.mainContentRegion
          });
        }
      },
      editStudentModule: function(id) {
        if ($.allowRoute('edit-module')) {
          return App.execute('show:student:training:edit:module:controller', {
            region: App.mainContentRegion,
            id: id
          });
        }
      },
      viewStudentModule: function(id) {
        var breadcrumb_items;
        this.studentTrainingModel = App.request("get:student:training:by:id", id);
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'View Student Training Module',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        return App.execute("show:student:training:module", {
          region: App.mainContentRegion,
          model: this.studentTrainingModel
        });
      },
      listStudentModules: function() {
        if ($.allowRoute('module-list')) {
          return App.execute("show:module:listing:app", {
            region: App.mainContentRegion,
            groupType: 'student-training'
          });
        }
      }
    };
    return StudentTrainingApp.on("start", function() {
      return new StudentTrainingRouter({
        controller: Controller
      });
    });
  });
});
