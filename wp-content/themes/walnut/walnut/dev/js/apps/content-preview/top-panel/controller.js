var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/top-panel/view'], function(App, RegionController) {
  return App.module("ContentPreview.TopPanel", function(TopPanel, App, Backbone, Marionette, $, _) {
    TopPanel.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getCompletedSummary = __bind(this._getCompletedSummary, this);
        this._getClass = __bind(this._getClass, this);
        this._timeLeftOrElapsed = __bind(this._timeLeftOrElapsed, this);
        this.getResults = __bind(this.getResults, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var textbookID, textbook_termIDs;
        this.model = options.model, this.questionResponseModel = options.questionResponseModel, this.timerObject = options.timerObject, this.display_mode = options.display_mode, this.classID = options.classID, this.students = options.students;
        this.marks = 0;
        textbook_termIDs = _.flatten(this.model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        this.durationInSeconds = this.model.get('duration') * 60;
        textbookID = this.model.get('term_ids').textbook;
        this.textbookModel = App.request("get:textbook:by:id", textbookID);
        this.view = this._showView();
        this.listenTo(this.view, 'show', function() {
          return this.view.triggerMethod('show:total:marks', this.marks);
        });
        App.execute("when:fetched", [this.textbookNames, this.textbookModel], (function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        if (this.display_mode === 'class_mode') {
          this.timerObject.setHandler("get:elapsed:time", (function(_this) {
            return function() {
              var timeElapsed, timerTime;
              timerTime = $(_this.view.el).find('.cpTimer').TimeCircles().getTime();
              timeElapsed = _this.durationInSeconds - timerTime;
              return timeElapsed;
            };
          })(this));
        }
        return App.commands.setHandler('show:total:marks', (function(_this) {
          return function(marks) {
            _this.view.triggerMethod('show:total:marks', marks);
            return _this.marks = marks;
          };
        })(this));
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
        } else if (this.model.get('question_type') === 'individual') {
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
        } else {
          correct_answer = false;
        }
        return correct_answer;
      };

      Controller.prototype._showView = function() {
        var terms;
        terms = this.model.get('term_ids');
        return new TopPanel.Views.TopPanelView({
          model: this.model,
          display_mode: this.display_mode,
          templateHelpers: {
            timeLeftOrElapsed: this._timeLeftOrElapsed,
            getClass: this._getClass,
            getTextbookName: _.bind(this._getTextbookName, this, terms),
            getChapterName: _.bind(this._getChapterName, this, terms),
            getSectionsNames: _.bind(this._getSectionsNames, this, terms),
            getSubSectionsNames: _.bind(this._getSubSectionsNames, this, terms),
            getCompletedSummary: this._getCompletedSummary
          }
        });
      };

      Controller.prototype._timeLeftOrElapsed = function() {
        var responseTime, timeTaken, timer;
        timeTaken = 0;
        if (this.questionResponseModel) {
          responseTime = this.questionResponseModel.get('time_taken');
        }
        if (responseTime && responseTime !== 'NaN') {
          timeTaken = responseTime;
        }
        return timer = this.durationInSeconds - timeTaken;
      };

      Controller.prototype._getClass = function() {
        var classLabel, classes, classesArray, _i, _len;
        classesArray = [];
        classes = this.textbookModel.get('classes');
        if (_.isArray(classes)) {
          for (_i = 0, _len = classes.length; _i < _len; _i++) {
            classLabel = classes[_i];
            classesArray.push(CLASS_LABEL[classLabel]);
          }
          classesArray.join();
        }
        return classesArray;
      };

      Controller.prototype._getTextbookName = function(terms) {
        var texbookName, textbook;
        textbook = this.textbookNames.get(terms.textbook);
        if (textbook != null) {
          return texbookName = textbook.get('name');
        }
      };

      Controller.prototype._getChapterName = function(terms) {
        var chapter, chapterName;
        chapter = this.textbookNames.get(terms.chapter);
        if (chapter != null) {
          return chapterName = chapter.get('name');
        }
      };

      Controller.prototype._getSectionsNames = function(terms) {
        var section, sectionName, sectionNames, sectionString, sections, term, _i, _len;
        sections = _.flatten(terms.sections);
        sectionString = '';
        sectionNames = [];
        if (sections) {
          for (_i = 0, _len = sections.length; _i < _len; _i++) {
            section = sections[_i];
            term = this.textbookNames.get(section);
            if (term != null) {
              sectionName = term.get('name');
            }
            sectionNames.push(sectionName);
          }
          return sectionString = sectionNames.join();
        }
      };

      Controller.prototype._getSubSectionsNames = function(terms) {
        var sub, subSectionString, subsection, subsectionNames, subsections, _i, _len;
        subsections = _.flatten(terms.subsections);
        subSectionString = '';
        subsectionNames = [];
        if (subsections) {
          for (_i = 0, _len = subsections.length; _i < _len; _i++) {
            sub = subsections[_i];
            subsection = this.textbookNames.get(sub);
            if (subsection != null) {
              subsectionNames.push(subsection.get('name'));
            }
          }
          return subSectionString = subsectionNames.join();
        }
      };

      Controller.prototype._getCompletedSummary = function() {
        var correct_answer, minutes, seconds, time_taken_string;
        if (this.questionResponseModel && this.questionResponseModel.get("status") === 'completed') {
          minutes = parseInt(this.questionResponseModel.get("time_taken") / 60);
          seconds = parseInt(this.questionResponseModel.get("time_taken") % 60);
          time_taken_string = minutes + 'm ' + seconds + 's';
          correct_answer = this.getResults();
          return '<div class="p-r-20 p-b-10 p-l-20"> <div class="b-grey b-b m-b-10 p-b-5"> <div class="qstnStatus"><i class="fa fa-check-circle"></i> Completed</div> </div> <div class="b-grey b-b m-b-10 p-b-5"> <label class="form-label bold small-text muted no-margin">Time Alloted:</label>' + model.get("duration") + ' mins<br> </div> <div class="b-grey b-b m-b-10 p-b-5"> <label class="form-label bold small-text muted no-margin">Time Taken:</label>' + time_taken_string + '</div> <div id="correct-answer-col"> <div class="b-grey b-b m-b-10 p-b-5"> <label class="form-label bold small-text muted no-margin">Correct Answer:</label>' + correct_answer + '</div> </div> </div>';
        }
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:top:panel', function(options) {
      return new TopPanel.Controller(options);
    });
  });
});
