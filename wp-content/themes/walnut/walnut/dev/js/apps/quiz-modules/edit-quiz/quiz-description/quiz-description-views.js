var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/quiz-modules/edit-quiz/quiz-description/templates/quiz-details.html'], function(App, quizDetailsTmpl) {
  return App.module('QuizModuleApp.EditQuiz.QuizDetails.Views', function(Views, App) {
    return Views.DeatailsView = (function(_super) {
      __extends(DeatailsView, _super);

      function DeatailsView() {
        return DeatailsView.__super__.constructor.apply(this, arguments);
      }

      DeatailsView.prototype.template = quizDetailsTmpl;

      DeatailsView.prototype.className = 'tiles white grid simple vertical green animated fadeIn';

      DeatailsView.prototype.events = {
        'click #save-quiz': '_saveQuiz',
        'change input[name="negMarksEnable"]': function(e) {
          e.stopPropagation();
          return this._toggleNegativeMarks($(e.target));
        },
        'change #msgs': function(e) {
          return this._showCustomMessages($(e.target));
        },
        'click .customMsgLink': '_openCustomMsgPopup'
      };

      DeatailsView.prototype.onShow = function() {
        Backbone.Syphon.deserialize(this, this.model.toJSON());
        this._showCustomMessages(this.$el.find('#msgs'));
        return this._toggleNegativeMarks(this.$el.find('input[name="negMarksEnable"]:checked'));
      };

      DeatailsView.prototype._saveQuiz = function(e) {
        var data;
        e.preventDefault();
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          if (data.negMarksEnable === 'true' && data.negMarks === '') {
            data.negMarks = 0;
          }
          return this.trigger("save:quiz:details", data);
        }
      };

      DeatailsView.prototype._toggleNegativeMarks = function(el) {
        console.log($(el).val());
        if ($(el).val() === 'true') {
          return this.$el.find("#negPercent").removeClass("none").addClass("inline");
        } else {
          return this.$el.find("#negPercent").addClass("none").removeClass("inline");
        }
      };

      DeatailsView.prototype._showCustomMessages = function(el) {
        if ($(el).prop('checked')) {
          return this.$el.find('#customMsg').show();
        } else {
          return this.$el.find('#customMsg').hide();
        }
      };

      DeatailsView.prototype._openCustomMsgPopup = function(e) {
        e.stopPropagation();
        return this.trigger('show:custom:msg:popup', {
          slug: $(e.target).closest('.customMsgLink').attr('data-slug')
        });
      };

      DeatailsView.prototype.onSavedQuiz = function(model) {
        this.$el.find('#saved-success').remove();
        return this.$el.find('.grid-title').prepend('<div id="saved-success">Saved Successfully. Click here to <a href="#view-quiz/' + model.get('id') + '">view the Quiz</a><hr></div>');
      };

      return DeatailsView;

    })(Marionette.ItemView);
  });
});
