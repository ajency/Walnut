var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/class-report/class-report-layout', 'apps/quiz-reports/class-report/listing-controller', 'apps/quiz-reports/student-filter/student-filter-app', 'apps/quiz-reports/class-report/search-results-app'], function(App, RegionController) {
  return App.module("ClassReportApp", function(ClassReportApp, App) {
    ClassReportApp.Controller = (function(_super) {
      var students;

      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      students = null;

      Controller.prototype.initialize = function() {
        this.division = 0;
        this.divisionsCollection = App.request("get:divisions");
        return App.execute("when:fetched", this.divisionsCollection, (function(_this) {
          return function() {
            var class_id;
            _this.division = _this.divisionsCollection.first().get('id');
            class_id = _this.divisionsCollection.first().get('class_id');
            _this.textbooksCollection = App.request("get:textbooks", {
              'division': _this.division
            });
            return App.execute("when:fetched", _this.textbooksCollection, function() {
              var data, textbook;
              textbook = _this.textbooksCollection.first();
              data = {
                'post_status': 'any',
                'textbook': textbook.id,
                'division': _this.division
              };
              _this.contentModulesCollection = App.request("get:quizes", data);
              _this.selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse();
              _this.layout = _this._getContentPiecesLayout(students);
              return App.execute("when:fetched", [_this.contentModulesCollection, _this.textbooksCollection], function() {
                _this.show(_this.layout, {
                  loading: true
                });
                _this.listenTo(_this.layout, "show", function() {
                  App.execute("show:textbook:filters:app", {
                    region: _this.layout.filtersRegion,
                    collection: _this.contentModulesCollection,
                    textbooksCollection: _this.textbooksCollection,
                    selectedFilterParamsObject: _this.selectedFilterParamsObject,
                    divisionsCollection: _this.divisionsCollection,
                    dataType: 'quiz',
                    filters: ['divisions', 'textbooks', 'chapters']
                  });
                  students = App.request("get:students:by:division", _this.divisionsCollection.first().get('id'));
                  return App.execute("when:fetched", students, function() {
                    App.execute("show:student:filter:app", {
                      region: _this.layout.studentFilterRegion,
                      students: students
                    });
                    App.execute("show:list:quiz:report:app", {
                      region: _this.layout.allContentRegion,
                      contentModulesCollection: _this.contentModulesCollection,
                      textbooksCollection: _this.textbooksCollection
                    });
                    return new ClassReportApp.SearchResults.Controller({
                      region: _this.layout.searchResultsRegion,
                      textbooksCollection: _this.textbooksCollection,
                      selectedFilterParamsObject: _this.selectedFilterParamsObject
                    });
                  });
                });
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
                return _this.listenTo(_this.layout.allContentRegion, "show:quiz:report", function(quizModel) {
                  App.navigate("quiz-report/div/" + this.division + "/quiz/" + quizModel.id);
                  return App.execute("show:quiz:report:app", {
                    region: App.mainContentRegion,
                    division: this.divisionsCollection.get(this.division),
                    students: students,
                    quiz: quizModel
                  });
                });
              });
            });
          };
        })(this));
      };

      Controller.prototype._getContentPiecesLayout = function(students) {
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
