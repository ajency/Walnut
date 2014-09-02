var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-views'], function(App, RegionController) {
  return App.module("QuizModuleApp.EditQuiz.QuizDetails", function(QuizDetails, App) {
    QuizDetails.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._fetchSubsections = __bind(this._fetchSubsections, this);
        this._fetchSections = __bind(this._fetchSections, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.model = opts.model, this.textbooksCollection = opts.textbooksCollection;
        return this.view = this._getQuizDetailsView();
      };

      Controller.prototype._fetchSections = function(term_id) {
        this.subSectionsList = null;
        this.allSectionsCollection = App.request("get:subsections:by:chapter:id", {
          'child_of': term_id
        });
        return App.execute("when:fetched", this.allSectionsCollection, (function(_this) {
          return function() {
            var sectionsList;
            sectionsList = _this.allSectionsCollection.where({
              'parent': term_id
            });
            _this.subSectionsList = _.difference(_this.allSectionsCollection.models, sectionsList);
            return _this.view.triggerMethod('fetch:sections:complete', sectionsList);
          };
        })(this));
      };

      Controller.prototype._fetchSubsections = function(term_id) {
        return App.execute("when:fetched", this.allSectionsCollection, (function(_this) {
          return function() {
            var subSectionList;
            subSectionList = null;
            subSectionList = _.filter(_this.subSectionsList, function(subSection) {
              return _.contains(term_id, subSection.get('parent'));
            });
            return _this.view.triggerMethod('fetch:subsections:complete', subSectionList);
          };
        })(this));
      };

      Controller.prototype._getQuizDetailsView = function() {
        return new QuizDetails.Views.DeatailsView({
          model: this.model,
          templateHelpers: {
            textbooksFilter: (function(_this) {
              return function() {
                var textbooks;
                textbooks = [];
                _.each(_this.textbooksCollection.models, function(el, ind) {
                  return textbooks.push({
                    'name': el.get('name'),
                    'id': el.get('term_id')
                  });
                });
                return textbooks;
              };
            })(this)
          }
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:edit:quiz:details", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new QuizDetails.Controller(opt);
    });
  });
});
