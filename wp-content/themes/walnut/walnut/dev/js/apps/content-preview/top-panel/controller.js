var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/top-panel/view'], function(App, RegionController) {
  return App.module("ContentPreview.TopPanel", function(TopPanel, App, Backbone, Marionette, $, _) {
    TopPanel.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showView = __bind(this._showView, this);
        this.getResults = __bind(this.getResults, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var textbookID, textbook_termIDs;
        this.model = options.model, this.questionResponseModel = options.questionResponseModel, this.timerObject = options.timerObject, this.display_mode = options.display_mode, this.classID = options.classID, this.students = options.students;
        textbook_termIDs = _.flatten(this.model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        this.durationInSeconds = this.model.get('duration') * 60;
        textbookID = this.model.get('term_ids').textbook;
        this.textbookModel = App.request("get:textbook:by:id", textbookID);
        this.view = this._showView(this.model, this.questionResponseModel);
        App.execute("when:fetched", [this.textbookNames, this.textbookModel], (function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        if (this.display_mode === 'class_mode') {
          return this.timerObject.setHandler("get:elapsed:time", (function(_this) {
            return function() {
              var timeElapsed, timerTime;
              timerTime = $(_this.view.el).find('.cpTimer').TimeCircles().getTime();
              timeElapsed = _this.durationInSeconds - timerTime;
              return timeElapsed;
            };
          })(this));
        }
      };

      Controller.prototype.getResults = function() {
        var ans, answeredCorrectly, correct_answer, name, names, response, studID, student_names, _i, _j, _len, _len1;
        correct_answer = 'No One';
        names = [];
        response = this.questionResponseModel.get('question_response');
        if (this.model.get('question_type') === 'chorus') {
          if (response) {
            correct_answer = CHORUS_OPTIONS[response];
          }
        } else {
          for (_i = 0, _len = response.length; _i < _len; _i++) {
            studID = response[_i];
            answeredCorrectly = this.students.where({
              "ID": studID
            });
            for (_j = 0, _len1 = answeredCorrectly.length; _j < _len1; _j++) {
              ans = answeredCorrectly[_j];
              name = ans.get('display_name');
            }
            names.push(name);
          }
          if (_.size(names) > 0) {
            student_names = names.join(', ');
            correct_answer = _.size(names) + ' Students (' + student_names + ')';
          }
        }
        return correct_answer;
      };

      Controller.prototype._showView = function(model, questionResponseModel) {
        var terms;
        terms = model.get('term_ids');
        return new TopPanel.Views.TopPanelView({
          model: model,
          display_mode: this.display_mode,
          templateHelpers: {
            timeLeftOrElapsed: (function(_this) {
              return function() {
                var responseTime, timeTaken, timer;
                timeTaken = 0;
                if (questionResponseModel) {
                  responseTime = questionResponseModel.get('time_taken');
                }
                if (responseTime && responseTime !== 'NaN') {
                  timeTaken = responseTime;
                }
                return timer = _this.durationInSeconds - timeTaken;
              };
            })(this),
            getClass: (function(_this) {
              return function() {
                var classLabel, classes, classesArray, _i, _len;
                classesArray = [];
                classes = _this.textbookModel.get('classes');
                if (_.isArray(classes)) {
                  for (_i = 0, _len = classes.length; _i < _len; _i++) {
                    classLabel = classes[_i];
                    classesArray.push(CLASS_LABEL[classLabel]);
                  }
                  classesArray.join();
                }
                return classesArray;
              };
            })(this),
            getTextbookName: (function(_this) {
              return function() {
                var texbookName, textbook;
                textbook = _this.textbookNames.get(terms.textbook);
                if (textbook != null) {
                  return texbookName = textbook.get('name');
                }
              };
            })(this),
            getChapterName: (function(_this) {
              return function() {
                var chapter, chapterName;
                chapter = _this.textbookNames.get(terms.chapter);
                if (chapter != null) {
                  return chapterName = chapter.get('name');
                }
              };
            })(this),
            getSectionsNames: (function(_this) {
              return function() {
                var section, sectionName, sectionNames, sectionString, sections, term, _i, _len;
                sections = _.flatten(terms.sections);
                sectionString = '';
                sectionNames = [];
                if (sections) {
                  for (_i = 0, _len = sections.length; _i < _len; _i++) {
                    section = sections[_i];
                    term = _this.textbookNames.get(section);
                    if (term != null) {
                      sectionName = term.get('name');
                    }
                    sectionNames.push(sectionName);
                  }
                  return sectionString = sectionNames.join();
                }
              };
            })(this),
            getSubSectionsNames: (function(_this) {
              return function() {
                var sub, subSectionString, subsection, subsectionNames, subsections, _i, _len;
                subsections = _.flatten(terms.subsections);
                subSectionString = '';
                subsectionNames = [];
                if (subsections) {
                  for (_i = 0, _len = subsections.length; _i < _len; _i++) {
                    sub = subsections[_i];
                    subsection = _this.textbookNames.get(sub);
                    if (subsection != null) {
                      subsectionNames.push(subsection.get('name'));
                    }
                  }
                  return subSectionString = subsectionNames.join();
                }
              };
            })(this),
            getCompletedSummary: (function(_this) {
              return function() {
                var correct_answer, minutes, seconds, time_taken_string;
                if (questionResponseModel && questionResponseModel.get("status") === 'completed') {
                  minutes = parseInt(questionResponseModel.get("time_taken") / 60);
                  seconds = parseInt(questionResponseModel.get("time_taken") % 60);
                  time_taken_string = minutes + 'm ' + seconds + 's';
                  correct_answer = _this.getResults();
                  return '<div class="row"> <div class="col-xs-6"> <p> <label class="form-label bold small-text inline">Time Alloted:</label>' + model.get("duration") + 'mins<br> <label class="form-label bold small-text inline">Time Taken:</label>' + time_taken_string + '</p> </div> <div class="col-xs-6"> <div class="qstnStatus p-t-10"><i class="fa fa-check-circle"></i> Completed</div> </div> </div> <div class="row" id="correct-answer-col"> <div class="col-sm-12"> <p> <label class="form-label bold small-text inline">Correct Answer:</label>' + correct_answer + '</p> </div> </div> </div>';
                }
              };
            })(this)
          }
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:top:panel', function(options) {
      return new TopPanel.Controller(options);
    });
  });
});
