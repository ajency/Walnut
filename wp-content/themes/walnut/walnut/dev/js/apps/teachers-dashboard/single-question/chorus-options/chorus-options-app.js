var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/single-question/chorus-options/templates/chorus-options-template.html'], function(App, RegionController, chorusOptionsTemplate) {
  return App.module("SingleQuestionChorusOptionsApp", function(ChorusOptions, App) {
    var ChorusOptionsController, ChorusOptionsView;
    ChorusOptionsController = (function(_super) {
      __extends(ChorusOptionsController, _super);

      function ChorusOptionsController() {
        this._saveQuestionResponse = __bind(this._saveQuestionResponse, this);
        return ChorusOptionsController.__super__.constructor.apply(this, arguments);
      }

      ChorusOptionsController.prototype.initialize = function(opts) {
        var view;
        this.questionResponseModel = opts.questionResponseModel;
        this.view = view = this._showQuestionView(this.questionResponseModel);
        this.show(view, {
          loading: true
        });
        this.listenTo(view, "save:question:response", this._saveQuestionResponse);
        return this.listenTo(view, "question:completed", this._changeQuestion);
      };

      ChorusOptionsController.prototype._changeQuestion = function() {
        return App.SingleQuestionChorusOptionsApp.trigger("goto:next:question");
      };

      ChorusOptionsController.prototype._showQuestionView = function(model) {
        return new ChorusOptionsView({
          model: model,
          responsePercentage: this.questionResponseModel.get('question_response')
        });
      };

      ChorusOptionsController.prototype._saveQuestionResponse = function(studResponse) {
        this.questionResponseModel.set({
          'question_response': studResponse
        });
        return this.questionResponseModel.save(null, {
          wait: true,
          success: this.successFn,
          error: this.errorFn
        });
      };

      return ChorusOptionsController;

    })(RegionController);
    ChorusOptionsView = (function(_super) {
      __extends(ChorusOptionsView, _super);

      function ChorusOptionsView() {
        return ChorusOptionsView.__super__.constructor.apply(this, arguments);
      }

      ChorusOptionsView.prototype.className = 'studentList m-t-35';

      ChorusOptionsView.prototype.template = chorusOptionsTemplate;

      ChorusOptionsView.prototype.events = {
        'click .tiles.single': 'selectStudent',
        'click #question-done': function(e) {
          return this.trigger("question:completed");
        }
      };

      ChorusOptionsView.prototype.onShow = function() {
        var responsePercentage;
        responsePercentage = Marionette.getOption(this, 'responsePercentage');
        return this.$el.find('#' + responsePercentage).find('.default').addClass('green');
      };

      ChorusOptionsView.prototype.selectStudent = function(e) {
        var dataValue;
        this.$el.find('.green').removeClass('green');
        dataValue = $(e.target).closest('.tiles.single').attr('id');
        $(e.target).closest('.tiles.single').find('.default').addClass('green').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
        return this.trigger("save:question:response", dataValue);
      };

      return ChorusOptionsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:single:question:chorus:options:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ChorusOptionsController(opt);
    });
  });
});
