var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.FibElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.BlankElementView = (function(_super) {
      __extends(BlankElementView, _super);

      function BlankElementView() {
        return BlankElementView.__super__.constructor.apply(this, arguments);
      }

      BlankElementView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> FIB <i class="fa fa-chevron-right"> </i> <span class="semi-bold"> Blank No : <span id="blankPropertiesNo"></span> </span> </div> <div class="docket-body"> <!-- 	<div class="from-group">Set maximum characters allowed to enter <input id="answer-max-length" type="text"  value="{{maxlength}}"> </div>   --> <div class=""> Accepted answers <input id="correct-answers"   value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" /> </div> <div class="m-b-10"> Marks <input id="individual-marks" type="text" value="{{marks}}" class="form-control"> </div> </div> </div> </div>';

      BlankElementView.prototype.ui = {
        individualMarksTextbox: '#individual-marks'
      };

      BlankElementView.prototype.events = {
        'change input#correct-answers': '_changeCorrectAnswers',
        'blur @ui.individualMarksTextbox': '_changeIndividualMarks'
      };

      BlankElementView.prototype.mixinTemplateHelpers = function(data) {
        data.correctanswersFn = function() {
          return this.correct_answers.toString();
        };
        return data;
      };

      BlankElementView.prototype.initialize = function(options) {
        return this.blankNo = options.blankNo;
      };

      BlankElementView.prototype.onShow = function() {
        this.$el.find('input#correct-answers').tagsinput('refresh');
        this.$el.find('#blankPropertiesNo').text(this.blankNo);
        return console.log(this.blankNo);
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
