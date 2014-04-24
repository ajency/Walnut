var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.FibElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.BlankElementView = (function(_super) {
      __extends(BlankElementView, _super);

      function BlankElementView() {
        return BlankElementView.__super__.constructor.apply(this, arguments);
      }

      BlankElementView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> FIB <i class="fa fa-chevron-right"> </i> <span class="semi-bold"> Blank </span> </div> <div class="docket-body"> <div class="from-group">Max Characters <input id="answer-max-length" type="text"  value="{{maxlength}}"> </div> <div class=""> Answers <input id="correct-answers" value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" /> </div> </div> </div> </div>';

      BlankElementView.prototype.events = {
        'blur #answer-max-length': '_changeMaxLength',
        'change input#correct-answers': '_changeCorrectAnswers'
      };

      BlankElementView.prototype.mixinTemplateHelpers = function(data) {
        data.correctanswersFn = function() {
          return this.correct_answers.toString();
        };
        return data;
      };

      BlankElementView.prototype.onShow = function() {
        return this.$el.find('input#correct-answers').tagsinput('refresh');
      };

      BlankElementView.prototype._changeCorrectAnswers = function(evt) {
        return this.model.set('correct_answers', $(evt.target).val().split(','));
      };

      BlankElementView.prototype._changeMaxLength = function(evt) {
        if (!isNaN($(evt.target).val())) {
          console.log(this.model);
          this.model.set('maxlength', $(evt.target).val());
          return console.log(this.model);
        }
      };

      return BlankElementView;

    })(Marionette.ItemView);
  });
});
