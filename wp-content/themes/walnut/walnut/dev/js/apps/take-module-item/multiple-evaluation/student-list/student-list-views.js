var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("SingleQuestionMultipleEvaluationApp.StudentList.Views", function(Views, App) {
    var StudentsEmptyView, StudentsItemView;
    StudentsItemView = (function(_super) {
      __extends(StudentsItemView, _super);

      function StudentsItemView() {
        return StudentsItemView.__super__.constructor.apply(this, arguments);
      }

      StudentsItemView.prototype.className = 'col-sm-3 m-b-20';

      StudentsItemView.prototype.template = '<div class="row single tiles white no-margin" data-id="{{ID}}"> <div class="col-md-8 col-xs-8 no-padding"> <div class="text-center"> <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">{{display_name}}</span> </h4> <div class="clearfix"></div> </div> </div> <div class="col-md-4 col-xs-4 no-padding"> <div class="tiles unselected active"> <div class="user-profile-pic text-left m-t-0 p-t-10"> <img data-src-retina="{{profile_pic}}" data-src="{{profile_pic}}" src="{{profile_pic}}" alt=""> </div> <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div> </div> </div> </div>';

      return StudentsItemView;

    })(Marionette.ItemView);
    StudentsEmptyView = (function(_super) {
      __extends(StudentsEmptyView, _super);

      function StudentsEmptyView() {
        return StudentsEmptyView.__super__.constructor.apply(this, arguments);
      }

      StudentsEmptyView.prototype.template = '<div class="row no-margin"> <div class="col-md-12 no-padding"> <div class="text-center"> <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">No Students in Class</h4> <div class="clearfix"></div> </div> </div> </div>';

      return StudentsEmptyView;

    })(Marionette.ItemView);
    return Views.StudentsListView = (function(_super) {
      __extends(StudentsListView, _super);

      function StudentsListView() {
        return StudentsListView.__super__.constructor.apply(this, arguments);
      }

      StudentsListView.prototype.className = 'row students m-l-0 m-r-0 m-t-20';

      StudentsListView.prototype.itemView = StudentsItemView;

      StudentsListView.prototype.emptyView = StudentsEmptyView;

      StudentsListView.prototype.events = {
        'click .tiles.single.selectable': 'selectStudent'
      };

      StudentsListView.prototype.onShow = function() {
        var ele, eleValue, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = this.$el.find('.tiles.single');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ele = _ref[_i];
          $(ele).addClass('selectable');
        }
        $(".students").listnav({
          includeNums: false
        });
        this.correctAnswers = Marionette.getOption(this, 'correctAnswers');
        console.log(this.correctAnswers);
        this.correctAnswers = _.pluck(this.correctAnswers, 'id');
        console.log(this.correctAnswers);
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

      StudentsListView.prototype.markAsCorrectAnswer = function(student) {
        return $(student).removeClass('selected').find('.unselected').removeClass('unselected').addClass('blue').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
      };

      StudentsListView.prototype.selectStudent = function(e) {
        this.$el.find('.tiles.single').removeClass('selected');
        $(e.target).closest('.tiles.single').addClass("selected");
        this.$el.closest('.studentList').find('.parameters').slideToggle();
        this.$el.find(".tiles.single").addClass("light");
        $('html, body').animate({
          scrollTop: this.$el.closest('.studentList').find("#eval-parameters").offset().top
        }, 1000);
        return this.trigger('student:selected', $(e.target).closest('.tiles.single').attr('data-id'));
      };

      StudentsListView.prototype.onStudentAnswerSaved = function(id) {
        return this.$el.find(".tiles.single[data-id='" + id + "']").find('.unselected').removeClass('unselected').addClass('blue').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
      };

      return StudentsListView;

    })(Marionette.CollectionView);
  });
});
