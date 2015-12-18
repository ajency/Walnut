var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'bootbox', 'apps/take-module-item/student-list/student-list-app', 'apps/take-module-item/teacher-training-footer/training-footer-controller', 'apps/student-training-module/take-module/module-description/module-description-app', 'apps/take-module-item/chorus-options/chorus-options-app', 'apps/student-training-module/take-module/item-description/controller', 'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'], function(App, RegionController, bootbox) {
  return App.module("StudentTrainingApp.TakeModule", function(TakeModule, App) {
    var SingleQuestionLayout, currentItem, questionResponseCollection, questionResponseModel, questionsCollection, studentCollection;
    studentCollection = null;
    questionsCollection = null;
    questionResponseCollection = null;
    currentItem = null;
    questionResponseModel = null;
    TakeModule.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._showQuiz = bind(this._showQuiz, this);
        this._showQuestionDisplayView = bind(this._showQuestionDisplayView, this);
        this._showModuleDescriptionView = bind(this._showModuleDescriptionView, this);
        this._getOrCreateModel = bind(this._getOrCreateModel, this);
        this._startViewModuleApp = bind(this._startViewModuleApp, this);
        this._saveQuestionResponse = bind(this._saveQuestionResponse, this);
        this._gotoViewModule = bind(this._gotoViewModule, this);
        this._changeQuestion = bind(this._changeQuestion, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.division = opts.division, this.classID = opts.classID, this.moduleID = opts.moduleID, this.contentGroupModel = opts.contentGroupModel, questionsCollection = opts.questionsCollection, currentItem = opts.currentItem, this.display_mode = opts.display_mode, studentCollection = opts.studentCollection;
        App.leftNavRegion.reset();
        App.headerRegion.reset();
        this.answerWreqrObject = new Backbone.Wreqr.RequestResponse();
        this.answerWreqrObject.displayAnswer = true;
        this.answerWreqrObject.multiplicationFactor = 1;
        this.answerModel = App.request("create:new:answer");
        questionResponseCollection = App.request("get:empty:question:response:collection");
        App.execute("when:fetched", [currentItem], (function(_this) {
          return function() {
            return _this._getOrCreateModel(currentItem.get('ID'));
          };
        })(this));
        this.layout = layout = this._getTakeSingleQuestionLayout();
        if (currentItem.get('type') === 'quiz') {
          this._showQuiz();
          return;
        }
        this.show(this.layout, {
          loading: true,
          entities: [this.contentGroupModel, studentCollection, questionsCollection, questionResponseCollection, questionResponseModel, currentItem]
        });
        this.timerObject = new Backbone.Wreqr.RequestResponse();
        this.listenTo(this.layout, "show", this._showModuleDescriptionView);
        this.listenTo(this.layout, "show", this._showQuestionDisplayView(currentItem));
        this.listenTo(this.layout.moduleDetailsRegion, "goto:previous:route", this._gotoViewModule);
        this.listenTo(this.layout.studentsListRegion, "goto:previous:route", this._gotoViewModule);
        this.listenTo(this.layout.moduleDetailsRegion, "goto:next:question", this._changeQuestion);
        this.listenTo(this.layout.studentsListRegion, "goto:next:question", this._changeQuestion);
        this.listenTo(this.layout.topPanelRegion, "top:panel:previous", (function(_this) {
          return function() {
            return _this._showPrevQuestion();
          };
        })(this));
        this.listenTo(this.layout.topPanelRegion, "top:panel:question:done", (function(_this) {
          return function() {
            return _this.layout.moduleDetailsRegion.trigger("top:panel:question:done");
          };
        })(this));
        this.listenTo(this.layout.topPanelRegion, "top:panel:check:last:question", (function(_this) {
          return function() {
            return _this.layout.moduleDetailsRegion.trigger("top:panel:check:last:question");
          };
        })(this));
        return this.listenTo(this.layout, "validate:answer", function() {
          this.answerWreqrObject.request("get:question:answer");
          return this.answerWreqrObject.request("submit:answer");
        });
      };

      Controller.prototype._changeQuestion = function() {
        var nextItem;
        nextItem = this._getNextItem();
        if (nextItem) {
          this._showQuestionDisplayView(nextItem);
          return this.layout.triggerMethod("change:content:piece", currentItem);
        } else {
          return this._gotoViewModule();
        }
      };

      Controller.prototype._getNextItem = function() {
        var contentLayout, item, nextItem, pieceIndex;
        contentLayout = this.contentGroupModel.get('content_layout');
        item = _.filter(contentLayout, function(item) {
          if (item.type === currentItem.get('post_type') && parseInt(item.id) === currentItem.id) {
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

      Controller.prototype._showPrevQuestion = function() {
        var prevItem;
        prevItem = this._getPrevItem();
        if (prevItem) {
          this._showQuestionDisplayView(prevItem, {
            direction: 'rtl'
          });
          return this.layout.triggerMethod("change:content:piece", currentItem);
        } else {
          return this._gotoViewModule();
        }
      };

      Controller.prototype._getPrevItem = function() {
        var contentLayout, item, pieceIndex, prevItem;
        contentLayout = this.contentGroupModel.get('content_layout');
        item = _.filter(contentLayout, function(item) {
          if (item.type === currentItem.get('post_type') && parseInt(item.id) === currentItem.id) {
            return item;
          }
        });
        pieceIndex = _.indexOf(contentLayout, item[0]);
        prevItem = contentLayout[pieceIndex - 1];
        if (!prevItem) {
          prevItem = false;
        }
        return prevItem;
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
        return App.execute("show:student:training:module", {
          region: App.mainContentRegion,
          model: this.contentGroupModel
        });
      };

      Controller.prototype._getOrCreateModel = function(content_piece_id) {
        var modelData;
        questionResponseModel = questionResponseCollection.findWhere({
          'content_piece_id': content_piece_id
        });
        if (!questionResponseModel) {
          modelData = {
            collection_id: this.contentGroupModel.get('id'),
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
        return App.execute("when:fetched", this.contentGroupModel, (function(_this) {
          return function() {
            return App.execute("show:student:training:module:description", {
              region: _this.layout.moduleDetailsRegion,
              model: _this.contentGroupModel,
              timerObject: _this.timerObject,
              questionResponseModel: questionResponseModel,
              questionResponseCollection: questionResponseCollection,
              display_mode: _this.display_mode
            });
          };
        })(this));
      };

      Controller.prototype._showQuestionDisplayView = function(model, direction) {
        var currentItemType;
        if (direction == null) {
          direction = 'ltr';
        }
        if (model instanceof Backbone.Model) {
          currentItem = model;
        } else {
          currentItem = _.first(questionsCollection.filter(function(item) {
            var modelType;
            modelType = model.type === 'quiz' ? 'type' : 'post_type';
            if (item.id === parseInt(model.id) && item.get(modelType) === model.type) {
              return item;
            }
          }));
        }
        currentItemType = currentItem.get('type');
        if ((currentItemType != null) && currentItem.get('type') === 'quiz') {
          this._showQuiz();
          return;
        }
        questionResponseModel = this._getOrCreateModel(currentItem.id);
        if (!questionResponseModel) {
          this._getOrCreateModel(currentItem.ID);
        }
        App.execute("show:student:top:panel", {
          region: this.layout.topPanelRegion,
          model: currentItem,
          questionResponseModel: questionResponseModel,
          timerObject: this.timerObject,
          display_mode: this.display_mode,
          students: studentCollection,
          classID: this.classID
        });
        return App.execute("when:fetched", questionResponseModel, (function(_this) {
          return function() {
            var quizModel;
            if (currentItem.get('content_type') === 'student_question') {
              quizModel = App.request("create:dummy:quiz:module", currentItem.id);
            }
            return App.execute("show:content:board", {
              region: _this.layout.contentBoardRegion,
              model: currentItem,
              direction: direction,
              answerWreqrObject: _this.answerWreqrObject,
              quizModel: quizModel ? quizModel : void 0
            });
          };
        })(this));
      };

      Controller.prototype._showQuiz = function() {
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: currentItem,
          studentTrainingModule: this.contentGroupModel
        });
      };

      Controller.prototype._getTakeSingleQuestionLayout = function() {
        return new SingleQuestionLayout({
          model: currentItem
        });
      };

      return Controller;

    })(RegionController);
    SingleQuestionLayout = (function(superClass) {
      extend(SingleQuestionLayout, superClass);

      function SingleQuestionLayout() {
        return SingleQuestionLayout.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionLayout.prototype.template = '<div class="lesson"> <div id="module-details-region"></div> <div class="" id="top-panel"></div> <div class="container-grey m-b-5  qstnInfo "> <label class="form-label bold small-text muted no-margin inline" id="instructions-label"> </label> <span class="small-text" id="instructions"></span> </div> <div id="content-board"> </div> <div class="container-grey m-b-10 p-l-10 p-r-10 p-t-10 p-b-10 h-center quizActions none"> <button type="button" id="submit-question" class="btn btn-success pull-right"> Submit <i class="fa fa-forward"></i> </button> <div class="text-center"> {{#show_hint}} <button type="button" id="show-hint" class="btn btn-default btn-sm btn-small m-r-10"> <i class="fa fa-lightbulb-o"></i> Hint </button> {{/show_hint}} </div> <div class="clearfix"></div> </div> </div>';

      SingleQuestionLayout.prototype.regions = {
        moduleDetailsRegion: '#module-details-region',
        contentBoardRegion: '#content-board',
        studentsListRegion: '#students-list-region',
        topPanelRegion: '#top-panel'
      };

      SingleQuestionLayout.prototype.events = function() {
        return {
          'click #submit-question': function(e) {
            this.$el.find('.quizActions').addClass('none');
            return this.trigger("validate:answer");
          },
          'click #skip-question': function() {
            return this.trigger("skip:question");
          },
          'click #show-hint': function() {
            bootbox.alert(this.model.get('hint'));
            return this.trigger('show:hint:dialog');
          }
        };
      };

      SingleQuestionLayout.prototype.mixinTemplateHelpers = function(data) {
        if (_.trim(data.hint)) {
          data.show_hint = true;
        }
        return data;
      };

      SingleQuestionLayout.prototype.onShow = function() {
        $('.page-content').addClass('condensed expand-page');
        return this.onChangeContentPiece(this.model);
      };

      SingleQuestionLayout.prototype.onChangeContentPiece = function(currentItem) {
        var instructionsLabel;
        instructionsLabel = currentItem.get('content_type') === 'content_piece' ? 'Procedure Summary' : 'Instructions';
        if (currentItem.get('content_type') === 'student_question') {
          this.$el.find('.quizActions').removeClass('none');
        } else {
          this.$el.find('.quizActions').addClass('none');
        }
        if (instructionsLabel) {
          this.$el.find('#instructions-label').html(instructionsLabel);
        }
        return this.$el.find('#instructions').html(currentItem.get('instructions'));
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
