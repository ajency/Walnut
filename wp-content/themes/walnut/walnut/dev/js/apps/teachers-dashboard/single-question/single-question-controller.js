var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/single-question/student-list/student-list-app', 'apps/teachers-dashboard/single-question/question-display/question-display-app', 'apps/teachers-dashboard/single-question/module-description-view', 'apps/teachers-dashboard/single-question/chorus-options/chorus-options-app'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.SingleGroupApp", function(View, App) {
    var SingleQuestionLayout;
    View.SingleQuestionController = (function(_super) {
      __extends(SingleQuestionController, _super);

      function SingleQuestionController() {
        this._showQuestionDisplayView = __bind(this._showQuestionDisplayView, this);
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        this._getOrCreateModel = __bind(this._getOrCreateModel, this);
        this._showViews = __bind(this._showViews, this);
        return SingleQuestionController.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionController.prototype.initialize = function(opts) {
        var classID, textbookID;
        classID = opts.classID, this.division = opts.division;
        textbookID = opts.textbookID;
        this.moduleID = opts.moduleID;
        this.questionID = opts.questionID;
        this.textbook = App.request("get:textbook:by:id", textbookID);
        this.textbookName = '';
        App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            return _this.textbookName = _this.textbook.get('name');
          };
        })(this));
        this.contentGroupModel = App.request("get:content:group:by:id", this.moduleID);
        this.contentPiece = App.request("get:content:piece:by:id", this.questionID);
        App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            return App.execute("when:fetched", _this.contentGroupModel, function() {
              return App.execute("when:fetched", _this.contentPiece, function() {
                var breadcrumb_items, moduleName, questionTitle;
                moduleName = _this.contentGroupModel.get('name');
                questionTitle = _this.contentPiece.get('post_title');
                breadcrumb_items = {
                  'items': [
                    {
                      'label': 'Dashboard',
                      'link': '#teachers/dashboard'
                    }, {
                      'label': 'Take Class',
                      'link': '#teachers/take-class/' + classID + '/' + _this.division
                    }, {
                      'label': _this.textbookName,
                      'link': '#teachers/take-class/' + classID + '/' + _this.division + '/textbook/' + textbookID
                    }, {
                      'label': moduleName,
                      'link': '#teachers/take-class/' + classID + '/' + _this.division + '/textbook/' + textbookID + '/module/' + _this.moduleID
                    }, {
                      'label': questionTitle,
                      'link': 'javascript:;',
                      'active': 'active'
                    }
                  ]
                };
                return App.execute("update:breadcrumb:model", breadcrumb_items);
              });
            });
          };
        })(this));
        this.questionResponseModel = App.request("save:question:response", '');
        this.questionResponseCollection = App.request("get:question:response:collection", {
          'collection_id': this.moduleID,
          'division': this.division
        });
        App.execute("when:fetched", this.questionResponseCollection, (function(_this) {
          return function() {
            _this._getOrCreateModel(_this.questionID);
            return _this._showViews();
          };
        })(this));
        App.SingleQuestionStudentsListApp.on('goto:next:question', this._changeQuestion);
        return App.SingleQuestionChorusOptionsApp.on('goto:next:question', this._changeQuestion);
      };

      SingleQuestionController.prototype._showViews = function() {
        var layout;
        this.layout = layout = this._getTakeSingleQuestionLayout();
        this.show(layout, {
          loading: true,
          entities: [this.contentGroupModel]
        });
        this.listenTo(layout, "show", this._showModuleDescriptionView);
        this.listenTo(layout, "show", this._showStudentsListView(this.questionResponseModel));
        return this.listenTo(layout, "show", this._showQuestionDisplayView(this.contentPiece));
      };

      SingleQuestionController.prototype._getOrCreateModel = function(content_piece_id) {
        this.questionResponseModel = this.questionResponseCollection.findWhere({
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

      SingleQuestionController.prototype._changeQuestion = function() {
        var contentPieces, pieceIndex;
        contentPieces = this.contentGroupModel.get('content_pieces');
        pieceIndex = _.indexOf(contentPieces, this.questionID);
        this.questionID = contentPieces[pieceIndex + 1];
        if (this.questionID) {
          this.contentPiece = App.request("get:content:piece:by:id", this.questionID);
          this.questionResponseModel = this._getOrCreateModel(this.questionID);
          this._showQuestionDisplayView(this.contentPiece);
          return this._showStudentsListView(this.questionResponseModel);
        }
      };

      SingleQuestionController.prototype._showModuleDescriptionView = function() {
        return App.execute("when:fetched", this.contentGroupModel, (function(_this) {
          return function() {
            var moduleDescriptionView;
            moduleDescriptionView = new View.ModuleDescription.Description({
              model: _this.contentGroupModel,
              templateHelpers: {
                showTextbookName: function() {
                  return _this.textbookName;
                }
              }
            });
            return _this.layout.moduleDetailsRegion.show(moduleDescriptionView);
          };
        })(this));
      };

      SingleQuestionController.prototype._showStudentsListView = function(questionResponseModel) {
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

      SingleQuestionController.prototype._showQuestionDisplayView = function(model) {
        return App.execute("show:single:question:app", {
          region: this.layout.questionsDetailsRegion,
          model: model
        });
      };

      SingleQuestionController.prototype._getTakeSingleQuestionLayout = function() {
        return new SingleQuestionLayout;
      };

      return SingleQuestionController;

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
