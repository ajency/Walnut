var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/single-question/student-list/student-list-app', 'apps/teachers-dashboard/single-question/question-display/question-display-app', 'apps/teachers-dashboard/teacher-teaching-module/module-description/module-description-app', 'apps/teachers-dashboard/single-question/chorus-options/chorus-options-app'], function(App, RegionController) {
  return App.module("TeacherTeachingApp", function(View, App) {
    var SingleQuestionLayout, contentGroupModel, questionResponseCollection, questionsCollection, studentCollection;
    contentGroupModel = null;
    studentCollection = null;
    questionsCollection = null;
    questionResponseCollection = null;
    View.TeacherTeachingController = (function(_super) {
      __extends(TeacherTeachingController, _super);

      function TeacherTeachingController() {
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._getOrCreateModel = __bind(this._getOrCreateModel, this);
        return TeacherTeachingController.__super__.constructor.apply(this, arguments);
      }

      TeacherTeachingController.prototype.initialize = function(opts) {
        var classID, division, layout, textbookID;
        classID = opts.classID, division = opts.division, textbookID = opts.textbookID, this.moduleID = opts.moduleID, this.questionID = opts.questionID;
        contentGroupModel = App.request("get:content:group:by:id", this.moduleID);
        studentCollection = App.request("get:user:collection", {
          'role': 'student',
          'division': division
        });
        this.questionResponseModel = App.request("save:question:response", '');
        questionResponseCollection = App.request("get:question:response:collection", {
          'collection_id': this.moduleID,
          'division': this.division
        });
        App.execute("when:fetched", questionResponseCollection, (function(_this) {
          return function() {
            return _this._getOrCreateModel(_this.questionID);
          };
        })(this));
        this.contentPiece = App.request("get:content:piece:by:id", this.questionID);
        this.layout = layout = this._getTakeSingleQuestionLayout();
        this.show(layout, {
          loading: true,
          entities: [contentGroupModel, studentCollection, questionResponseCollection]
        });
        this.listenTo(layout, "show", this._showModuleDescriptionView);
        this.listenTo(layout, "show", this._showStudentsListView(this.questionResponseModel));
        App.SingleQuestionStudentsListApp.on('goto:next:question', this._changeQuestion);
        return App.SingleQuestionChorusOptionsApp.on('goto:next:question', this._changeQuestion);
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

      TeacherTeachingController.prototype._showStudentsListView = function(questionResponseModel) {
        return App.execute("when:fetched", this.contentPiece, (function(_this) {
          return function() {
            var question_type;
            question_type = _this.contentPiece.get('question_type');
            if (question_type === 'individual') {
              return App.execute("show:single:question:student:list:app", {
                region: _this.layout.studentsListRegion,
                questionResponseModel: questionResponseModel
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
