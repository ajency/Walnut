var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizReportApp.QuizDetails", function(QuizDetails, App) {
    var QuizDetailsView;
    QuizDetails.Controller = (function(superClass) {
      extend(Controller, superClass);

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
    return QuizDetailsView = (function(superClass) {
      extend(QuizDetailsView, superClass);

      function QuizDetailsView() {
        return QuizDetailsView.__super__.constructor.apply(this, arguments);
      }

      QuizDetailsView.prototype.template = '<div class="row m-b-10 p-t-10 b-grey b-t"> <div class="col-md-3"> Quiz Name: {{name}} </div> <div class="col-md-3"> Division: {{division}} </div> <div class="col-md-3"> Duration: {{duration}} min </div> <div class="col-md-3"> Total Marks: {{marks}} </div> </div> <div class="row m-b-10 p-b-10 b-grey b-b"> <div class="col-md-3"> Textbook: {{textbookName}} </div> <div class="col-md-3"> Chapter: {{chapterName}} </div> <div class="col-md-3"> Section: {{sectionNames}} </div> <div class="col-md-3"> Subsection: {{subSectionNames}} </div> </div>';

      QuizDetailsView.prototype.className = 'small';

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
