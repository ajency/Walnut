var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/student-training-module/edit-module/module-description/templates/collection-details.html'], function(App, collectionDetailsTpl) {
  return App.module('StudentTrainingEditDescription.Views', function(Views, App) {
    return Views.CollectionDetailsView = (function(superClass) {
      extend(CollectionDetailsView, superClass);

      function CollectionDetailsView() {
        this.permissionSelected = bind(this.permissionSelected, this);
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
        },
        'click .checkbox.perm': 'permissionSelected'
      };

      CollectionDetailsView.prototype.modelEvents = {
        'change:post_status': 'statusChanged',
        'change:content_layout': '_changeLayout'
      };

      CollectionDetailsView.prototype.mixinTemplateHelpers = function(data) {
        data = CollectionDetailsView.__super__.mixinTemplateHelpers.call(this, data);
        data.heading = this.model.isNew() ? 'Create a' : 'Edit a';
        data.type = _.titleize(_.humanize(data.type));
        if (data.isQuiz && data.permissions) {
          data.permissions['single_attempt'] = !data.permissions['single_attempt'];
        }
        data.textBookSelected = function() {
          if (parseInt(this.id) === parseInt(data.term_ids['textbook'])) {
            return 'selected';
          }
        };
        data.defaultRandomize = (function(_this) {
          return function() {
            if (data.isQuiz && _this.model.isNew()) {
              return 'checked="checked"';
            }
          };
        })(this);
        return data;
      };

      CollectionDetailsView.prototype.permissionSelected = function(e) {
        var permName;
        permName = $(e.target).closest('.checkbox.perm').find('input').attr('id');
        switch (permName) {
          case 'resubmit':
            return this.unSelectCheckbox('answer');
          case 'answer':
            return this.unSelectCheckbox('resubmit');
        }
      };

      CollectionDetailsView.prototype.unSelectCheckbox = function(checkboxID) {
        return this.$el.find('input#' + checkboxID).attr('checked', false);
      };

      CollectionDetailsView.prototype.onShow = function() {
        Backbone.Syphon.deserialize(this, this.model.toJSON());
        if (this.model.get('type') === 'quiz') {
          this.$el.find('#qType').val(this.model.get('quiz_type'));
        }
        if (this.model.get('type') === 'quiz') {
          this._toggleNegativeMarks(this.$el.find('input[name="negMarksEnable"]:checked'));
        }
        this.$el.find('select:not(#qType,#status)').select2();
        this.$el.find("#secs,#subsecs").val([]).select2();
        if (this.model.isNew()) {
          this.$el.find('select#status option[value="publish"]').prop('disabled', true);
          this.$el.find('select#status option[value="archive"]').prop('disabled', true);
        }
        this.statusChanged();
        if (this.model.get('type') === 'quiz') {
          return this._changeLayout();
        }
      };

      CollectionDetailsView.prototype.statusChanged = function() {
        var ref;
        if ((ref = this.model.get('post_status')) === 'publish' || ref === 'archive') {
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
        var data, required_fields, single_attempt;
        this.$el.find('#saved-success').remove();
        e.preventDefault();
        $('#s2id_textbooks .select2-choice,#s2id_chapters .select2-choice').removeClass('error');
        required_fields = true;
        if (_.isEmpty(this.$el.find('#textbooks').val())) {
          $('#s2id_textbooks .select2-choice').addClass('error');
          required_fields = false;
        }
        if (_.isEmpty(this.$el.find('#chapters').val())) {
          $('#s2id_chapters .select2-choice').addClass('error');
          required_fields = false;
        }
        if (this.$el.find('form').valid() && required_fields) {
          this.$el.find('#save-content-collection i').addClass('fa-spin fa-spinner');
          data = Backbone.Syphon.serialize(this);
          if (this.model.get('type') === 'quiz') {
            single_attempt = data.permissions['single_attempt'];
            data.permissions['single_attempt'] = !single_attempt;
            if (data.negMarksEnable === 'true' && data.negMarks === '' && this.model.get('type') === 'quiz') {
              data.negMarks = 0;
            }
          }
          if (data.post_status === 'publish') {
            if (this.model.get('type') === 'quiz' && _.isEmpty(this.model.get('content_layout'))) {
              this._cannotPublish();
              return false;
            }
            if (this.model.get('type') === 'teaching-module' && _.isEmpty(this.model.get('content_pieces'))) {
              this._cannotPublish();
              return false;
            }
          }
          return this.trigger("save:content:collection:details", data);
        }
      };

      CollectionDetailsView.prototype._cannotPublish = function() {
        var item, module;
        item = this.model.get('type') === 'quiz' ? 'questions' : 'Content Pieces';
        module = _.titleize(_.humanize(this.model.get('type')));
        this.$el.find('.grid-title').prepend('<div id="saved-success" class="text-error"> Cannot Publish ' + module + '. No ' + item + ' Added. </div>');
        $("html, body").animate({
          scrollTop: 0
        }, 700);
        return this.$el.find('#save-content-collection i').removeClass('fa-spin fa-spinner');
      };

      CollectionDetailsView.prototype._toggleNegativeMarks = function(el) {
        if ($(el).val() === 'true') {
          return this.$el.find("#negPercent").removeClass("none").addClass("inline");
        } else {
          return this.$el.find("#negPercent").addClass("none").removeClass("inline");
        }
      };

      CollectionDetailsView.prototype._openCustomMsgPopup = function(e) {
        e.stopPropagation();
        return this.trigger('show:custom:msg:popup', {
          slug: $(e.target).closest('.customMsgLink').attr('data-slug')
        });
      };

      CollectionDetailsView.prototype._changeLayout = function() {};

      CollectionDetailsView.prototype.onSavedContentGroup = function(model) {
        var attrs, msg, ref;
        this.$el.find('#saved-success').remove();
        this.$el.find('select#status option').prop('disabled', false);
        if ((ref = this.model.get('post_status')) === 'publish' || ref === 'archive') {
          this.$el.find('select#status option[value="underreview"]').prop('disabled', true);
        }
        this.$el.find('#save-content-collection i').removeClass('fa-spin fa-spinner').addClass('fa-check');
        attrs = model.changedAttributes();
        msg = attrs.id ? 'saved' : 'updated';
        this.$el.find('.grid-title').prepend('<div id="saved-success">Student training module ' + msg + '. Click here to <a href="#view-student-training-module/' + model.get('id') + '">view module.</a><hr></div>');
        return $("html, body").animate({
          scrollTop: 0
        }, 700);
      };

      return CollectionDetailsView;

    })(Marionette.ItemView);
  });
});
