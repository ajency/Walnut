var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/content-creator/options-bar/templates/options-bar.html', 'bootbox'], function(App, optionsBarTpl, bootbox) {
  return App.module("ContentCreator.OptionsBar.Views", function(Views, App) {
    return Views.OptionsBarView = (function(superClass) {
      extend(OptionsBarView, superClass);

      function OptionsBarView() {
        this.configureEditor = bind(this.configureEditor, this);
        this._commentEnable = bind(this._commentEnable, this);
        this._hintEnable = bind(this._hintEnable, this);
        return OptionsBarView.__super__.constructor.apply(this, arguments);
      }

      OptionsBarView.prototype.template = optionsBarTpl;

      OptionsBarView.prototype.events = {
        'change #subs': function(e) {
          return this.trigger("fetch:chapters", $(e.target).val());
        },
        'change #chaps': function(e) {
          return this.trigger("fetch:sections", $(e.target).val());
        },
        'change #secs': function(e) {
          return this.trigger("fetch:subsections", $(e.target).val());
        },
        'change #qType': '_changeOfQuestionType',
        'click #save-question': 'onSaveQuestionSettings',
        'click #preview-question': 'previewQuestion',
        'click #close-content-creator': function() {
          return bootbox.confirm('Are you sure you want to close the content creator? Caution: Unsaved content will be lost.', function(result) {
            if (result) {
              return App.navigate('', true);
            }
          });
        },
        'click #clone-question': function() {
          var cpModel;
          cpModel = App.request("new:content:piece");
          cpModel.set(this.model.toJSON());
          return cpModel.duplicate();
        },
        'click a.tabs': '_changeTabs',
        'change #hint_enable': '_hintEnable',
        'change #comment_enable': '_commentEnable',
        'blur .comment-area': '_saveComment',
        'click .cke_button__image': 'imageClicked'
      };

      OptionsBarView.prototype.modelEvents = {
        'change:ID': function() {
          return this.$el.find('#preview-question, #clone-question').show();
        }
      };

      OptionsBarView.prototype.mixinTemplateHelpers = function(data) {
        data = OptionsBarView.__super__.mixinTemplateHelpers.call(this, data);
        data.isStudentQuestion = this.model.get('content_type') === 'student_question' ? true : false;
        data.isTeacherQuestion = this.model.get('content_type') === 'teacher_question' ? true : false;
        data.isContentPiece = this.model.get('content_type') === 'content_piece' ? true : false;
        data.instructionsLabel = this.model.get('content_type') === 'content_piece' ? 'Procedure Summary' : 'Instructions';
        return data;
      };

      OptionsBarView.prototype.onShow = function() {
        var ele;
        ele = this.$el.find(".instructions");
        this.$el.find('#subs').trigger('change');
        $(ele).css({
          'height': $(ele).prop('scrollHeight') + "px"
        });
        Backbone.Syphon.deserialize(this, this.model.toJSON());
        this.$el.find("#subs, #chaps, #qType, #status, #secs, #subsecs, #difficulty_level ").select2();
        this.$el.find('input.tagsinput').tagsinput();
        if (this.model.get('hint_enable')) {
          this.$el.find('#hint_enable').trigger('click');
        }
        if (this.model.get('comment_enable')) {
          this.$el.find('#comment_enable').trigger('click');
        }
        if (this.model.get('content_type') !== 'teacher_question') {
          this.$el.find('#question_type_column').remove();
        }
        if (!this.model.isNew()) {
          return this.$el.find('#preview-question, #clone-question').show();
        }
      };

      OptionsBarView.prototype.imageClicked = function(evt) {
        evt.preventDefault();
        return console.log('imageClicked');
      };

      OptionsBarView.prototype._saveComment = function() {
        return console.log('_saveComment');
      };

      OptionsBarView.prototype._changeTabs = function(e) {
        e.preventDefault();
        return $(e.target).tab('show');
      };

      OptionsBarView.prototype._hintEnable = function(e) {
        if ($(e.target).prop('checked')) {
          this.$el.find('#question-hint').prop('disabled', false);
          return this.$el.find('#question-hint').show();
        } else {
          this.$el.find('#question-hint').prop('disabled', true);
          return this.$el.find('#question-hint').hide();
        }
      };

      OptionsBarView.prototype._commentEnable = function(e) {
        var ele;
        if ($(e.target).prop('checked')) {
          this.$el.find('#question-comment').prop('disabled', false);
          this.$el.find('#question-comment').hide();
          ele = this.$el.find("#question-comment");
          CKEDITOR.dtd.$removeEmpty['span'] = false;
          ele.attr('commenteditable', 'true').attr('id', _.uniqueId('text-'));
          CKEDITOR.on('instanceCreated', this.configureEditor);
          this.editor = CKEDITOR.inline(document.getElementById(ele.attr('id')));
          return this.editor.setData(_.stripslashes(this.model.get('content')));
        } else {
          this.$el.find('#question-comment').prop('disabled', true);
          return this.$el.find('#question-comment').hide();
        }
      };

      OptionsBarView.prototype.configureEditor = function(event) {
        var editor, ele, element;
        console.log('ss');
        ele = this.$el.find("#question-comment");
        editor = event.editor;
        element = editor.element;
        if (element.getAttribute('id') === ele.attr('id')) {
          return editor.on('configLoaded', function() {
            return editor.config.placeholder = 'This is a Text Block. Use this to provide text…';
          });
        }
      };

      OptionsBarView.prototype.onFetchChaptersComplete = function(chapters) {
        var chapterElement, currentChapter, termIDs;
        this.$el.find('#chaps, #secs, #subsecs').select2('data', null);
        this.$el.find('#chaps, #secs, #subsecs').html('');
        chapterElement = this.$el.find('#chaps');
        termIDs = this.model.get('term_ids');
        currentChapter = termIDs ? termIDs['chapter'] : '';
        $.populateChaptersOrSections(chapters, chapterElement, currentChapter);
        return this.$el.find('#chaps').trigger('change');
      };

      OptionsBarView.prototype.onFetchSectionsComplete = function(sections) {
        var sectionIDs, sectionsElement, term_ids;
        this.$el.find('#secs, #subsecs').select2('data', null);
        this.$el.find('#secs, #subsecs').html('');
        term_ids = this.model.get('term_ids');
        if (term_ids != null) {
          sectionIDs = term_ids['sections'];
        }
        sectionsElement = this.$el.find('#secs');
        $.populateChaptersOrSections(sections, sectionsElement, sectionIDs);
        return this.$el.find('#secs').trigger('change');
      };

      OptionsBarView.prototype.onFetchSubsectionsComplete = function(subsections) {
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

      OptionsBarView.prototype._changeOfQuestionType = function(e) {
        if ($(e.target).val() === 'multiple_eval') {
          return this.trigger('show:grading:parameter');
        } else {
          return this.trigger('close:grading:parameter');
        }
      };

      OptionsBarView.prototype.onSaveQuestionSettings = function(e) {
        var data, eleID, firstErr;
        console.log(this.$el.find('body .cke_contents_ltr').html());
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          return this.trigger("save:data:to:model", data);
        } else {
          firstErr = _.first(this.$el.find('.form-control.error'));
          $(firstErr).focus();
          if (_.str.contains(firstErr.id, 's2id')) {
            eleID = _.str.strRight(firstErr.id, '_');
            return this.$el.find("#" + eleID).data('select2').open();
          }
        }
      };

      OptionsBarView.prototype.previewQuestion = function() {
        if (this.model.get('content_type') === 'student_question') {
          return window.open(SITEURL + "/#dummy-quiz/" + this.model.id, {
            'target': 'blank'
          });
        } else {
          return window.open(SITEURL + "/#dummy-module/" + this.model.id, {
            'target': 'blank'
          });
        }
      };

      return OptionsBarView;

    })(Marionette.ItemView);
  });
});
