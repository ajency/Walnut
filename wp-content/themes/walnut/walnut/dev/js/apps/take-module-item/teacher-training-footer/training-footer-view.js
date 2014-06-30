var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("TeacherTrainingFooter.Views", function(Views, App) {
    return Views.TrainingFooterView = (function(_super) {
      __extends(TrainingFooterView, _super);

      function TrainingFooterView() {
        return TrainingFooterView.__super__.constructor.apply(this, arguments);
      }

      TrainingFooterView.prototype.template = '{{#isChorus}} <h4 class="text-primary semi-bold  p-t-15 p-b-20 p-l-5 p-r-5 "> In a chorus question you will be marking a group of students in the class mode </h4> {{/isChorus}} {{#isIndividual}} <h4 class="text-primary semi-bold  p-t-15 p-b-20 p-l-5 p-r-5 "> Your individual class students will be displayed in the class mode for marking </h4> {{/isIndividual}}';

      TrainingFooterView.prototype.mixinTemplateHelpers = function(data) {
        data = TrainingFooterView.__super__.mixinTemplateHelpers.call(this, data);
        data.isChorus = data.isIndividual = false;
        if (this.model.get('content_type') !== 'content_piece') {
          if (this.model.get('question_type') === 'chorus') {
            data.isChorus = true;
          }
          if (this.model.get('question_type') === 'individual') {
            data.isIndividual = true;
          }
        }
        return data;
      };

      return TrainingFooterView;

    })(Marionette.ItemView);
  });
});
