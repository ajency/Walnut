var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/take-module-item/student-list/student-list-app', 'apps/take-module-item/teacher-training-footer/training-footer-controller', 'apps/take-module-item/module-description/module-description-app', 'apps/take-module-item/chorus-options/chorus-options-app', 'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'], function(App, RegionController) {
  return App.module("TeacherTeachingApp", function(View, App) {
    var SingleQuestionLayout, contentGroupModel, contentPiece, questionResponseCollection, questionResponseModel, questionsCollection, studentCollection;
    contentGroupModel = null;
    studentCollection = null;
    questionsCollection = null;
    questionResponseCollection = null;
    contentPiece = null;
    questionResponseModel = null;
    View.TeacherTeachingController = (function(_super) {
      __extends(TeacherTeachingController, _super);

      function TeacherTeachingController() {
        this._showTeacherTrainingFooter = __bind(this._showTeacherTrainingFooter, this);
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._showQuestionDisplayView = __bind(this._showQuestionDisplayView, this);
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._getOrCreateModel = __bind(this._getOrCreateModel, this);
        this._saveQuestionResponse = __bind(this._saveQuestionResponse, this);
        this._gotoPreviousRoute = __bind(this._gotoPreviousRoute, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        return TeacherTeachingController.__super__.constructor.apply(this, arguments);
      }

      TeacherTeachingController.prototype.initialize = function(opts) {
        var layout;
        this.division = opts.division, this.classID = opts.classID, this.moduleID = opts.moduleID, contentGroupModel = opts.contentGroupModel, questionsCollection = opts.questionsCollection, questionResponseCollection = opts.questionResponseCollection, contentPiece = opts.contentPiece, this.display_mode = opts.display_mode, studentCollection = opts.studentCollection;
        App.leftNavRegion.close();
        App.headerRegion.close();
        App.breadcrumbRegion.close();
        App.execute("when:fetched", [questionResponseCollection, contentPiece], (function(_this) {
          return function() {
            return _this._getOrCreateModel(contentPiece.get('ID'));
          };
        })(this));
        this.layout = layout = this._getTakeSingleQuestionLayout();
        this.show(this.layout, {
          loading: true,
          entities: [contentGroupModel, studentCollection, questionsCollection, questionResponseCollection, questionResponseModel, contentPiece]
        });
        this.timerObject = new Backbone.Wreqr.RequestResponse();
        this.listenTo(this.layout, "show", this._showModuleDescriptionView);
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            if (_this.display_mode === 'training' || contentPiece.get('content_type') === 'content_piece') {
              return _this._showTeacherTrainingFooter();
            } else {
              return _this._showStudentsListView(questionResponseModel);
            }
          };
        })(this));
        this.listenTo(this.layout, "show", this._showQuestionDisplayView(contentPiece));
        this.listenTo(this.layout.moduleDetailsRegion, "goto:previous:route", this._gotoPreviousRoute);
        this.listenTo(this.layout.studentsListRegion, "goto:previous:route", this._gotoPreviousRoute);
        this.listenTo(this.layout.moduleDetailsRegion, "goto:next:question", this._changeQuestion);
        return this.listenTo(this.layout.studentsListRegion, "goto:next:question", this._changeQuestion);
      };

      TeacherTeachingController.prototype._changeQuestion = function() {
        var nextQuestion;
        if (this.display_mode === 'class_mode') {
          this._saveQuestionResponse("completed");
        }
        nextQuestion = this._getNextItemID();
        if (nextQuestion) {
          contentPiece = questionsCollection.get(nextQuestion);
          questionResponseModel = this._getOrCreateModel(nextQuestion);
          this._showQuestionDisplayView(contentPiece);
          if (this.display_mode === 'training' || contentPiece.get('content_type') === 'content_piece') {
            return this._showTeacherTrainingFooter();
          } else {
            return this._showStudentsListView(questionResponseModel);
          }
        } else {
          return this._gotoPreviousRoute();
        }
      };

      TeacherTeachingController.prototype._getNextItemID = function() {
        var contentPieces, nextQuestion, pieceIndex;
        contentPieces = contentGroupModel.get('content_pieces');
        contentPieces = _.map(contentPieces, function(m) {
          return parseInt(m);
        });
        pieceIndex = _.indexOf(contentPieces, contentPiece.id);
        nextQuestion = parseInt(contentPieces[pieceIndex + 1]);
        if (!nextQuestion) {
          nextQuestion = false;
        }
        return nextQuestion;
      };

      TeacherTeachingController.prototype._gotoPreviousRoute = function() {
        var currRoute, newRoute, removeStr;
        if (this.display_mode === 'class_mode' && questionResponseModel.get('status') !== 'completed') {
          this._saveQuestionResponse("paused");
        }
        currRoute = App.getCurrentRoute();
        removeStr = _.str.strRightBack(currRoute, '/');
        newRoute = _.str.rtrim(currRoute, removeStr + '/');
        return App.navigate(newRoute, true);
      };

      TeacherTeachingController.prototype._saveQuestionResponse = function(status) {
        var elapsedTime;
        elapsedTime = this.timerObject.request("get:elapsed:time");
        questionResponseModel.set({
          time_taken: elapsedTime,
          status: status
        });
        return questionResponseModel.save();
      };

      TeacherTeachingController.prototype._getOrCreateModel = function(content_piece_id) {
        var modelData;
        questionResponseModel = questionResponseCollection.findWhere({
          'content_piece_id': content_piece_id
        });
        if (!questionResponseModel) {
          modelData = {
            collection_id: contentGroupModel.get('id'),
            content_piece_id: content_piece_id,
            division: this.division
          };
          questionResponseModel = App.request("save:question:response", '');
          questionResponseModel.set(modelData);
          if (this.display_mode === 'class_mode') {
            questionResponseModel.save();
          }
        }
        return questionResponseModel;
      };

      TeacherTeachingController.prototype._showModuleDescriptionView = function() {
        return App.execute("when:fetched", contentGroupModel, (function(_this) {
          return function() {
            return App.execute("show:teacher:teaching:module:description", {
              region: _this.layout.moduleDetailsRegion,
              model: contentGroupModel,
              timerObject: _this.timerObject,
              questionResponseModel: questionResponseModel,
              questionResponseCollection: questionResponseCollection,
              display_mode: _this.display_mode
            });
          };
        })(this));
      };

      TeacherTeachingController.prototype._showQuestionDisplayView = function(model) {
        return App.execute("show:content:preview", {
          region: this.layout.questionsDetailsRegion,
          model: model,
          textbookNames: this.textbookNames,
          questionResponseModel: questionResponseModel,
          timerObject: this.timerObject,
          display_mode: this.display_mode,
          classID: this.classID,
          students: studentCollection
        });
      };

      TeacherTeachingController.prototype._showStudentsListView = function(questionResponseModel) {
        return App.execute("when:fetched", contentPiece, (function(_this) {
          return function() {
            var question_type;
            question_type = contentPiece.get('question_type');
            if (question_type === 'individual') {
              return App.execute("show:single:question:student:list:app", {
                region: _this.layout.studentsListRegion,
                questionResponseModel: questionResponseModel,
                studentCollection: studentCollection,
                display_mode: _this.display_mode,
                timerObject: _this.timerObject
              });
            } else if (question_type === 'chorus') {
              return App.execute("show:single:question:chorus:options:app", {
                region: _this.layout.studentsListRegion,
                questionResponseModel: questionResponseModel,
                display_mode: _this.display_mode,
                timerObject: _this.timerObject
              });
            } else if (question_type === 'multiple_eval') {
              return App.execute("show:single:question:multiple:evaluation:app", {
                region: _this.layout.studentsListRegion,
                questionResponseModel: questionResponseModel,
                studentCollection: studentCollection,
                display_mode: _this.display_mode,
                timerObject: _this.timerObject,
                evaluationParams: contentPiece.get('grading_params')
              });
            }
          };
        })(this));
      };

      TeacherTeachingController.prototype._showTeacherTrainingFooter = function() {
        return App.execute("when:fetched", contentPiece, (function(_this) {
          return function() {
            var question_type;
            question_type = contentPiece.get('question_type');
            console.log(contentPiece.get('ID'));
            return App.execute('show:teacher:training:footer:app', {
              region: _this.layout.studentsListRegion,
              contentPiece: contentPiece,
              nextItemID: _this._getNextItemID()
            });
          };
        })(this));
      };

      TeacherTeachingController.prototype._getTakeSingleQuestionLayout = function() {
        return new SingleQuestionLayout;
      };

      return TeacherTeachingController;

    })(RegionController);
    return SingleQuestionLayout = (function(_super) {
      __extends(SingleQuestionLayout, _super);

      function SingleQuestionLayout() {
        return SingleQuestionLayout.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionLayout.prototype.template = '<div id="module-details-region"></div> <div id="question-details-region"></div> <div id="students-list-region"></div>';

      SingleQuestionLayout.prototype.regions = {
        moduleDetailsRegion: '#module-details-region',
        questionsDetailsRegion: '#question-details-region',
        studentsListRegion: '#students-list-region'
      };

      SingleQuestionLayout.prototype.onShow = function() {
        return $('.page-content').addClass('condensed expand-page');
      };

      return SingleQuestionLayout;

    })(Marionette.Layout);
  });
});