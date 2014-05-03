var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/teacher-teaching-module/chorus-options/templates/chorus-options-template.html'], function(App, RegionController, chorusOptionsTemplate) {
  return App.module("SingleQuestionChorusOptionsApp", function(ChorusOptions, App) {
    var ChorusOptionsController, ChorusOptionsView;
    ChorusOptionsController = (function(_super) {
      __extends(ChorusOptionsController, _super);

      function ChorusOptionsController() {
        this._saveQuestionResponse = __bind(this._saveQuestionResponse, this);
        this._showChorusOptionsView = __bind(this._showChorusOptionsView, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        return ChorusOptionsController.__super__.constructor.apply(this, arguments);
      }

      ChorusOptionsController.prototype.initialize = function(opts) {
        var view;
        this.questionResponseModel = opts.questionResponseModel, this.display_mode = opts.display_mode;
        this.view = view = this._showChorusOptionsView(this.questionResponseModel);
        this.show(view, {
          loading: true
        });
        this.listenTo(view, "save:question:response", this._saveQuestionResponse);
        this.listenTo(view, "question:completed", this._changeQuestion);
        return this.listenTo(this.view, "goto:previous:route", (function(_this) {
          return function() {
            return _this.region.trigger("goto:previous:route");
          };
        })(this));
      };

      ChorusOptionsController.prototype._changeQuestion = function(resp) {
        if (resp === 'no_answer') {
          this._saveQuestionResponse('');
        }
        return this.region.trigger("goto:next:question", this.questionResponseModel.get('content_piece_id'));
      };

      ChorusOptionsController.prototype._showChorusOptionsView = function(model) {
        return new ChorusOptionsView({
          model: model,
          responsePercentage: this.questionResponseModel.get('question_response'),
          display_mode: this.display_mode,
          templateHelpers: {
            showPauseBtn: (function(_this) {
              return function() {
                var buttonStr;
                if (_this.display_mode === 'class_mode') {
                  buttonStr = '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10"> <button type="button" id="pause-session" class="btn btn-primary btn-xs btn-sm"> <i class="fa fa-pause"></i> Pause </button> </div>';
                }
                return buttonStr;
              };
            })(this)
          }
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
        this.questionCompleted = __bind(this.questionCompleted, this);
        return ChorusOptionsView.__super__.constructor.apply(this, arguments);
      }

      ChorusOptionsView.prototype.className = 'studentList m-t-35';

      ChorusOptionsView.prototype.template = chorusOptionsTemplate;

      ChorusOptionsView.prototype.events = {
        'click .tiles.single.selectable': 'selectStudent',
        'click #question-done': 'questionCompleted',
        'click #pause-session': function() {
          return this.trigger("goto:previous:route");
        }
      };

      ChorusOptionsView.prototype.onShow = function() {
        var ele, responsePercentage, _i, _len, _ref;
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          _ref = this.$el.find('.tiles.single');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ele = _ref[_i];
            $(ele).addClass('selectable');
          }
        }
        responsePercentage = Marionette.getOption(this, 'responsePercentage');
        if (responsePercentage != null) {
          return this.$el.find('#' + responsePercentage).find('.default').addClass('green');
        }
      };

      ChorusOptionsView.prototype.selectStudent = function(e) {
        var dataValue;
        this.$el.find('.green').removeClass('green');
        dataValue = $(e.target).closest('.tiles.single').attr('id');
        $(e.target).closest('.tiles.single').find('.default').addClass('green').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
        return this.trigger("save:question:response", dataValue);
      };

      ChorusOptionsView.prototype.questionCompleted = function() {
        var selectedAnswer;
        selectedAnswer = this.$el.find('.tiles.single .green');
        if ((_.size(selectedAnswer) === 0) && (Marionette.getOption(this, 'display_mode') === 'class_mode')) {
          if (confirm('Are you sure no one answered correctly?')) {
            return this.trigger("question:completed", "no_answer");
          }
        } else {
          return this.trigger("question:completed");
        }
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
