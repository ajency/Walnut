var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("SingleQuestionStudentsListApp.Views", function(Views, App) {
    var StudentsEmptyView, StudentsItemView;
    StudentsItemView = (function(_super) {
      __extends(StudentsItemView, _super);

      function StudentsItemView() {
        return StudentsItemView.__super__.constructor.apply(this, arguments);
      }

      StudentsItemView.prototype.className = 'col-sm-3 m-b-20';

      StudentsItemView.prototype.template = '<div class="row single tiles white no-margin" data-id="{{ID}}"> <div class="col-md-8 col-xs-8 no-padding"> <div class="text-center"> <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">{{display_name}}</span> </h4> <div class="clearfix"></div> </div> </div> <div class="col-md-4 col-xs-4 no-padding"> <div class="tiles default active"> <div class="user-profile-pic text-left m-t-0 p-t-10"> <img data-src-retina="{{profile_pic}}" data-src="{{profile_pic}}" src="{{profile_pic}}" alt=""> </div> <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div> </div> </div> </div>';

      return StudentsItemView;

    })(Marionette.ItemView);
    StudentsEmptyView = (function(_super) {
      __extends(StudentsEmptyView, _super);

      function StudentsEmptyView() {
        return StudentsEmptyView.__super__.constructor.apply(this, arguments);
      }

      StudentsEmptyView.prototype.template = '<div class="row no-margin"> <div class="col-md-8 col-xs-8 no-padding"> <div class="text-center"> <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">No Students in Class</h4> <div class="clearfix"></div> </div> </div> </div>';

      return StudentsEmptyView;

    })(Marionette.ItemView);
    return Views.StudentsList = (function(_super) {
      __extends(StudentsList, _super);

      function StudentsList() {
        this.addToCorrectList = __bind(this.addToCorrectList, this);
        return StudentsList.__super__.constructor.apply(this, arguments);
      }

      StudentsList.prototype.className = 'studentList m-t-35';

      StudentsList.prototype.template = '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-l-20"> <button type="button" id="question-done" class="btn btn-success btn-xs btn-sm"> <i class="fa fa-forward"></i> Next </button> </div> {{#class_mode}} <div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10"> <button type="button" class="btn btn-info btn-xs btn-sm m-r-10" id="right-answer"> <i class="fa fa-check-circle"></i> Right Answer </button> <button type="button" class="btn btn-white btn-xs btn-sm" id="wrong-answer"> <i class="fa fa-minus-circle"></i> Unselect Answer </button> </div> {{/class_mode}} <div class="clearfix"></div> <div class="row students m-l-0 m-r-0 m-t-20" id="students-list"></div>';

      StudentsList.prototype.itemViewContainer = '#students-list';

      StudentsList.prototype.itemView = StudentsItemView;

      StudentsList.prototype.emptyView = StudentsEmptyView;

      StudentsList.prototype.events = {
        'click .tiles.single.selectable': 'selectStudent',
        'click #right-answer': 'addToCorrectList',
        'click #wrong-answer': 'removeFromCorrectList',
        'click #question-done': 'questionCompleted'
      };

      StudentsList.prototype.serializeData = function() {
        var data;
        data = StudentsList.__super__.serializeData.call(this);
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          data.class_mode = true;
        }
        return data;
      };

      StudentsList.prototype.onShow = function() {
        var ele, eleValue, _i, _j, _len, _len1, _ref, _ref1, _results;
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          _ref = this.$el.find('.tiles.single');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ele = _ref[_i];
            $(ele).addClass('selectable');
          }
        }
        $(".students").listnav({
          includeNums: false
        });
        this.correctAnswers = Marionette.getOption(this, 'correctAnswers');
        this.correctAnswers = _.compact(this.correctAnswers);
        _ref1 = this.$el.find('.tiles.single');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          ele = _ref1[_j];
          eleValue = parseInt($(ele).attr('data-id'));
          if (_.contains(this.correctAnswers, eleValue)) {
            _results.push(this.markAsCorrectAnswer(ele));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      StudentsList.prototype.selectStudent = function(e) {
        return $(e.target).closest('.tiles.single').toggleClass("selected");
      };

      StudentsList.prototype.addToCorrectList = function() {
        var selectedStudents, student, _i, _len;
        selectedStudents = this.$el.find('.tiles.single.selected');
        for (_i = 0, _len = selectedStudents.length; _i < _len; _i++) {
          student = selectedStudents[_i];
          this.correctAnswers = _.union(this.correctAnswers, parseInt($(student).attr('data-id')));
          this.markAsCorrectAnswer(student);
        }
        this.correctAnswers = _.uniq(this.correctAnswers);
        return this.trigger("save:question:response", this.correctAnswers);
      };

      StudentsList.prototype.markAsCorrectAnswer = function(student) {
        return $(student).removeClass('selected').find('.default').removeClass('default').addClass('green').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
      };

      StudentsList.prototype.removeFromCorrectList = function() {
        var selectedStudents, student, _i, _len;
        selectedStudents = this.$el.find('.tiles.single.selected');
        for (_i = 0, _len = selectedStudents.length; _i < _len; _i++) {
          student = selectedStudents[_i];
          this.correctAnswers = _.without(this.correctAnswers, parseInt($(student).attr('data-id')));
          $(student).removeClass('selected').find('.green').removeClass('green').addClass('default').find('i').removeClass('fa-check-circle').addClass('fa-minus-circle');
        }
        return this.trigger("save:question:response", this.correctAnswers);
      };

      StudentsList.prototype.questionCompleted = function() {
        if ((_.size(this.correctAnswers) < 1) && (Marionette.getOption(this, 'display_mode') === 'class_mode')) {
          if (confirm('This item will be marked as complete. None of the options have been selected. Continue?')) {
            return this.trigger("question:completed", "no_answer");
          }
        } else {
          if (confirm('This item will be marked as complete. Continue?')) {
            return this.trigger("question:completed");
          }
        }
      };

      return StudentsList;

    })(Marionette.CompositeView);
  });
});
