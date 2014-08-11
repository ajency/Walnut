var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-modules/edit-module/module-description/templates/collection-details.html'], function(App, collectionDetailsTpl) {
  return App.module('EditCollecionDetailsApp.Views', function(Views, App) {
    return Views.CollectionDetailsView = (function(_super) {
      __extends(CollectionDetailsView, _super);

      function CollectionDetailsView() {
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.className = 'grid simple vertical green animated fadeIn';

      CollectionDetailsView.prototype.events = {
        'change #textbooks': function(e) {
          return this.trigger("fetch:chapters", $(e.target).val());
        },
        'change #chapters': function(e) {
          return this.trigger("fetch:sections", $(e.target).val());
        },
        'change #secs': function(e) {
          return this.trigger("fetch:subsections", $(e.target).val());
        },
        'click #save-content-collection': 'save_content',
        'click .customMsgLink': '_openCustomMsgPopup',
        'change input[name="negMarksEnable"]': function(e) {
          e.stopPropagation();
          return this._toggleNegativeMarks($(e.target));
        },
        'change #msgs': function(e) {
          return this._showCustomMessages($(e.target));
        }
      };

      CollectionDetailsView.prototype.modelEvents = {
        'change:post_status': 'statusChanged',
        'change:content_layout': '_changeLayout'
      };

      CollectionDetailsView.prototype.mixinTemplateHelpers = function(data) {
        data = CollectionDetailsView.__super__.mixinTemplateHelpers.call(this, data);
        data.heading = this.model.isNew() ? 'Create a' : 'Edit a';
        if (data.type === 'teaching-module') {
          data.isModule = true;
        }
        if (data.type === 'quiz') {
          data.isQuiz = true;
        }
        data.type = _.capitalize(data.type);
        data.textBookSelected = function() {
          if (parseInt(this.id) === parseInt(data.term_ids['textbook'])) {
            return 'selected';
          }
        };
        return data;
      };

      CollectionDetailsView.prototype.onShow = function() {
        Backbone.Syphon.deserialize(this, this.model.toJSON());
        console.log(this.$el.find('#qType').val());
        console.log(this.model.toJSON());
        if (this.model.get('type') === 'quiz') {
          this.$el.find('#qType').val(this.model.get('quiz_type'));
        }
        if (this.model.get('type') === 'quiz') {
          this._showCustomMessages(this.$el.find('#msgs'));
          this._toggleNegativeMarks(this.$el.find('input[name="negMarksEnable"]:checked'));
        }
        this.$el.find('select:not(#qType,#status)').select2();
        this.$el.find("#secs,#subsecs").val([]).select2();
        this.statusChanged();
        if (this.model.get('type') === 'quiz') {
          return this._changeLayout();
        }
      };

      CollectionDetailsView.prototype.statusChanged = function() {
        var _ref;
        if ((_ref = this.model.get('post_status')) === 'publish' || _ref === 'archive') {
          this.$el.find('input, textarea, select').prop('disabled', true);
          this.$el.find('select#status').prop('disabled', false);
          return this.$el.find('select#status option[value="underreview"]').prop('disabled', true);
        }
      };

      CollectionDetailsView.prototype.onFetchChaptersComplete = function(chapters) {
        var chapterElement, currentChapter, termIDs;
        this.$el.find('#chapters, #secs, #subsecs').select2('data', null);
        this.$el.find('#chapters, #secs, #subsecs').html('');
        chapterElement = this.$el.find('#chapters');
        termIDs = this.model.get('term_ids');
        currentChapter = termIDs['chapter'];
        return $.populateChaptersOrSections(chapters, chapterElement, currentChapter);
      };

      CollectionDetailsView.prototype.setChapterValue = function() {
        if (this.model.get('term_ids')['chapter']) {
          this.$el.find('#chapters').val(this.model.get('term_ids')['chapter']);
          this.$el.find('#chapters').select2();
          return this.$el.find('#chapters').trigger('change');
        }
      };

      CollectionDetailsView.prototype.onFetchSectionsComplete = function(sections) {
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

      CollectionDetailsView.prototype.onFetchSubsectionsComplete = function(subsections) {
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

      CollectionDetailsView.prototype.markSelected = function(element, sections) {
        if (this.model.isNew()) {
          return '';
        }
        return $("#" + element).val(this.model.get('term_ids')[sections]).select2();
      };

      CollectionDetailsView.prototype.save_content = function(e) {
        var data;
        e.preventDefault();
        $('#s2id_textbooks .select2-choice').removeClass('error');
        if (this.$el.find('#textbooks').val() === '') {
          $('#s2id_textbooks .select2-choice').addClass('error');
        }
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          if (data.negMarksEnable === 'true' && data.negMarks === '' && this.model.get('type') === 'quiz') {
            data.negMarks = 0;
          }
          return this.trigger("save:content:collection:details", data);
        }
      };

      CollectionDetailsView.prototype._toggleNegativeMarks = function(el) {
        console.log($(el).val());
        if ($(el).val() === 'true') {
          return this.$el.find("#negPercent").removeClass("none").addClass("inline");
        } else {
          return this.$el.find("#negPercent").addClass("none").removeClass("inline");
        }
      };

      CollectionDetailsView.prototype._showCustomMessages = function(el) {
        if ($(el).prop('checked')) {
          return this.$el.find('#customMsg').show();
        } else {
          return this.$el.find('#customMsg').hide();
        }
      };

      CollectionDetailsView.prototype._openCustomMsgPopup = function(e) {
        e.stopPropagation();
        return this.trigger('show:custom:msg:popup', {
          slug: $(e.target).closest('.customMsgLink').attr('data-slug')
        });
      };

      CollectionDetailsView.prototype._changeLayout = function() {
        var totalQuestions;
        totalQuestions = 0;
        _.each(this.model.get('content_layout'), (function(_this) {
          return function(content) {
            if (content.type === 'content-piece') {
              return totalQuestions += 1;
            } else {
              totalQuestions += parseInt(content.data.lvl1);
              totalQuestions += parseInt(content.data.lvl2);
              return totalQuestions += parseInt(content.data.lvl3);
            }
          };
        })(this));
        return this.$el.find('#total-question-number').val(totalQuestions);
      };

      CollectionDetailsView.prototype.onSavedContentGroup = function(model) {
        var attrs, msg;
        this.$el.find('#saved-success').remove();
        attrs = model.changedAttributes();
        msg = attrs.id ? 'saved' : 'updated';
        if (model.get('type') === 'teaching-module') {
          this.$el.find('.grid-title').prepend('<div id="saved-success">Training module ' + msg + '. Click here to <a href="#view-group/' + model.get('id') + '">view module</a><hr></div>');
        }
        if (model.get('type') === 'quiz') {
          return this.$el.find('.grid-title').prepend('<div id="saved-success">Quiz ' + msg + '. Click here to <a href="#view-quiz/' + model.get('id') + '">view the Quiz</a><hr></div>');
        }
      };

      return CollectionDetailsView;

    })(Marionette.ItemView);
  });
});
