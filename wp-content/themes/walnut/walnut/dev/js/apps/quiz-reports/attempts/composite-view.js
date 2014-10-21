var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/attempts/item-views'], function(App, RegionController) {
  return App.module("AttemptsPopupApp.Views", function(Views, App) {
    return Views.AttemptsMainView = (function(_super) {
      __extends(AttemptsMainView, _super);

      function AttemptsMainView() {
        return AttemptsMainView.__super__.constructor.apply(this, arguments);
      }

      AttemptsMainView.prototype.template = '<div class="col-lg-12"> <table class="table table-bordered tiles white" id="attempts-list-table" > <thead> <tr> <th>Attempted On</th> <th>Marks Obtained</th> <th>Time Taken</th> <th></th> </tr> </thead> <tbody id="list-attempts" class="rowlink"></tbody> </table>';

      AttemptsMainView.prototype.className = 'row';

      AttemptsMainView.prototype.itemView = Views.AttemptsItemView;

      AttemptsMainView.prototype.itemViewContainer = '#list-attempts';

      AttemptsMainView.prototype.events = {
        'click #confirm-yes': function() {
          return this.trigger('confirm:yes');
        },
        'click #alert-ok': function() {
          return this.trigger('alert:ok');
        },
        'click .comment-close': '_closeComment'
      };

      AttemptsMainView.prototype.initialize = function(options) {
        var modal_title, quiz, quiz_name, student, student_name;
        student = Marionette.getOption(this, 'student');
        student_name = student.get('display_name');
        quiz = Marionette.getOption(this, 'quiz');
        quiz_name = quiz.get('name');
        modal_title = "List of Attempts by " + student_name + " <span class='m-l-20'>Quiz Name : " + quiz_name + "</span>";
        return this.dialogOptions = {
          modal_title: modal_title
        };
      };

      return AttemptsMainView;

    })(Marionette.CompositeView);
  });
});
