var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/quiz-modules/view-single-quiz/layout', 'apps/quiz-modules/view-single-quiz/quiz-description/quiz-description-app', 'apps/quiz-modules/view-single-quiz/content-display/content-display-app', 'apps/quiz-modules/view-single-quiz/attempts/app', 'apps/quiz-modules/take-quiz-module/take-quiz-app'], function(App, RegionController) {
  return App.module("QuizModuleApp.ViewQuiz", function(ViewQuiz, App) {
    ViewQuiz.Controller = (function(superClass) {
      var display_mode, questionsCollection, quizModel, quizModelNew, quizResponseSummary, quizResponseSummaryCollection, studentModel, studentTrainingModule;

      extend(Controller, superClass);

      function Controller() {
        this._showAttemptsRegion = bind(this._showAttemptsRegion, this);
        this.showQuizViews = bind(this.showQuizViews, this);
        this.startQuiz = bind(this.startQuiz, this);
        this._fetchQuestionResponseCollection = bind(this._fetchQuestionResponseCollection, this);
        this._fetchQuizResponseSummary = bind(this._fetchQuizResponseSummary, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      quizModel = null;

      quizModelNew = null;

      questionsCollection = null;

      quizResponseSummary = null;

      quizResponseSummaryCollection = null;

      studentModel = null;

      studentTrainingModule = null;

      display_mode = null;

      Controller.prototype.initialize = function(opts) {
        var d_mode, fetchQuestionResponseCollection, quiz_id;
        $(window).off('beforeunload');
        quiz_id = opts.quiz_id, quizModel = opts.quizModel, questionsCollection = opts.questionsCollection, this.questionResponseCollection = opts.questionResponseCollection, studentTrainingModule = opts.studentTrainingModule;
        quizResponseSummary = opts.quizResponseSummary, this.quizResponseSummaryCollection = opts.quizResponseSummaryCollection, display_mode = opts.display_mode, this.student = opts.student, d_mode = opts.d_mode;
        if (!quizModel) {
          quizModel = App.request("get:quiz:by:id", quiz_id);
        }
        if (d_mode) {
          display_mode = d_mode;
        }
        $.showHeaderAndLeftNav();
        this.fetchQuizResponseSummary = this._fetchQuizResponseSummary();
        fetchQuestionResponseCollection = this._fetchQuestionResponseCollection();
        return fetchQuestionResponseCollection.done((function(_this) {
          return function() {
            return App.execute("when:fetched", quizModel, function() {
              var textbook_termIDs;
              if (quizModel.get('code') === 'ERROR') {
                App.execute("show:no:permissions:app", {
                  region: App.mainContentRegion,
                  error_header: 'Unauthorized Quiz',
                  error_msg: quizModel.get('error_msg')
                });
                return false;
              }
              if (display_mode !== 'quiz_report') {
                display_mode = quizResponseSummary.get('status') === 'completed' ? 'replay' : 'class_mode';
              }
              textbook_termIDs = _.flatten(quizModel.get('term_ids'));
              _this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
              if (!_.isEmpty(quizResponseSummary.get('questions_order'))) {
                quizModel.set('content_pieces', quizResponseSummary.get('questions_order'));
              }
              if (!questionsCollection) {
                questionsCollection = App.request("get:content:pieces:by:ids", quizModel.get('content_pieces'));
                App.execute("when:fetched", questionsCollection, function() {
                  _this._setMarks();
                  return _this._randomizeOrder();
                });
              }
              return App.execute("when:fetched", [questionsCollection, _this.textbookNames], function() {
                var getStudentModel;
                getStudentModel = _this._getStudent();
                return getStudentModel.done(function() {
                  var layout;
                  _this.layout = layout = _this._getQuizViewLayout();
                  _this.show(_this.layout, {
                    loading: true
                  });
                  _this.listenTo(_this.layout, 'show', function() {
                    _this.showQuizViews();
                    return _this._showAttemptsRegion();
                  });
                  _this.listenTo(_this.layout, 'goto:next:item:student:training:module', function() {
                    var data;
                    data = {
                      type: 'quiz',
                      id: quizModel.id
                    };
                    return App.vent.trigger("next:item:student:training:module", data);
                  });
                  _this.listenTo(_this.layout.quizDetailsRegion, 'start:quiz:module', _this.startQuiz);
                  _this.listenTo(_this.layout.quizDetailsRegion, 'try:again', _this._tryAgain);
                  return _this.listenTo(_this.layout.attemptsRegion, 'view:summary', _this._viewSummary);
                });
              });
            });
          };
        })(this));
      };

      Controller.prototype._setMarks = function() {
        var actualMarks, multiplicationFactor;
        actualMarks = 0;
        questionsCollection.each(function(m) {
          if (m.get('marks')) {
            return actualMarks += m.get('marks');
          }
        });
        if (actualMarks > 0) {
          multiplicationFactor = quizModel.get('marks') / actualMarks;
        }
        if (multiplicationFactor) {
          return questionsCollection.each(function(m) {
            return m.setMarks(multiplicationFactor);
          });
        }
      };

      Controller.prototype._randomizeOrder = function() {
        if (quizResponseSummary.isNew() && quizModel.get('permissions').randomize) {
          questionsCollection.each(function(e) {
            return e.unset('order');
          });
          questionsCollection.reset(questionsCollection.shuffle());
          return quizModel.set('content_pieces', questionsCollection.pluck('ID'));
        }
      };

      Controller.prototype._getStudent = function() {
        this.defer = $.Deferred();
        if (this.student) {
          if (this.student instanceof Backbone.Model) {
            studentModel = this.student;
            this.defer.resolve();
          } else {
            studentModel = App.request("get:user:by:id", this.student);
            App.execute("when:fetched", studentModel, (function(_this) {
              return function() {
                return _this.defer.resolve();
              };
            })(this));
          }
        } else {
          this.defer.resolve();
        }
        return this.defer.promise();
      };

      Controller.prototype._tryAgain = function() {
        if (!quizModelNew) {
          quizModelNew = App.request("get:quiz:by:id", quizModel.get('id'));
        }
        return App.execute("when:fetched", quizModelNew, (function(_this) {
          return function() {
            console.log(quizModel);
            quizModel = quizModelNew;
            if (quizModel.get('quiz_type') !== 'practice') {
              return false;
            }
            _this.questionResponseCollection = null;
            quizModel.set({
              'attempts': parseInt(quizModel.get('attempts')) + 1
            });
            _this.summary_data = {
              'collection_id': quizModel.get('id'),
              'student_id': App.request("get:loggedin:user:id"),
              'taken_on': moment().format("YYYY-MM-DD")
            };
            quizResponseSummary = App.request("create:quiz:response:summary", _this.summary_data);
            quizResponseSummaryCollection.add(quizResponseSummary);
            questionsCollection = App.request("get:content:pieces:by:ids", quizModelNew.get('content_pieces'));
            return App.execute("when:fetched", questionsCollection, function() {
              _this._setMarks();
              display_mode = 'class_mode';
              _this._randomizeOrder();
              return _this.startQuiz();
            });
          };
        })(this));
      };

      Controller.prototype._viewSummary = function(summary_id) {
        var fetchResponses;
        quizResponseSummary = quizResponseSummaryCollection.get(summary_id);
        this.questionResponseCollection = null;
        fetchResponses = this._fetchQuestionResponseCollection();
        return fetchResponses.done((function(_this) {
          return function() {
            var i, len, m, ref, reorderQuestions;
            if (!_.isEmpty(quizResponseSummary.get('questions_order'))) {
              questionsCollection.each(function(e) {
                return e.unset('order');
              });
              quizModel.set('content_pieces', quizResponseSummary.get('questions_order'));
              reorderQuestions = [];
              ref = quizModel.get('content_pieces');
              for (i = 0, len = ref.length; i < len; i++) {
                m = ref[i];
                reorderQuestions.push(questionsCollection.get(m));
              }
              questionsCollection.reset(reorderQuestions);
            }
            _this.layout.$el.find('#quiz-details-region,#content-display-region').hide();
            _this.layout.$el.find('#quiz-details-region,#content-display-region').fadeIn('slow');
            _this.showQuizViews();
            _this.layout.attemptsRegion.$el.find('.view-summary i').removeClass('fa fa-spin fa-spinner');
            return _this._scrolltoQuizDetailsRegion();
          };
        })(this));
      };

      Controller.prototype._scrolltoQuizDetailsRegion = function() {
        var top;
        top = this.layout.quizDetailsRegion.$el.offset().top;
        top = top - 70;
        return $('html,body').animate({
          scrollTop: top
        }, 'slow');
      };

      Controller.prototype._fetchQuizResponseSummary = function() {
        var defer;
        defer = $.Deferred();
        if (this.quizResponseSummaryCollection) {
          quizResponseSummaryCollection = this.quizResponseSummaryCollection;
        }
        if (quizResponseSummary) {
          defer.resolve();
          return defer.promise();
        }
        this.summary_data = {
          'collection_id': quizModel.get('id'),
          'student_id': App.request("get:loggedin:user:id"),
          'taken_on': moment().format("YYYY-MM-DD")
        };
        quizResponseSummaryCollection = App.request("get:quiz:response:summary", this.summary_data);
        App.execute("when:fetched", quizResponseSummaryCollection, (function(_this) {
          return function() {
            if (quizResponseSummaryCollection.length > 0) {
              quizResponseSummary = quizResponseSummaryCollection.last();
              return defer.resolve();
            } else {
              quizResponseSummary = App.request("create:quiz:response:summary", _this.summary_data);
              quizResponseSummaryCollection.add(quizResponseSummary);
              return defer.resolve();
            }
          };
        })(this));
        return defer.promise();
      };

      Controller.prototype._fetchQuestionResponseCollection = function() {
        var defer;
        defer = $.Deferred();
        this.fetchQuizResponseSummary.done((function(_this) {
          return function() {
            if (!_this.questionResponseCollection && !quizResponseSummary.isNew()) {
              _this.questionResponseCollection = App.request("get:quiz:question:response:collection", {
                'summary_id': quizResponseSummary.get('summary_id')
              });
              return App.execute("when:fetched", _this.questionResponseCollection, function() {
                return defer.resolve();
              });
            } else {
              return defer.resolve();
            }
          };
        })(this));
        return defer.promise();
      };

      Controller.prototype.startQuiz = function() {
        return App.execute("start:take:quiz:app", {
          region: App.mainContentRegion,
          quizModel: quizModel,
          quizResponseSummary: quizResponseSummary,
          questionsCollection: questionsCollection,
          display_mode: display_mode,
          questionResponseCollection: this.questionResponseCollection,
          textbookNames: this.textbookNames,
          studentTrainingModule: studentTrainingModule
        });
      };

      Controller.prototype.showQuizViews = function() {
        App.execute("show:view:quiz:detailsapp", {
          region: this.layout.quizDetailsRegion,
          model: quizModel,
          display_mode: display_mode,
          quizResponseSummary: quizResponseSummary,
          textbookNames: this.textbookNames,
          studentTrainingModule: studentTrainingModule
        });
        if (quizResponseSummary.get('status') === 'completed') {
          return App.execute("show:quiz:items:app", {
            region: this.layout.contentDisplayRegion,
            model: quizModel,
            groupContentCollection: questionsCollection,
            questionResponseCollection: this.questionResponseCollection
          });
        }
      };

      Controller.prototype._showAttemptsRegion = function() {
        if (quizModel.get('quiz_type') === 'practice' && quizModel.get('attempts') > 0) {
          return App.execute("show:quiz:attempts:app", {
            region: this.layout.attemptsRegion,
            model: quizModel,
            quizResponseSummaryCollection: quizResponseSummaryCollection
          });
        }
      };

      Controller.prototype._getQuizViewLayout = function() {
        return new ViewQuiz.LayoutView.QuizViewLayout({
          model: quizModel,
          display_mode: display_mode,
          student: studentModel,
          studentTrainingModule: studentTrainingModule
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:single:quiz:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ViewQuiz.Controller(opt);
    });
  });
});
