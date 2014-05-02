var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'video'], function(App, RegionController) {
  return App.module("SingleQuestionDisplayApp", function(SingleQuestion, App) {
    var QuestionDisplayView;
    SingleQuestion.SingleQuestionController = (function(_super) {
      __extends(SingleQuestionController, _super);

      function SingleQuestionController() {
        return SingleQuestionController.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionController.prototype.initialize = function(opts) {
        var model, view;
        model = opts.model;
        this.view = view = this._showQuestionView(model);
        return this.show(view, {
          loading: true
        });
      };

      SingleQuestionController.prototype._showQuestionView = function(model) {
        return new QuestionDisplayView({
          model: model
        });
      };

      return SingleQuestionController;

    })(RegionController);
    QuestionDisplayView = (function(_super) {
      __extends(QuestionDisplayView, _super);

      function QuestionDisplayView() {
        return QuestionDisplayView.__super__.constructor.apply(this, arguments);
      }

      QuestionDisplayView.prototype.template = '<div class="teacherCanvas "> <div class="grid-body p-t-20 p-b-15 no-border"></div> </div> <div class="tiles grey text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b"> <p class="bold small-text">Question Info: </p> <p class="">{{post_title}}</p> </div>';

      return QuestionDisplayView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:single:question:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new SingleQuestion.SingleQuestionController(opt);
    });
  });
});
