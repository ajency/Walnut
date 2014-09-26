var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizReportApp.QuizDetails", function(QuizDetails, App) {
    var QuizDetailsView;
    QuizDetails.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.textbookNames = opts.textbookNames, this.divisionModel = opts.divisionModel;
        this.view = view = this._getQuizDescriptionView();
        return this.show(view);
      };

      Controller.prototype._getQuizDescriptionView = function() {
        var terms;
        terms = this.model.get('term_ids');
        return new QuizDetailsView({
          model: this.model,
          divisionModel: this.divisionModel,
          textbookNames: this.textbookNames
        });
      };

      return Controller;

    })(RegionController);
    return QuizDetailsView = (function(_super) {
      __extends(QuizDetailsView, _super);

      function QuizDetailsView() {
        return QuizDetailsView.__super__.constructor.apply(this, arguments);
      }

      QuizDetailsView.prototype.template = '<div class="row"> <div class="col-md-4"> Division: {{division}} </div> <div class="col-md-8"> Quiz Name: {{name}} </div> </div> <div class="row"> <div class="col-md-2"> Total Marks: {{marks}} </div> <div class="col-md-2"> Duration: {{duration}} min </div> <div class="col-md-2"> Textbook: {{textbookName}} </div> <div class="col-md-2"> Chapter: {{chapterName}} </div> <div class="col-md-2"> Section: {{sectionNames}} </div> <div class="col-md-2"> Subsection: {{subSectionNames}} </div> </div>';

      QuizDetailsView.prototype.mixinTemplateHelpers = function(data) {
        var divisionModel, terms, textbookNames;
        textbookNames = Marionette.getOption(this, 'textbookNames');
        divisionModel = Marionette.getOption(this, 'divisionModel');
        terms = data.term_ids;
        data.textbookName = textbookNames.getTextbookName(terms);
        data.chapterName = textbookNames.getChapterName(terms);
        data.sectionNames = textbookNames.getSectionsNames(terms);
        data.subSectionNames = textbookNames.getSubSectionsNames(terms);
        data.division = divisionModel.get('division');
        return data;
      };

      return QuizDetailsView;

    })(Marionette.ItemView);
  });
});
