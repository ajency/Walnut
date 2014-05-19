var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/top-panel/view'], function(App, RegionController) {
  return App.module("ContentPreview.TopPanel", function(TopPanel, App, Backbone, Marionette, $, _) {
    TopPanel.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showView = __bind(this._showView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var model, questionResponseModel, textbook_termIDs;
        model = options.model, questionResponseModel = options.questionResponseModel, this.timerObject = options.timerObject, this.display_mode = options.display_mode, this.classID = options.classID;
        textbook_termIDs = _.flatten(model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        this.durationInSeconds = model.get('duration') * 60;
        this.view = this._showView(model, questionResponseModel);
        App.execute("when:fetched", this.textbookNames, (function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        return this.timerObject.setHandler("get:elapsed:time", (function(_this) {
          return function() {
            var timeElapsed, timerTime;
            timerTime = $(_this.view.el).find('.cpTimer').TimeCircles().getTime();
            timeElapsed = _this.durationInSeconds - timerTime;
            return timeElapsed;
          };
        })(this));
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
                responseTime = questionResponseModel.get('time_taken');
                if (responseTime !== 'NaN') {
                  timeTaken = responseTime;
                }
                return timer = _this.durationInSeconds - timeTaken;
              };
            })(this),
            getClass: (function(_this) {
              return function() {
                return CLASS_LABEL[_this.classID];
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
