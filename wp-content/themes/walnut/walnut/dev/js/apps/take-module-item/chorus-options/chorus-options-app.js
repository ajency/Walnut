var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/take-module-item/chorus-options/templates/chorus-options-template.html'], function(App, RegionController, chorusOptionsTemplate) {
  return App.module("SingleQuestionChorusOptionsApp", function(ChorusOptions, App) {
    var ChorusOptionsController, ChorusOptionsView;
    ChorusOptionsController = (function(superClass) {
      extend(ChorusOptionsController, superClass);

      function ChorusOptionsController() {
        this._saveQuestionResponse = bind(this._saveQuestionResponse, this);
        this._showChorusOptionsView = bind(this._showChorusOptionsView, this);
        return ChorusOptionsController.__super__.constructor.apply(this, arguments);
      }

      ChorusOptionsController.prototype.initialize = function(opts) {
        var view;
        this.questionResponseModel = opts.questionResponseModel, this.display_mode = opts.display_mode, this.timerObject = opts.timerObject;
        this.view = view = this._showChorusOptionsView(this.questionResponseModel);
        this.show(view, {
          loading: true
        });
        return this.listenTo(view, "save:question:response", this._saveQuestionResponse);
      };

      ChorusOptionsController.prototype._showChorusOptionsView = function(model) {
        return new ChorusOptionsView({
          model: model,
          responsePercentage: this.questionResponseModel.get('question_response'),
          display_mode: this.display_mode
        });
      };

      ChorusOptionsController.prototype._saveQuestionResponse = function(studResponse) {
        var elapsedTime;
        elapsedTime = this.timerObject.request("get:elapsed:time");
        this.questionResponseModel.set({
          'question_response': studResponse,
          'status': 'paused',
          'time_taken': elapsedTime
        });
        return this.questionResponseModel.save();
      };

      return ChorusOptionsController;

    })(RegionController);
    ChorusOptionsView = (function(superClass) {
      extend(ChorusOptionsView, superClass);

      function ChorusOptionsView() {
        return ChorusOptionsView.__super__.constructor.apply(this, arguments);
      }

      ChorusOptionsView.prototype.className = 'studentList m-t-35';

      ChorusOptionsView.prototype.template = chorusOptionsTemplate;

      ChorusOptionsView.prototype.events = {
        'click .tiles.single.selectable': 'selectStudent'
      };

      ChorusOptionsView.prototype.onShow = function() {
        var ele, i, len, ref, responsePercentage;
        if (Marionette.getOption(this, 'display_mode') !== 'readonly') {
          ref = this.$el.find('.tiles.single');
          for (i = 0, len = ref.length; i < len; i++) {
            ele = ref[i];
            $(ele).addClass('selectable');
          }
        }
        responsePercentage = Marionette.getOption(this, 'responsePercentage');
        if (_.isString(responsePercentage) && responsePercentage.length > 0) {
          return this.$el.find('#' + responsePercentage).find('.unselected').removeClass('unselected').addClass('blue');
        }
      };

      ChorusOptionsView.prototype.selectStudent = function(e) {
        var dataValue;
        this.$el.find('#select-an-item').remove();
        this.$el.find('.blue').removeClass('blue').addClass('unselected');
        dataValue = $(e.currentTarget).closest('.tiles.single').attr('id');
        $(e.target).closest('.tiles.single').find('.unselected').removeClass('unselected').addClass('blue').find('i').removeClass('fa-minus-circle').addClass('fa-check-circle');
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          return this.trigger("save:question:response", dataValue);
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
