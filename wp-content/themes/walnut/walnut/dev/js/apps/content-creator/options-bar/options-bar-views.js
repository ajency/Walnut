var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/options-bar/templates/options-bar.html'], function(App, optionsBarTpl) {
  return App.module("ContentCreator.OptionsBar.Views", function(Views, App) {
    return Views.OptionsBarView = (function(_super) {
      __extends(OptionsBarView, _super);

      function OptionsBarView() {
        this.onFetchSubsectionsComplete = __bind(this.onFetchSubsectionsComplete, this);
        return OptionsBarView.__super__.constructor.apply(this, arguments);
      }

      OptionsBarView.prototype.template = optionsBarTpl;

      OptionsBarView.prototype.events = {
        'change #subs': '_changeSubject',
        'change #chaps': '_changeChapter',
        'change #qType': '_changeOfQuestionType',
        'click  #save-question': 'saveQuestionSettings',
        'click #preview-question': 'previewQuestion',
        'click #subProps.nav-tabs': '_changeTabs'
      };

      OptionsBarView.prototype.mixinTemplateHelpers = function(data) {
        data = OptionsBarView.__super__.mixinTemplateHelpers.call(this, data);
        data.isStudentQuestion = this.model.get('content_type') === 'student_question' ? true : false;
        return data;
      };

      OptionsBarView.prototype.onShow = function() {
        var postStatus, qType;
        this.$el.find("#subs, #chaps, #qType, #status, #secs, #subsecs, #difficulty_level ").select2();
        this.$el.find('input.tagsinput').tagsinput();
        $('#subProps a').click(function(e) {
          e.preventDefault();
          return $(this).tab('show');
        });
        if (this.model.get('ID')) {
          qType = this.model.get('question_type');
          this.$el.find('#qType').select2().select2('val', qType);
          postStatus = this.model.get('post_status');
          this.$el.find('#status').select2().select2('val', postStatus);
          this.$el.find('#difficulty_level').select2().select2('val', this.model.get('difficulty_level'));
        }
        if (this.model.get('content_type') !== 'teacher_question') {
          return this.$el.find('#question_type_column').remove();
        }
      };

      OptionsBarView.prototype._changeTabs = function(e) {
        var tabId, tabPaneId;
        tabId = this.$el.find('#subProps.nav-tabs li.active').attr('id');
        tabPaneId = tabId + '-pane';
        console.log(tabPaneId);
        this.$el.find('.tab-content .tab-pane').removeClass('active');
        return this.$el.find(".tab-content #" + tabPaneId + ".tab-pane").addClass('active');
      };

      OptionsBarView.prototype._changeSubject = function(e) {
        this.$el.find('#chaps, #secs, #subsecs').select2('data', null);
        this.$el.find('#chaps, #secs, #subsecs').html('');
        return this.trigger("fetch:chapters", $(e.target).val());
      };

      OptionsBarView.prototype._changeChapter = function(e) {
        this.$el.find('#secs, #subsecs').select2('data', null);
        this.$el.find('#secs, #subsecs').html('');
        return this.trigger("fetch:sections:subsections", $(e.target).val());
      };

      OptionsBarView.prototype.onFetchChaptersComplete = function(chaps, curr_chapter) {
        if (_.size(chaps) > 0) {
          this.$el.find('#chaps').html('');
          _.each(chaps.models, (function(_this) {
            return function(chap, index) {
              return _this.$el.find('#chaps').append("<option value='" + (chap.get('term_id')) + "'>" + (chap.get('name')) + "</option>");
            };
          })(this));
          return this.$el.find('#chaps').select2().select2('val', curr_chapter);
        } else {
          return this.$el.find('#chaps').select2().select2('data', null);
        }
      };

      OptionsBarView.prototype.onFetchSubsectionsComplete = function(allsections) {
        var sectionIDs, subSectionIDs, term_ids;
        term_ids = this.model.get('term_ids');
        if (term_ids != null) {
          sectionIDs = term_ids['sections'];
        }
        if (term_ids != null) {
          subSectionIDs = term_ids['subsections'];
        }
        if (_.size(allsections) > 0) {
          if (_.size(allsections.sections) > 0) {
            this.$el.find('#secs').html('');
            _.each(allsections.sections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#secs').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
            this.$el.find('#secs').select2().select2('val', sectionIDs);
          } else {
            this.$el.find('#secs').select2().select2('data', null);
          }
          if (_.size(allsections.subsections) > 0) {
            this.$el.find('#subsecs').html('');
            _.each(allsections.subsections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#subsecs').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
            return this.$el.find('#subsecs').select2().select2('val', subSectionIDs);
          } else {
            return this.$el.find('#subsecs').select2().select2('data', null);
          }
        } else {
          return this.$el.find('#subsecs,#secs').select2().select2('data', null);
        }
      };

      OptionsBarView.prototype._changeOfQuestionType = function(e) {
        if ($(e.target).val() === 'multiple_eval') {
          return this.trigger('show:grading:parameter');
        } else {
          return this.trigger('close:grading:parameter');
        }
      };

      OptionsBarView.prototype.saveQuestionSettings = function() {
        var data;
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          this.trigger("save:data:to:model", data);
          return this.$el.find('#preview-question').show();
        }
      };

      OptionsBarView.prototype.previewQuestion = function() {
        return window.open(SITEURL + "/#content-piece/" + this.model.id, {
          'target': 'blank'
        });
      };

      return OptionsBarView;

    })(Marionette.ItemView);
  });
});
