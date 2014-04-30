var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/teacher-teaching-module/student-list/student-list-app', 'apps/teachers-dashboard/teacher-teaching-module/question-display/question-display-app', 'apps/teachers-dashboard/teacher-teaching-module/module-description/module-description-app', 'apps/teachers-dashboard/teacher-teaching-module/chorus-options/chorus-options-app'], function(App, RegionController) {
  return App.module("TeacherTeachingApp", function(View, App) {
    var SingleQuestionLayout, contentGroupModel, contentPiece, questionResponseCollection, questionsCollection, studentCollection;
    contentGroupModel = null;
    studentCollection = null;
    questionsCollection = null;
    questionResponseCollection = null;
    contentPiece = null;
    View.TeacherTeachingController = (function(_super) {
      __extends(TeacherTeachingController, _super);

      function TeacherTeachingController() {
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._showQuestionDisplayView = __bind(this._showQuestionDisplayView, this);
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._getOrCreateModel = __bind(this._getOrCreateModel, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        this._showViews = __bind(this._showViews, this);
        return TeacherTeachingController.__super__.constructor.apply(this, arguments);
      }

      TeacherTeachingController.prototype.initialize = function(opts) {
        var classID, textbookID;
        classID = opts.classID, this.division = opts.division, textbookID = opts.textbookID, this.moduleID = opts.moduleID, this.questionID = opts.questionID;
        contentGroupModel = App.request("get:content:group:by:id", this.moduleID);
        studentCollection = App.request("get:user:collection", {
          'role': 'student',
          'division': this.division
        });
        questionsCollection = App.request("get:content:pieces:of:group", this.moduleID);
        this.questionResponseModel = App.request("save:question:response", '');
        questionResponseCollection = App.request("get:question:response:collection", {
          'collection_id': this.moduleID,
          'division': this.division
        });
        App.execute("when:fetched", questionResponseCollection, (function(_this) {
          return function() {
            _this._getOrCreateModel(_this.questionID);
            return _this._showViews();
          };
        })(this));
        return contentPiece = App.request("get:content:piece:by:id", this.questionID);
      };

      TeacherTeachingController.prototype._showViews = function() {
        var layout;
        this.layout = layout = this._getTakeSingleQuestionLayout();
        this.show(this.layout, {
          loading: true,
          entities: [contentGroupModel, studentCollection, questionsCollection, questionResponseCollection]
        });
        this.listenTo(this.layout, "show", this._showModuleDescriptionView);
        this.listenTo(this.layout, "show", this._showStudentsListView(this.questionResponseModel));
        this.listenTo(this.layout, "show", this._showQuestionDisplayView(contentPiece));
        return this.listenTo(this.layout.studentsListRegion, "goto:next:question", this._changeQuestion);
      };

      TeacherTeachingController.prototype._changeQuestion = function() {
        var contentPieces, pieceIndex;
        contentPieces = contentGroupModel.get('content_pieces');
        pieceIndex = _.indexOf(contentPieces, this.questionID);
        this.questionID = contentPieces[pieceIndex + 1];
        if (this.questionID) {
          console.log(this.questionID);
          contentPiece = questionsCollection.get(this.questionID);
          this.questionResponseModel = this._getOrCreateModel(this.questionID);
          this._showQuestionDisplayView(contentPiece);
          return this._showStudentsListView(this.questionResponseModel);
        } else {
          return console.log('end of questions');
        }
      };

      TeacherTeachingController.prototype._getOrCreateModel = function(content_piece_id) {
        this.questionResponseModel = questionResponseCollection.findWhere({
          'content_piece_id': content_piece_id.toString()
        });
        if (!this.questionResponseModel) {
          this.questionResponseModel = App.request("save:question:response", '');
          this.questionResponseModel.set({
            'collection_id': this.moduleID,
            'content_piece_id': this.questionID,
            'division': this.division
          });
        }
        return this.questionResponseModel;
      };

      TeacherTeachingController.prototype._showModuleDescriptionView = function() {
        return App.execute("when:fetched", contentGroupModel, (function(_this) {
          return function() {
            return App.execute("show:teacher:teaching:module:description", {
              region: _this.layout.moduleDetailsRegion,
              model: contentGroupModel
            });
          };
        })(this));
      };

      TeacherTeachingController.prototype._showQuestionDisplayView = function(model) {
        return App.execute("show:single:question:app", {
          region: this.layout.questionsDetailsRegion,
          model: model
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
                studentCollection: studentCollection
              });
            } else if (question_type === 'chorus') {
              return App.execute("show:single:question:chorus:options:app", {
                region: _this.layout.studentsListRegion,
                questionResponseModel: questionResponseModel
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

      return SingleQuestionLayout;

    })(Marionette.Layout);
  });
});
