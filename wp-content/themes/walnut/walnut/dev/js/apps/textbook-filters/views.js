var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("TextbookFiltersApp.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextbookFiltersView = (function(superClass) {
      extend(TextbookFiltersView, superClass);

      function TextbookFiltersView() {
        return TextbookFiltersView.__super__.constructor.apply(this, arguments);
      }

      TextbookFiltersView.prototype.template = '<div class="col-xs-11"> <div class="filters new-filter"> <div class="table-tools-actions"> {{#divisions_filter}} <select class="select2-filters div-filters" id="divisions-filter"> {{#divisions}} <option value="{{id}}">{{&name}}</option> {{/divisions}} </select> {{/divisions_filter}} {{#textbooks_multi_filter}} <select id="textbooks-filter" class="textbook-filter select2-filters multi-textbook-filter" multiple="multiple" data-placeholder="Select Textbook"> <!--option value="-1" selected>Select Textbook</option--> {{#textbooks}} <option value="{{id}}">{{&name}}</option> <{{/textbooks}} </select> <button type="button" class="multi-filters btn btn-small btn-success">Go</button> {{/textbooks_multi_filter}} {{#textbooks_filter}} <select class="textbook-filter select2-filters div-filters" id="textbooks-filter"> {{#textbooks}} <option value="{{id}}" >{{&name}}</option> {{/textbooks}} </select> {{/textbooks_filter}} {{#chapters_filter}} <select class="textbook-filter select2-filters div-filters" id="chapters-filter"> <option value="">All Chapters</option> </select> {{/chapters_filter}} {{#sections_filter}} <select class="textbook-filter select2-filters div-filters" id="sections-filter"> <option value="">All Sections</option> </select> {{/sections_filter}} {{#subsections_filter}} <select class="textbook-filter select2-filters div-filters" id="subsections-filter"> <option value="">All Sub Sections</option> </select> {{/subsections_filter}} {{#post_status_filter}} <select class="select2-filters selectFilter div-filters" id="content-post-status-filter"> <option value="any">All Status</option> <option value="pending">Under Review</option> <option value="publish">Published</option> <option value="archive">Archived</option> </select> {{/post_status_filter}} {{#post_status_report_filter}} <select class="select2-filters selectFilter div-filters" id="content-post-status-filter"> <option value="any">All Status</option> <!--option value="pending">Under Review</option--> <option value="publish" selected>Published</option> <option value="archive">Archived</option> </select> {{/post_status_report_filter}} {{#module_status_filter}} <select class="select2-filters selectFilter div-filters" id="content-post-status-filter"> <option value="any">All Status</option> <option value="underreview">Under Review</option> <option value="publish">Published</option> <option value="archive">Archived</option> </select> {{/module_status_filter}} {{#content_type_filter}} <select class="content-type-filter select2-filters selectFilter div-filters" id="content-type-filter"> <option value="">All Types</option> {{#teacher_question}} <option value="teacher_question">Teacher Question</option> {{/teacher_question}} {{#student_question}} <option value="student_question">Student Question</option> {{/student_question}} <option value="content_piece">Content Piece</option> </select> {{/content_type_filter}} <select class="select2-filters selectFilter difficulty-level-filter div-filters" style="display: none;" id="difficulty-level-filter"> <option value="">All Levels</option> <option value="1">Level 1</option> <option value="2">Level 2</option> <option value="3">level 3</option> </select> </div> </div> </div> <div class="col-xs-1"></div> <div class="clearfix"></div> <div class="col-sm-12"></div>';

      TextbookFiltersView.prototype.className = 'row';

      TextbookFiltersView.prototype.events = {
        'change #textbooks-filter.div-filters': function(e) {
          return this.trigger("fetch:new:content", $(e.target).val());
        },
        'click .multi-filters': function() {
          return this.trigger("fetch:new:content", $('.multi-textbook-filter').select2("val"));
        },
        'change #divisions-filter': function(e) {
          return this.trigger("fetch:textbooks:by:division", $(e.target).val());
        },
        'change .filters.new-filter .div-filters': function(e) {
          if (e.target.id !== 'divisions-filter') {
            this.$el.find('.filters .table-tools-actions').append('<span class="loading-collection small">Loading... <i class="fa fa-spinner fa-spin"> </i></span>');
            return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
          }
        },
        'change .filters.new-filter .multi-filters': function(e) {
          if (e.target.id !== 'divisions-filter') {
            this.$el.find('.filters .table-tools-actions').append('<span class="loading-collection small">Loading... <i class="fa fa-spinner fa-spin"> </i></span>');
            return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
          }
        },
        'change .content-type-filter': function(e) {
          if ($(e.target).val() === 'student_question') {
            this.$el.find('.difficulty-level-filter').show();
          } else {
            this.$el.find('.difficulty-level-filter').hide();
          }
          this.setFilteredContent();
          return this.trigger("update:pager");
        }
      };

      TextbookFiltersView.prototype.mixinTemplateHelpers = function() {
        var data, divisions, filters, textbooks;
        data = TextbookFiltersView.__super__.mixinTemplateHelpers.call(this, data);
        textbooks = Marionette.getOption(this, 'textbooksCollection');
        divisions = Marionette.getOption(this, 'divisionsCollection');
        data.textbooks = textbooks.map(function(m) {
          var t;
          t = [];
          t.id = m.get('term_id');
          t.name = m.get('name');
          return t;
        });
        if (divisions) {
          data.divisions = divisions.map(function(m) {
            var d;
            d = [];
            d.id = m.get('id');
            d.name = m.get('division');
            return d;
          });
        }
        filters = Marionette.getOption(this, 'filters');
        if (_.contains(filters, 'divisions')) {
          data.divisions_filter = true;
        }
        if (_.contains(filters, 'multi_textbooks')) {
          data.textbooks_multi_filter = true;
        }
        if (_.contains(filters, 'textbooks')) {
          data.textbooks_filter = true;
        }
        if (_.contains(filters, 'chapters')) {
          data.chapters_filter = true;
        }
        if (_.contains(filters, 'sections')) {
          data.sections_filter = true;
        }
        if (_.contains(filters, 'subsections')) {
          data.subsections_filter = true;
        }
        if (_.contains(filters, 'post_status')) {
          data.post_status_filter = true;
        }
        if (_.contains(filters, 'post_status_report')) {
          data.post_status_report_filter = true;
        }
        if (_.contains(filters, 'module_status')) {
          data.module_status_filter = true;
        }
        if (_.contains(filters, 'content_type')) {
          data.content_type_filter = true;
        }
        if (_.contains(filters, 'student_question')) {
          data.student_question = true;
        }
        if (_.contains(filters, 'teacher_question')) {
          data.teacher_question = true;
        }
        if (_.contains(filters, 'status')) {
          data.status_filter = true;
        }
        return data;
      };

      TextbookFiltersView.prototype.onShow = function() {
        var term_ids;
        console.log("onShow");
        $(".filters select").select2();
        this.contentGroupModel = Marionette.getOption(this, 'contentGroupModel');
        if (this.contentGroupModel) {
          term_ids = this.contentGroupModel.get('term_ids');
          $("#textbooks-filter").select2().select2('val', term_ids['textbook']);
          return this.setFilteredContent();
        }
      };

      TextbookFiltersView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType, currItem) {
        switch (filterType) {
          case 'divisions-filter':
            $.populateTextbooks(filteredCollection, this.$el, currItem);
            break;
          case 'textbooks-filter':
            $.populateChapters(filteredCollection, this.$el, currItem);
            break;
          case 'chapters-filter':
            $.populateSections(filteredCollection, this.$el, currItem);
            break;
          case 'sections-filter':
            $.populateSubSections(filteredCollection, this.$el, currItem);
        }
        if (filterType !== 'divisions-filter' && filterType !== 'textbooks-filter') {
          return this.setFilteredContent();
        }
      };

      TextbookFiltersView.prototype.setFilteredContent = function() {
        var dataType, filtered_data;
        console.log("setFilteredContent");
        dataType = Marionette.getOption(this, 'dataType');
        filtered_data = $.filterTableByTextbooks(this, dataType);
        this.collection.reset(filtered_data);
        this.trigger("update:pager");
        return this.$el.find('.loading-collection').remove();
      };

      TextbookFiltersView.prototype.onNewContentFetched = function() {
        return this.setFilteredContent();
      };

      TextbookFiltersView.prototype.onDivisionChanged = function(textbooksCollection) {};

      return TextbookFiltersView;

    })(Marionette.ItemView);
  });
});
