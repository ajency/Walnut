var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/property-dock/mcq-property-box/templates/mcqpropview.html'], function(App, Template) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        this._multipleCorrectAnswers = __bind(this._multipleCorrectAnswers, this);
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = Template;

      PropertyView.prototype.regions = {
        'individualMarksRegion': '#individual-marks-region'
      };

      PropertyView.prototype.events = {
        'change select#options-num': '_changeOptionNumber',
        'change select#column-num': '_changeColumnNumber',
        'change input#check-ind-marks': '_enableIndividualMarks',
        'change select#marks': '_changeMarks',
        'change #multiple-answer.radio': '_multipleCorrectAnswers'
      };

      PropertyView.prototype.onShow = function() {
        this.$el.find('select#options-num').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('select#marks').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('select#column-num').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('select#options-num').select2('val', this.model.get('optioncount'));
        this.$el.find('select#column-num').select2('val', this.model.get('columncount'));
        this.$el.find('select#marks').select2('val', this.model.get('marks'));
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

      PropertyView.prototype._changeColumnNumber = function(evt) {
        return this.model.set('columncount', parseInt($(evt.target).val()));
      };

      return PropertyView;

    })(Marionette.Layout);
  });
});
