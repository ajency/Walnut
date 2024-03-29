var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/teachers-dashboard/dashboard/dashboard-controller', 'apps/teachers-dashboard/take-class/take-class-controller', 'apps/teaching-modules/textbook-modules-controller', 'apps/content-modules/view-single-module/single-module-controller'], function(App) {
  return App.module("TeachersDashboardApp", function(TeachersDashboardApp, App) {
    var Controller, TeachersDashboardRouter;
    TeachersDashboardRouter = (function(superClass) {
      extend(TeachersDashboardRouter, superClass);

      function TeachersDashboardRouter() {
        return TeachersDashboardRouter.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardRouter.prototype.appRoutes = {
        '': 'dashboardRedirect',
        'teachers/dashboard': 'teachersDashboard',
        'teachers/take-class/:classID/:div': 'takeClass',
        'teachers/take-class/:classID/:div/textbook/:tID': 'takeClassTextbookModules',
        'teachers/start-training/:classID': 'startTraining',
        'teachers/start-training/:classID/textbook/:tID': 'startTrainingTextbookModules',
        'students/dashboard': 'studentsDashboard',
        'students/dashboard/textbook/:tID': 'studentsQuizModules'
      };

      return TeachersDashboardRouter;

    })(Marionette.AppRouter);
    Controller = {
      dashboardRedirect: function() {
        if ($.allowRoute('dashboard')) {
          if (App.request('current:user:can', 'view_all_textbooks')) {
            App.navigate('textbooks', {
              trigger: true
            });
          }
          if (App.request('current:user:can', 'teacher')) {
            App.navigate('teachers/dashboard');
            this.teachersDashboard();
          }
          if (App.request('current:user:can', 'student')) {
            $("body").hide();
            return window.location.href = SITEURL + '/dashboard-student';
          }
        }
      },
      teachersDashboard: function() {
        if ($.allowRoute('dashboard')) {
          return new TeachersDashboardApp.View.DashboardController({
            region: App.mainContentRegion
          });
        }
      },
      takeClass: function(classID, div) {
        if ($.allowRoute('dashboard')) {
          return new TeachersDashboardApp.View.TakeClassController({
            region: App.mainContentRegion,
            classID: classID,
            division: div,
            mode: 'take-class'
          });
        }
      },
      startTraining: function(classID) {
        if ($.allowRoute('dashboard')) {
          return new TeachersDashboardApp.View.TakeClassController({
            region: App.mainContentRegion,
            classID: classID,
            mode: 'training'
          });
        }
      },
      takeClassTextbookModules: function(classID, div, tID) {
        if ($.allowRoute('dashboard')) {
          return new TeachersDashboardApp.View.textbookModulesController({
            region: App.mainContentRegion,
            textbookID: tID,
            classID: classID,
            division: div,
            mode: 'take-class'
          });
        }
      },
      startTrainingTextbookModules: function(classID, tID) {
        if ($.allowRoute('dashboard')) {
          return new TeachersDashboardApp.View.textbookModulesController({
            region: App.mainContentRegion,
            textbookID: tID,
            classID: classID,
            mode: 'training'
          });
        }
      },
      studentsDashboard: function() {
        var division;
        if ($.allowRoute('dashboard')) {
          division = App.request("get:user:data", "division");
          return App.execute("show:take:class:textbooks:app", {
            region: App.mainContentRegion,
            division: division,
            mode: 'take-quiz'
          });
        }
      },
      studentsQuizModules: function(tID) {
        var division;
        if ($.allowRoute('dashboard')) {
          division = App.request("get:user:data", "division");
          return new TeachersDashboardApp.View.textbookModulesController({
            region: App.mainContentRegion,
            textbookID: tID,
            division: division,
            mode: 'take-quiz'
          });
        }
      }
    };
    return TeachersDashboardApp.on("start", function() {
      return new TeachersDashboardRouter({
        controller: Controller
      });
    });
  });
});
