var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/class-report/class-report-layout', 'apps/quiz-reports/class-report/modules-listing/controller', 'apps/quiz-reports/student-filter/student-filter-app', 'apps/quiz-reports/class-report/search-results-app', 'apps/quiz-reports/class-report/schedule-quiz-app'], function(App, RegionController) {
  return App.module("ClassReportApp", function(ClassReportApp, App) {
    ClassReportApp.Controller = (function(_super) {
      var divisionsCollection, quizzes, students, textbooksCollection;

      __extends(Controller, _super);

      function Controller() {
        this._showViews = __bind(this._showViews, this);
        this._fetchQuizzes = __bind(this._fetchQuizzes, this);
        this._fetchTextbooks = __bind(this._fetchTextbooks, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      students = null;

      textbooksCollection = null;

      divisionsCollection = null;

      quizzes = null;

      Controller.prototype.initialize = function() {
        this.division = 0;
        divisionsCollection = App.request("get:divisions");
        return App.execute("when:fetched", divisionsCollection, this._fetchTextbooks);
      };

      Controller.prototype._fetchTextbooks = function() {
        var class_id, division;
        class_id = divisionsCollection.first().get('class_id');
        division = divisionsCollection.first().get('id');
        textbooksCollection = App.request("get:textbooks", {
          'class_id': class_id
        });
        return App.execute("when:fetched", textbooksCollection, (function(_this) {
          return function() {
            return App.execute("when:fetched", textbooksCollection, _this._fetchQuizzes);
          };
        })(this));
      };

      Controller.prototype._fetchQuizzes = function() {
        var data, textbook;
        textbook = textbooksCollection.first();
        this.division = divisionsCollection.first().get('id');
        data = {
          'textbook': textbook.id,
          'division': this.division
        };
        quizzes = App.request("get:quizes", data);
        students = App.request("get:students:by:division", divisionsCollection.first().get('id'));
        return App.execute("when:fetched", [quizzes, students], this._showViews);
      };

      Controller.prototype._showViews = function() {
        this.selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse();
        this.layout = this._getContentPiecesLayout();
        App.execute("when:fetched", students, (function(_this) {
          return function() {
            return _this.show(_this.layout, {
              loading: true
            });
          };
        })(this));
        return this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            App.execute("show:textbook:filters:app", {
              region: _this.layout.filtersRegion,
              collection: quizzes,
              textbooksCollection: textbooksCollection,
              selectedFilterParamsObject: _this.selectedFilterParamsObject,
              divisionsCollection: divisionsCollection,
              dataType: 'quiz',
              filters: ['divisions', 'textbooks', 'chapters']
            }, App.execute("when:fetched", students, function() {
              App.execute("show:student:filter:app", {
                region: _this.layout.studentFilterRegion,
                students: students
              });
              App.execute("show:list:quiz:report:app", {
                region: _this.layout.allContentRegion,
                contentModulesCollection: quizzes,
                textbooksCollection: textbooksCollection
              });
              return new ClassReportApp.SearchResults.Controller({
                region: _this.layout.searchResultsRegion,
                textbooksCollection: textbooksCollection,
                selectedFilterParamsObject: _this.selectedFilterParamsObject
              });
            }));
            _this.listenTo(_this.layout.filtersRegion, "update:pager", function() {
              return _this.layout.allContentRegion.trigger("update:pager");
            });
            _this.listenTo(_this.layout.filtersRegion, "division:changed", function(division) {
              _this.division = division;
              students = App.request("get:students:by:division", division);
              return App.execute("when:fetched", students, function() {
                _this.layout.studentFilterRegion.trigger('change:division', students);
                return _this.layout.triggerMethod('change:division', students);
              });
            });
            _this.listenTo(_this.layout.allContentRegion, "show:quiz:report", _this._showQuiz);
            _this.listenTo(_this.layout.searchResultsRegion, "show:quiz:report", _this._showQuiz);
            _this.listenTo(_this.layout.allContentRegion, "save:communications", function(data) {
              data = {
                component: 'quiz',
                communication_type: 'quiz_completed_parent_mail',
                communication_mode: data.communication_mode,
                additional_data: {
                  quiz_ids: data.quizIDs,
                  division: _this.division
                }
              };
              return App.request("save:communications", data);
            });
            _this.listenTo(_this.layout.allContentRegion, "schedule:quiz", _this._showScheduleQuizApp);
            return _this.listenTo(_this.layout.allContentRegion, "clear:schedule", function(quizModel) {
              var clearSchedule;
              clearSchedule = App.request("clear:quiz:schedule", quizModel.id, _this.division);
              return clearSchedule.done(function(response) {
                if (response.code === 'OK') {
                  return quizModel.set({
                    'schedule': false
                  });
                }
              });
            });
          };
        })(this));
      };

      Controller.prototype._showScheduleQuizApp = function(quizModel) {
        return App.execute("show:schedule:quiz:popup", {
          region: App.dialogRegion,
          division: this.division,
          quizModel: quizModel
        });
      };

      Controller.prototype._showQuiz = function(quizModel) {
        App.navigate("quiz-report/div/" + this.division + "/quiz/" + quizModel.id);
        return App.execute("show:quiz:report:app", {
          region: App.mainContentRegion,
          division: divisionsCollection.get(this.division),
          students: students,
          quiz: quizModel
        });
      };

      Controller.prototype._getContentPiecesLayout = function() {
        return new ClassReportApp.Layout.ContentPiecesLayout({
          students: students
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:class:report:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ClassReportApp.Controller(opt);
    });
  });
});