var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/take-module-item/student-list/student-list-app', 'apps/take-module-item/teacher-training-footer/training-footer-controller', 'apps/student-training-module/take-module/module-description/module-description-app', 'apps/take-module-item/chorus-options/chorus-options-app', 'apps/take-module-item/item-description/controller', 'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'], function(App, RegionController) {
  return App.module("StudentTrainingApp.TakeModule", function(TakeModule, App) {
    var SingleQuestionLayout, contentGroupModel, contentPiece, questionResponseCollection, questionResponseModel, questionsCollection, studentCollection;
    contentGroupModel = null;
    studentCollection = null;
    questionsCollection = null;
    questionResponseCollection = null;
    contentPiece = null;
    questionResponseModel = null;
    TakeModule.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showTeacherTrainingFooter = __bind(this._showTeacherTrainingFooter, this);
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._showQuestionDisplayView = __bind(this._showQuestionDisplayView, this);
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._getOrCreateModel = __bind(this._getOrCreateModel, this);
        this._startViewModuleApp = __bind(this._startViewModuleApp, this);
        this._saveQuestionResponse = __bind(this._saveQuestionResponse, this);
        this._gotoViewModule = __bind(this._gotoViewModule, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.division = opts.division, this.classID = opts.classID, this.moduleID = opts.moduleID, contentGroupModel = opts.contentGroupModel, questionsCollection = opts.questionsCollection, questionResponseCollection = opts.questionResponseCollection, contentPiece = opts.contentPiece, this.display_mode = opts.display_mode, studentCollection = opts.studentCollection;
        console.log('take student training module');
        App.leftNavRegion.reset();
        App.headerRegion.reset();
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
            if (contentPiece.get('content_type') === 'content_piece') {
              return _this._showTeacherTrainingFooter();
            } else {
              return _this._showStudentsListView(questionResponseModel);
            }
          };
        })(this));
        this.listenTo(this.layout, "show", this._showQuestionDisplayView(contentPiece));
        this.listenTo(this.layout.moduleDetailsRegion, "goto:previous:route", this._gotoViewModule);
        this.listenTo(this.layout.studentsListRegion, "goto:previous:route", this._gotoViewModule);
        this.listenTo(this.layout.moduleDetailsRegion, "goto:next:question", this._changeQuestion);
        return this.listenTo(this.layout.studentsListRegion, "goto:next:question", this._changeQuestion);
      };

      Controller.prototype._changeQuestion = function() {
        var nextItem;
        if (this.display_mode === 'class_mode') {
          this._saveQuestionResponse("completed");
        }
        nextItem = this._getNextItem();
        if (nextItem) {
          if (nextItem.type === 'quiz') {
            App.navigate("view-quiz/" + nextItem.id, true);
            return;
          }
          contentPiece = questionsCollection.get(nextItem.id);
          questionResponseModel = this._getOrCreateModel(nextItem.id);
          this._showQuestionDisplayView(contentPiece);
          this.layout.triggerMethod("change:content:piece", contentPiece);
          if (this.display_mode === 'training' || contentPiece.get('content_type') === 'content_piece') {
            return this._showTeacherTrainingFooter();
          }
        } else {
          return this._gotoViewModule();
        }
      };

      Controller.prototype._getNextItem = function() {
        var contentLayout, item, nextItem, pieceIndex;
        contentLayout = contentGroupModel.get('content_layout');
        item = _.filter(contentLayout, function(item) {
          if (item.type === 'content-piece' && parseInt(item.id) === contentPiece.id) {
            return item;
          }
        });
        pieceIndex = _.indexOf(contentLayout, item[0]);
        nextItem = contentLayout[pieceIndex + 1];
        if (!nextItem) {
          nextItem = false;
        }
        return nextItem;
      };

      Controller.prototype._gotoViewModule = function() {
        if (this.display_mode === 'class_mode' && questionResponseModel.get('status') !== 'completed') {
          return this._saveQuestionResponse("paused");
        } else {
          return this._startViewModuleApp();
        }
      };

      Controller.prototype._saveQuestionResponse = function(status) {
        var data, elapsedTime;
        elapsedTime = this.timerObject.request("get:elapsed:time");
        data = {
          time_taken: elapsedTime,
          status: status,
          end_date: status === 'completed' ? moment().format("YYYY-MM-DD") : void 0,
          teacher_name: App.request("get:user:data", "display_name")
        };
        questionResponseModel.set(data);
        questionResponseCollection.add(questionResponseModel);
        if (!moment(questionResponseModel.get('start_date')).isValid()) {
          data.start_date = moment().format("YYYY-MM-DD");
        }
        return questionResponseModel.save(data, {
          wait: true,
          success: (function(_this) {
            return function(model) {
              if (model.get('status') === 'paused') {
                return _this._startViewModuleApp();
              }
            };
          })(this)
        });
      };

      Controller.prototype._startViewModuleApp = function() {
        $.showHeaderAndLeftNav();
        return App.execute("show:single:module:app", {
          region: App.mainContentRegion,
          model: contentGroupModel,
          mode: this.display_mode,
          division: this.division,
          classID: this.classID,
          studentCollection: studentCollection,
          questionResponseCollection: questionResponseCollection
        });
      };

      Controller.prototype._getOrCreateModel = function(content_piece_id) {
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
          questionResponseModel.set('question_response', []);
          questionResponseModel.set(modelData);
          if (this.display_mode === 'class_mode') {
            questionResponseModel.save();
          }
        }
        return questionResponseModel;
      };

      Controller.prototype._showModuleDescriptionView = function() {
        return App.execute("when:fetched", contentGroupModel, (function(_this) {
          return function() {
            return App.execute("show:student:training:module:description", {
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

      Controller.prototype._showQuestionDisplayView = function(model) {
        if (!questionResponseModel) {
          this._getOrCreateModel(model.ID);
        }
        App.execute("show:top:panel", {
          region: this.layout.topPanelRegion,
          model: contentPiece,
          questionResponseModel: questionResponseModel,
          timerObject: this.timerObject,
          display_mode: this.display_mode,
          students: studentCollection,
          classID: this.classID
        });
        return App.execute("when:fetched", questionResponseModel, (function(_this) {
          return function() {
            if (contentPiece.get('question_type') === 'multiple_eval') {
              App.execute("show:single:question:multiple:evaluation:app", {
                region: _this.layout.contentBoardRegion,
                questionResponseModel: questionResponseModel,
                studentCollection: studentCollection,
                display_mode: _this.display_mode,
                timerObject: _this.timerObject,
                evaluationParams: contentPiece.get('grading_params')
              });
              return _this.layout.studentsListRegion.reset();
            } else {
              App.execute("show:content:board", {
                region: _this.layout.contentBoardRegion,
                model: contentPiece
              });
              return _this._showStudentsListView(questionResponseModel);
            }
          };
        })(this));
      };

      Controller.prototype._showStudentsListView = function(questionResponseModel) {
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

      Controller.prototype._showTeacherTrainingFooter = function() {
        return App.execute("when:fetched", contentPiece, (function(_this) {
          return function() {
            var nextItem, question_type;
            question_type = contentPiece.get('question_type');
            nextItem = _this._getNextItem();
            return App.execute('show:teacher:training:footer:app', {
              region: _this.layout.studentsListRegion,
              contentPiece: contentPiece,
              nextItemID: nextItem.id
            });
          };
        })(this));
      };

      Controller.prototype._getTakeSingleQuestionLayout = function() {
        return new SingleQuestionLayout({
          model: contentPiece
        });
      };

      return Controller;

    })(RegionController);
    SingleQuestionLayout = (function(_super) {
      __extends(SingleQuestionLayout, _super);

      function SingleQuestionLayout() {
        return SingleQuestionLayout.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionLayout.prototype.template = '<div id="module-details-region"></div> <div class="" id="top-panel"></div> <div class="container-grey m-b-5  qstnInfo "> <label class="form-label bold small-text muted no-margin inline" id="instructions-label"> </label> <span class="small-text" id="instructions"></span> </div> <div id="content-board"></div> <div id="students-list-region"></div>';

      SingleQuestionLayout.prototype.regions = {
        moduleDetailsRegion: '#module-details-region',
        contentBoardRegion: '#content-board',
        studentsListRegion: '#students-list-region',
        topPanelRegion: '#top-panel'
      };

      SingleQuestionLayout.prototype.onShow = function() {
        $('.page-content').addClass('condensed expand-page');
        return this.onChangeContentPiece(this.model);
      };

      SingleQuestionLayout.prototype.onChangeContentPiece = function(contentPiece) {
        var instructionsLabel;
        instructionsLabel = contentPiece.get('content_type') === 'content_piece' ? 'Procedure Summary' : 'Instructions';
        if (instructionsLabel) {
          this.$el.find('#instructions-label').html(instructionsLabel);
        }
        return this.$el.find('#instructions').html(contentPiece.get('instructions'));
      };

      return SingleQuestionLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("start:student:training:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new TakeModule.Controller(opt);
    });
  });
});
