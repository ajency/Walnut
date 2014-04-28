var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/property-dock/mcq-property-box/templates/mcqpropview.html'], function(App, Template) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        this._changeMultipleCorrectAnswers = __bind(this._changeMultipleCorrectAnswers, this);
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = Template;

      PropertyView.prototype.ui = {
        individualMarksCheckbox: 'input#check-ind-marks',
        numberOfColumnsDropdown: 'select#column-num',
        numberOfOptionsDropdown: 'select#options-num',
        enableMultipleAnswersRadio: '#multiple-answer.radio',
        marksTextbox: 'input#marks'
      };

      PropertyView.prototype.regions = {
        'individualMarksRegion': '#individual-marks-region'
      };

      PropertyView.prototype.events = {
        'change @ui.numberOfOptionsDropdown': '_changeOptionNumber',
        'change @ui.numberOfColumnsDropdown': '_changeColumnNumber',
        'change @ui.individualMarksCheckbox': '_changeIndividualMarks',
        'change @ui.marksTextbox': '_changeMarks',
        'change @ui.enableMultipleAnswersRadio': '_changeMultipleCorrectAnswers'
      };

      PropertyView.prototype.onShow = function() {
        this.ui.numberOfOptionsDropdown.select2({
          minimumResultsForSearch: -1
        });
        this.ui.numberOfColumnsDropdown.select2({
          minimumResultsForSearch: -1
        });
        this.ui.numberOfOptionsDropdown.select2('val', this.model.get('optioncount'));
        this.ui.numberOfColumnsDropdown.select2('val', this.model.get('columncount'));
        if (this.model.get('multiple')) {
          this.ui.enableMultipleAnswersRadio.find("input#yes").prop('checked', true);
        } else {
          this.ui.enableMultipleAnswersRadio.find("input#no").prop('checked', true);
          this.model.set('individual_marks', false);
          this.ui.individualMarksCheckbox.prop('disabled', true);
        }
        if (this.model.get('individual_marks')) {
          this.ui.individualMarksCheckbox.prop('checked', true);
          this.ui.marksTextbox.val(0).prop('disabled', true);
          return this.trigger("show:individual:marks:table");
        }
      };

      PropertyView.prototype._changeMultipleCorrectAnswers = function() {
        var _ref;
        this.model.set('multiple', (_ref = this.ui.enableMultipleAnswersRadio.find('input:checked').val() === "yes") != null ? _ref : {
          "true": false
        });
        if (this.model.get('multiple')) {
          return this.$el.find('input#check-ind-marks').prop('disabled', false);
        }
      };

      PropertyView.prototype._changeIndividualMarks = function(evt) {
        if ($(evt.target).prop('checked')) {
          this.model.set('individual_marks', true);
          this.ui.marksTextbox.val(0).prop('disabled', true);
          return this.trigger("show:individual:marks:table");
        } else {
          this.model.set('individual_marks', false);
          this.ui.marksTextbox.prop('disabled', false).val(this.model.get('marks'));
          return this.trigger("hide:individual:marks:table");
        }
      };

      PropertyView.prototype._changeMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', $(evt.target).val());
        }
      };

      PropertyView.prototype._changeOptionNumber = function(evt) {
        return this.model.set('optioncount', parseInt($(evt.target).val()));
      };

      PropertyView.prototype._changeColumnNumber = function(evt) {
        return this.model.set('columncount', parseInt($(evt.target).val()));
      };

      return PropertyView;

    })(Marionette.Layout);
  });
});
