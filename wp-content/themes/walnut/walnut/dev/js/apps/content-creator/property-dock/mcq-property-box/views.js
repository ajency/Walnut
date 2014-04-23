var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        this._multipleCorrectAnswers = __bind(this._multipleCorrectAnswers, this);
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> MCQ <i class="fa fa-chevron-right"></i> <span class="semi-bold">Multiple Choice Question Properties</span> </div> <div class="docket-body"> <div id="multiple-answer" class="radio radio-success">Multiple right answers allowed? <input id="yes" type="radio" name="optionyes" value="yes"> <label for="yes">Yes</label> <input id="no" type="radio" name="optionyes" value="no" checked="checked"> <label for="no">No</label> </div> <div class="inline"> Options <select id="options-num"> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> </select> </div> <div class="inline"> Marks <select id="marks"> <option value="1">1</option> <option value="2">2</option> </select> </div> <div> <input id="check-ind-marks" type="checkbox" name="check-ind-marks"> set marks to individual options </div> <div id="individual-marks-region"></div> </div> </div> </div>';

      PropertyView.prototype.regions = {
        'individualMarksRegion': '#individual-marks-region'
      };

      PropertyView.prototype.events = {
        'change select#options-num': '_changeOptionNumber',
        'change input#check-ind-marks': '_enableIndividualMarks',
        'change select#marks': '_changeMarks',
        'change #multiple-answer.radio': '_multipleCorrectAnswers'
      };

      PropertyView.prototype.onShow = function() {
        this.$el.find('select#options-num, select#marks').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('select#options-num').select2('val', this.model.get('optioncount'));
        this.$el.find('select#marks').select2('val', this.model.get('marks'));
        this.$el.find('#marks').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#marks').select2('val', this.model.get('marks'));
        if (this.model.get('individual_marks')) {
          this.$el.find('#check-ind-marks').prop('checked', true);
          this.trigger("show:individual:marks:table");
        }
        if (this.model.get('multiple')) {
          return this.$el.find("#multiple-answer.radio input#yes").prop('checked', true);
        } else {
          return this.$el.find("#multiple-answer.radio input#no").prop('checked', true);
        }
      };

      PropertyView.prototype._changeMultipleAllowed = function(model, multiple) {
        var meta;
        meta = this.model.get('meta_id');
        if (multiple) {
          return $('.mcq#mcq-' + meta + ' .mcq-option input.mcq-option-select').attr('type', 'checkbox');
        } else {
          return $('.mcq#mcq-' + meta + ' .mcq-option input.mcq-option-select').attr('type', 'radio');
        }
      };

      PropertyView.prototype._multipleCorrectAnswers = function() {
        var _ref;
        return this.model.set('multiple', (_ref = this.$el.find('#multiple-answer.radio input:checked').val() === "yes") != null ? _ref : {
          "true": false
        });
      };

      PropertyView.prototype._enableIndividualMarks = function(evt) {
        if ($(evt.target).prop('checked')) {
          this.model.set('individual_marks', true);
          return this.trigger("show:individual:marks:table");
        } else {
          this.model.set('individual_marks', false);
          return this.trigger("hide:individual:marks:table");
        }
      };

      PropertyView.prototype._changeMarks = function(evt) {
        return this.model.set('marks', $(evt.target).val());
      };

      PropertyView.prototype._changeOptionNumber = function(evt) {
        return this.model.set('optioncount', parseInt($(evt.target).val()));
      };

      return PropertyView;

    })(Marionette.Layout);
  });
});
