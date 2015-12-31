var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/content-creator/property-dock/mcq-property-box/templates/mcqpropview.html'], function(App, Template) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(superClass) {
      extend(PropertyView, superClass);

      function PropertyView() {
        this._changeMultipleCorrectAnswers = bind(this._changeMultipleCorrectAnswers, this);
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = Template;

      PropertyView.prototype.ui = {
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
          this.trigger("show:individual:marks:table");
          this.ui.marksTextbox.prop('disabled', true);
          this._updateMarks();
        } else {
          this.ui.enableMultipleAnswersRadio.find("input#no").prop('checked', true);
        }
        return this.$el.find('#individual-marks-region').on('blur', 'input', (function(_this) {
          return function(e) {
            return _this._updateMarks();
          };
        })(this));
      };

      PropertyView.prototype._updateMarks = function() {
        var totalMarks;
        totalMarks = 0;
        _.each(this.model.get('correct_answer'), (function(_this) {
          return function(option) {
            return totalMarks = totalMarks + parseInt(_this.model.get('options').get(option).get('marks'));
          };
        })(this));
        this.model.set('marks', totalMarks);
        return this.ui.marksTextbox.val(totalMarks);
      };

      PropertyView.prototype._changeMultipleCorrectAnswers = function() {
        var ref;
        this.model.set('multiple', (ref = this.ui.enableMultipleAnswersRadio.find('input:checked').val() === "yes") != null ? ref : {
          "true": false
        });
        if (this.model.get('multiple')) {
          this.trigger("show:individual:marks:table");
          this.ui.marksTextbox.prop('disabled', true);
          return this._updateMarks();
        }
      };

      PropertyView.prototype._changeMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', $(evt.target).val());
        }
      };

      PropertyView.prototype._changeOptionNumber = function(evt) {
        var oldOptionCount, optionCount;
        optionCount = parseInt($(evt.target).val());
        oldOptionCount = this.model.previous('optioncount');
        if (oldOptionCount > optionCount) {
          if (confirm("Decreasing number of blanks may cause loss of data. Do you want to continue?")) {
            return this.model.set('optioncount', optionCount);
          } else {
            return $(evt.target).select2().select2("val", oldOptionCount);
          }
        } else {
          return this.model.set('optioncount', optionCount);
        }
      };

      PropertyView.prototype._changeColumnNumber = function(evt) {
        return this.model.set('columncount', parseInt($(evt.target).val()));
      };

      return PropertyView;

    })(Marionette.Layout);
  });
});
