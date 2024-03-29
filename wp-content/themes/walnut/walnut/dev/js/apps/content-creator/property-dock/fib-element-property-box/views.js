var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.FibElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.BlankElementView = (function(superClass) {
      extend(BlankElementView, superClass);

      function BlankElementView() {
        return BlankElementView.__super__.constructor.apply(this, arguments);
      }

      BlankElementView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles blue"> <div class="tile-footer drag"> FIB <i class="fa fa-chevron-right"> </i> <span class="semi-bold"> Blank No : <span id="blankPropertiesNo"></span> </span> </div> <div class="docket-body"> <!-- 			<div class="from-group">Set maximum characters allowed to enter <input id="answer-max-length" type="text"  value="{{maxlength}}"> </div>   --> <div class=""> Accepted answers <input id="correct-answers"   value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" /> </div> <div class="form-group"> <div class="textProp slider success"> Size <input type="text" id="fib-blanksize" class="blankSize" data-slider-max="50" data-slider-min="1" data-slider-step="1" data-slider-value="{{blank_size}}" data-slider-orientation="horizontal" data-slider-selection="before" style="width:85%"> </div> </div> <div class="m-b-10"> Marks <input id="individual-marks" type="text" value="{{marks}}" class="form-control"> </div> </div> </div> </div>';

      BlankElementView.prototype.ui = {
        individualMarksTextbox: '#individual-marks'
      };

      BlankElementView.prototype.events = {
        'change input#correct-answers': '_changeCorrectAnswers',
        'blur @ui.individualMarksTextbox': '_changeIndividualMarks'
      };

      BlankElementView.prototype.mixinTemplateHelpers = function(data) {
        data = BlankElementView.__super__.mixinTemplateHelpers.call(this, data);
        data.correctanswersFn = function() {
          return this.correct_answers.toString();
        };
        return data;
      };

      BlankElementView.prototype.initialize = function(options) {
        return this.fibModel = options.fibModel;
      };

      BlankElementView.prototype.onShow = function() {
        this.$el.find('input#correct-answers').tagsinput('refresh');
        this.$el.find('#blankPropertiesNo').text(this.model.get('blank_index'));
        console.log(this.model.get('blank_index'));
        this.$el.find('.blankSize').slider();
        this.$el.find('#fib-blanksize').slider().on('slide', (function(_this) {
          return function() {
            var size;
            size = _this.model.get('blank_size');
            return _this.model.set('blank_size', _this.$el.find('.blankSize').slider('getValue').val() || size);
          };
        })(this));
        if (!this.fibModel.get('enableIndividualMarks')) {
          this._disableMarks();
        }
        return this.listenTo(this.fibModel, 'change:enableIndividualMarks', this._toggleMarks);
      };

      BlankElementView.prototype._toggleMarks = function(model, enableIndividualMarks) {
        if (enableIndividualMarks) {
          return this._enableMarks();
        } else {
          return this._disableMarks();
        }
      };

      BlankElementView.prototype._disableMarks = function() {
        this.ui.individualMarksTextbox.val(0);
        return this.ui.individualMarksTextbox.prop('disabled', true);
      };

      BlankElementView.prototype._enableMarks = function() {
        this.ui.individualMarksTextbox.val(this.model.get('marks'));
        return this.ui.individualMarksTextbox.prop('disabled', false);
      };

      BlankElementView.prototype._changeCorrectAnswers = function(evt) {
        return this.model.set('correct_answers', $(evt.target).val().split(','));
      };

      BlankElementView.prototype._changeIndividualMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', parseInt($(evt.target).val()));
        }
      };

      return BlankElementView;

    })(Marionette.ItemView);
  });
});
