var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("SingleQuestionStudentsListApp.Controller", function(Controller, App) {
    var StudentsEmptyView, StudentsItemView, StudentsList;
    Controller.SingleQuestionStudentsList = (function(_super) {
      __extends(SingleQuestionStudentsList, _super);

      function SingleQuestionStudentsList() {
        this.successFn = __bind(this.successFn, this);
        this._saveQuestionResponse = __bind(this._saveQuestionResponse, this);
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this.showViews = __bind(this.showViews, this);
        return SingleQuestionStudentsList.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionStudentsList.prototype.initialize = function(opts) {
        this.collectionID = opts.collectionID;
        this.division = opts.division;
        this.questionID = opts.questionID;
        this.studentsCollection = App.request("get:user:collection", {
          'role': 'student',
          'division': this.division
        });
        this.questionResponseCollection = App.request("get:question:response:collection", {
          'collection_id': parseInt(this.collectionID),
          'content_piece_id': this.questionID,
          'division': this.division
        });
        return App.execute("when:fetched", this.questionResponseCollection, (function(_this) {
          return function() {
            _this.questionResponseModel = _this.questionResponseCollection.findWhere({
              'collection_id': _this.collectionID.toString(),
              'content_piece_id': _this.questionID.toString()
            });
            if (!_this.questionResponseModel) {
              _this.questionResponseModel = App.request("save:question:response", '');
              _this.questionResponseModel.set({
                'collection_id': parseInt(_this.collectionID),
                'content_piece_id': _this.questionID,
                'division': _this.division
              });
            }
            return _this.showViews();
          };
        })(this));
      };

      SingleQuestionStudentsList.prototype.showViews = function() {
        var view;
        this.view = view = this._showStudentsListView(this.studentsCollection);
        this.show(view, {
          loading: true,
          entities: [this.studentsCollection]
        });
        this.listenTo(view, "save:question:response", this._saveQuestionResponse);
        return this.listenTo(view, "question:completed", (function(_this) {
          return function() {
            return view.close();
          };
        })(this));
      };

      SingleQuestionStudentsList.prototype._showStudentsListView = function(collection) {
        return new StudentsList({
          collection: collection,
          correctAnswers: this.questionResponseModel.get('question_response')
        });
      };

      SingleQuestionStudentsList.prototype._saveQuestionResponse = function(studResponse) {
        this.questionResponseModel.set({
          'question_response': studResponse
        });
        return this.questionResponseModel.save(null, {
          wait: true,
          success: this.successFn,
          error: this.errorFn
        });
      };

      SingleQuestionStudentsList.prototype.successFn = function(model) {
        return console.log(model);
      };

      SingleQuestionStudentsList.prototype.errorFn = function() {
        return console.log('error');
      };

      return SingleQuestionStudentsList;

    })(RegionController);
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

      StudentsEmptyView.prototype.template = '<div class="row single tiles white no-margin"> <div class="col-md-8 col-xs-8 no-padding"> <div class="text-center"> <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">No Students in Class</h4> <div class="clearfix"></div> </div> </div> </div>';

      StudentsEmptyView.prototype.onShow = function() {
        return console.log('empty view');
      };

      return StudentsEmptyView;

    })(Marionette.ItemView);
    StudentsList = (function(_super) {
      __extends(StudentsList, _super);

      function StudentsList() {
        this.correctMark = __bind(this.correctMark, this);
        this.markAsCorrectAnswer = __bind(this.markAsCorrectAnswer, this);
        return StudentsList.__super__.constructor.apply(this, arguments);
      }

      StudentsList.prototype.className = 'studentList m-t-35';

      StudentsList.prototype.template = '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10"> <button type="button" id="question-done" class="btn btn-primary btn-xs btn-sm"> <i class="fa fa-check"></i> Done </button> </div> <div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-r-20"> <button type="button" class="btn btn-primary btn-xs btn-sm m-r-10" id="right-answer"> <i class="fa fa-check-circle"></i> Right Answer </button> <button type="button" class="btn btn-danger btn-xs btn-sm" id="wrong-answer"> <i class="fa fa-times-circle"></i> Wrong Answer </button> </div> <div class="clearfix"></div> <div class="row students m-t-20" id="students-list"></div>';

      StudentsList.prototype.itemViewContainer = '#students-list';

      StudentsList.prototype.itemView = StudentsItemView;

      StudentsList.prototype.emptyView = StudentsEmptyView;

      StudentsList.prototype.events = {
        'click .tiles.single': 'selectStudent',
        'click #right-answer': 'markAsCorrectAnswer',
        'click #wrong-answer': 'markAsWrongAnswer'
      };

      StudentsList.prototype.onShow = function() {
        var ele, eleValue, _i, _len, _ref;
        this.correctAnswers = Marionette.getOption(this, 'correctAnswers');
        this.correctAnswers = _.compact(this.correctAnswers);
        _ref = this.$el.find('.tiles.single');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ele = _ref[_i];
          eleValue = parseInt($(ele).attr('data-id'));
          if (_.contains(this.correctAnswers, eleValue)) {
            console.log(eleValue);
            this.correctMark(ele);
          }
        }
        return console.log(this.correctAnswers);
      };

      StudentsList.prototype.selectStudent = function(e) {
        return $(e.target).closest('.tiles.single').toggleClass("selected");
      };

      StudentsList.prototype.markAsCorrectAnswer = function() {
        var selectedStudents, student, _i, _len;
        selectedStudents = this.$el.find('.tiles.single.selected');
        for (_i = 0, _len = selectedStudents.length; _i < _len; _i++) {
          student = selectedStudents[_i];
          this.correctAnswers = _.union(this.correctAnswers, parseInt($(student).attr('data-id')));
          this.correctMark(student);
        }
        this.correctAnswers = _.uniq(this.correctAnswers);
        console.log(this.correctAnswers);
        return this.trigger("save:question:response", this.correctAnswers);
      };

      StudentsList.prototype.correctMark = function(student) {
        return $(student).removeClass('selected').find('.default').removeClass('default').addClass('green').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
      };

      StudentsList.prototype.markAsWrongAnswer = function() {
        var selectedStudents, student, _i, _len;
        selectedStudents = this.$el.find('.tiles.single.selected');
        for (_i = 0, _len = selectedStudents.length; _i < _len; _i++) {
          student = selectedStudents[_i];
          this.correctAnswers = _.without(this.correctAnswers, parseInt($(student).attr('data-id')));
          $(student).removeClass('selected').find('.green').removeClass('green').addClass('default').find('i').removeClass('fa-check-circle').addClass('fa-minus-circle');
        }
        return this.trigger("save:question:response", this.correctAnswers);
      };

      return StudentsList;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:single:question:student:list:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.SingleQuestionStudentsList(opt);
    });
  });
});
