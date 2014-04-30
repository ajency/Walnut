var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/teachers-dashboard/teacher-teaching-module/teacher-teaching-controller'], function(App) {
  return App.module("TeacherTeachingApp", function(TeacherTeachingApp, App) {
    var Controller, TeacherTeachingRouter;
    TeacherTeachingRouter = (function(_super) {
      __extends(TeacherTeachingRouter, _super);

      function TeacherTeachingRouter() {
        return TeacherTeachingRouter.__super__.constructor.apply(this, arguments);
      }

      TeacherTeachingRouter.prototype.appRoutes = {
        'teachers/take-class/:classID/:div/textbook/:tID/module/:mID/:qID': 'teacherTeachingModule'
      };

      return TeacherTeachingRouter;

    })(Marionette.AppRouter);
    Controller = {
      teacherTeachingModule: function(classID, div, tID, mID, qID) {
        console.log('teacherTeachingModule');
        return new TeacherTeachingApp.TeacherTeachingController({
          region: App.mainContentRegion,
          textbookID: tID,
          classID: classID,
          division: div,
          moduleID: mID,
          questionID: qID
        });
      }
    };
    return TeacherTeachingApp.on("start", function() {
      return new TeacherTeachingRouter({
        controller: Controller
      });
    });
  });
});
