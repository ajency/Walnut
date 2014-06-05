var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/teacher-teaching-module/student-list/student-list-app', 'apps/teachers-dashboard/teacher-teaching-module/module-description/module-description-app', 'apps/teachers-dashboard/teacher-teaching-module/chorus-options/chorus-options-app'], function(App, RegionController) {
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
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._showQuestionDisplayView = __bind(this._showQuestionDisplayView, this);
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._getOrCreateModel = __bind(this._getOrCreateModel, this);
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
        if (this.display_mode !== 'training') {
          this.listenTo(this.layout, "show", this._showStudentsListView(questionResponseModel));
        }
        this.listenTo(this.layout, "show", this._showQuestionDisplayView(contentPiece));
        this.listenTo(this.layout.moduleDetailsRegion, "goto:previous:route", this._gotoPreviousRoute);
        this.listenTo(this.layout.studentsListRegion, "goto:previous:route", this._gotoPreviousRoute);
        return this.listenTo(this.layout.studentsListRegion, "goto:next:question", this._changeQuestion);
      };

      TeacherTeachingController.prototype._changeQuestion = function(current_question_id) {
        var contentPieces, elapsedTime, nextQuestion, pieceIndex;
        elapsedTime = this.timerObject.request("get:elapsed:time");
        questionResponseModel.set({
          time_taken: elapsedTime,
          status: 'completed'
        });
        questionResponseModel.save();
        current_question_id = parseInt(current_question_id);
        contentPieces = contentGroupModel.get('content_pieces');
        contentPieces = _.map(contentPieces, function(m) {
          return parseInt(m);
        });
        pieceIndex = _.indexOf(contentPieces, current_question_id);
        nextQuestion = parseInt(contentPieces[pieceIndex + 1]);
        if (nextQuestion) {
          contentPiece = questionsCollection.get(nextQuestion);
          questionResponseModel = this._getOrCreateModel(nextQuestion);
          this._showQuestionDisplayView(contentPiece);
          if (this.display_mode !== 'training') {
            return this._showStudentsListView(questionResponseModel);
          }
        } else {
          return this._gotoPreviousRoute();
        }
      };

      TeacherTeachingController.prototype._gotoPreviousRoute = function() {
        var currRoute, elapsedTime, newRoute, removeStr;
        if (this.display_mode === 'class_mode') {
          if (questionResponseModel.get('status') !== 'completed') {
            elapsedTime = this.timerObject.request("get:elapsed:time");
            questionResponseModel.set({
              time_taken: elapsedTime,
              status: 'paused'
            });
            questionResponseModel.save();
          }
        }
        currRoute = App.getCurrentRoute();
        removeStr = _.str.strRightBack(currRoute, '/');
        newRoute = _.str.rtrim(currRoute, removeStr + '/');
        App.navigate(newRoute, true);
        App.execute("show:headerapp", {
          region: App.headerRegion
        });
        return App.execute("show:leftnavapp", {
          region: App.leftNavRegion
        });
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
            }
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
