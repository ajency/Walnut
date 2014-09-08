var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        this._delayUpdateTillMarksChange = __bind(this._delayUpdateTillMarksChange, this);
        this._updateMarks = __bind(this._updateMarks, this);
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles blue"> <div class="tile-footer drag"> Hotspot <i class="fa fa-chevron-right"></i> <span class="semi-bold">Hotspot Question Properties</span> </div> <div class="docket-body"> <div class="checkbox check-success"> <input id="check-individual-marks" type="checkbox" name="check-individual-marks"> <label for="check-individual-marks">Set marks for each hotspot</label> </div> <div class="m-b-10"> Marks <input id="marks" type="text" value="{{marks}}" class="form-control" > </div> <div id="transparency" class="checkbox check-success"> <input id="transparency-checkbox" type="checkbox" value="1"> <label for="transparency-checkbox">Set Transparent</label> </div> </div> </div> </div>';

      PropertyView.prototype.events = {
        'blur input#marks': '_changeMarks',
        'change @ui.individualMarksCheckbox': '_toggleIndividualMarks',
        'change @ui.transparencyCheckbox': '_toggleTransparency'
      };

      PropertyView.prototype.ui = {
        marksTextbox: 'input#marks',
        individualMarksCheckbox: 'input#check-individual-marks',
        transparencyCheckbox: 'input#transparency-checkbox'
      };

      PropertyView.prototype.onShow = function() {
        console.log(this.model.get('optionCollection'));
        if (this.model.get('enableIndividualMarks')) {
          this.ui.individualMarksCheckbox.prop('checked', true);
          this.ui.marksTextbox.prop('disabled', true);
          this._enableCalculateMarks();
        }
        if (this.model.get('transparent')) {
          return this.$el.find('#transparency-checkbox').prop('checked', true);
        }
      };

      PropertyView.prototype._changeMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', parseInt($(evt.target).val()));
        }
      };

      PropertyView.prototype._enableCalculateMarks = function() {
        this._updateMarks();
        this.$el.closest('#property-dock').on('change', '#question-elements-property #individual-marks', (function(_this) {
          return function(evt) {
            return _this._updateMarks();
          };
        })(this));
        this.listenTo(this.model.get('optionCollection'), 'add', this._updateMarks);
        return this.listenTo(this.model.get('optionCollection'), 'remove', this._updateMarks);
      };

      PropertyView.prototype._disableCalculateMarks = function() {
        this.$el.closest('#property-dock').off('change', '#question-elements-property #individual-marks');
        return this.stopListening(this.model.get('optionCollection'));
      };

      PropertyView.prototype._updateMarks = function() {
        return _.delay(this._delayUpdateTillMarksChange, 50);
      };

      PropertyView.prototype._delayUpdateTillMarksChange = function() {
        var totalMarks;
        totalMarks = 0;
        console.log(this.model.get('optionCollection'));
        this.model.get('optionCollection').each((function(_this) {
          return function(option) {
            return totalMarks = totalMarks + parseInt(option.get('marks'));
          };
        })(this));
        this.model.set('marks', totalMarks);
        return $(this.ui.marksTextbox).val(totalMarks);
      };

      PropertyView.prototype._toggleIndividualMarks = function(evt) {
        if ($(evt.target).prop('checked')) {
          this.model.set('enableIndividualMarks', true);
          this.ui.marksTextbox.prop('disabled', true);
          return this._enableCalculateMarks();
        } else {
          this.model.set('enableIndividualMarks', false);
          this.ui.marksTextbox.prop('disabled', false);
          return this._disableCalculateMarks();
        }
      };

      PropertyView.prototype._toggleTransparency = function() {
        if (this.ui.transparencyCheckbox.prop('checked')) {
          return this.model.set('transparent', true);
        } else {
          return this.model.set('transparent', false);
        }
      };

      PropertyView.prototype.onClose = function() {
        return this._disableCalculateMarks();
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
