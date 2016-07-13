var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/take-module-item/take-module-item-controller'], function(App) {
  App.module("TeacherTeachingApp", function(TeacherTeachingApp, App) {
    var Controller, TeacherTeachingRouter;
    TeacherTeachingRouter = (function(superClass) {
      extend(TeacherTeachingRouter, superClass);

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
  return App.commands.setHandler("start:teacher:teaching:app", function(opt) {
    if (opt == null) {
      opt = {};
    }
    return new App.TeacherTeachingApp.TeacherTeachingController(opt);
  });
});
