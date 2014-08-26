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

      DeatailsView.prototype.mixinTemplateHelpers = function(data) {
        data = DeatailsView.__super__.mixinTemplateHelpers.call(this, data);
        data.heading = this.model.isNew() ? 'Add' : 'Edit';
        data.textBookSelected = function() {
          if (parseInt(this.id) === parseInt(data.term_ids['textbook'])) {
            return 'selected';
          }
        };
        return data;
      };

      DeatailsView.prototype.onShow = function() {
        Backbone.Syphon.deserialize(this, this.model.toJSON());
        this._showCustomMessages(this.$el.find('#msgs'));
        this._toggleNegativeMarks(this.$el.find('input[name="negMarksEnable"]:checked'));
        $("select:not(#qType,#status)").select2();
        $("#secs,#subsecs").val([]).select2();
        return this.statusChanged();
      };

      DeatailsView.prototype.statusChanged = function() {
        var _ref;
        if ((_ref = this.model.get('status')) === 'publish' || _ref === 'archive') {
          this.$el.find('input, textarea, select').prop('disabled', true);
          this.$el.find('select#status').prop('disabled', false);
          return this.$el.find('select#status option[value="underreview"]').prop('disabled', true);
        }
      };

      DeatailsView.prototype.onFetchChaptersComplete = function(chapters) {
        var chapterElement, currentChapter, termIDs;
        this.$el.find('#chapters, #secs, #subsecs').select2('data', null);
        this.$el.find('#chapters, #secs, #subsecs').html('');
        chapterElement = this.$el.find('#chapters');
        termIDs = this.model.get('term_ids');
        currentChapter = termIDs['chapter'];
        return $.populateChaptersOrSections(chapters, chapterElement, currentChapter);
      };

      DeatailsView.prototype.setChapterValue = function() {
        if (this.model.get('term_ids')['chapter']) {
          this.$el.find('#chapters').val(this.model.get('term_ids')['chapter']);
          this.$el.find('#chapters').select2();
          return this.$el.find('#chapters').trigger('change');
        }
      };

      DeatailsView.prototype.onFetchSectionsComplete = function(sections) {
        var sectionIDs, sectionsElement, term_ids;
        this.$el.find('#secs, #subsecs').select2('data', null);
        this.$el.find('#secs, #subsecs').html('');
        term_ids = this.model.get('term_ids');
        if (term_ids != null) {
          sectionIDs = term_ids['sections'];
        }
        sectionsElement = this.$el.find('#secs');
        return $.populateChaptersOrSections(sections, sectionsElement, sectionIDs);
      };

      DeatailsView.prototype.onFetchSubsectionsComplete = function(subsections) {
        var subSectionIDs, subsectionsElemnet, term_ids;
        this.$el.find('#subsecs').select2('data', null);
        this.$el.find('#subsecs').html('');
        term_ids = this.model.get('term_ids');
        if (term_ids != null) {
          subSectionIDs = term_ids['subsections'];
        }
        subsectionsElemnet = this.$el.find('#subsecs');
        return $.populateChaptersOrSections(subsections, subsectionsElemnet, subSectionIDs);
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
