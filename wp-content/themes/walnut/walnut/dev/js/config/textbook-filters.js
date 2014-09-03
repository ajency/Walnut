define(['jquery', 'underscore'], function($, _) {
  $.showTextbookFilters = function(opts) {
    var ChapterItems, divHtml, textbookItems;
    if (opts == null) {
      opts = {};
    }
    divHtml = '';
    if (opts.textbooks) {
      textbookItems = '';
      opts.textbooks.each(function(t) {
        return textbookItems += '<option value=' + t.get('term_id') + '>' + t.get('name') + '</option>';
      });
      divHtml += '<select class="textbook-filter select2-filters" id="textbooks-filter"> <option value="">All Textbooks</option>' + textbookItems + '</select> <select class="textbook-filter select2-filters" id="chapters-filter"> <option value="">All Chapters</option> </select>';
    }
    if (opts.chapters) {
      ChapterItems = '';
      opts.chapters.each(function(t) {
        return ChapterItems += '<option value=' + t.get('term_id') + '>' + t.get('name') + '</option>';
      });
      divHtml += '<select class="textbook-filter select2-filters" id="chapters-filter"> <option value="">All Chapters</option>' + ChapterItems + '</select>';
    }
    return divHtml += '<select class="textbook-filter select2-filters" id="sections-filter"> <option value="">All Sections</option> </select> <select class="textbook-filter select2-filters" id="subsections-filter"> <option value="">All Sub Sections</option> </select>';
  };
  $.populateChapters = function(items, ele, curr_item) {
    var chapterElement, selectedTextbook, txt;
    if (curr_item == null) {
      curr_item = '';
    }
    ele.find('#chapters-filter,#sections-filter,#subsections-filter').html('');
    chapterElement = ele.find('#chapters-filter');
    selectedTextbook = ele.find("#textbooks-filter").val();
    if (items instanceof Backbone.Collection) {
      items = items.models;
    }
    if (_.size(items) > 0 && selectedTextbook) {
      chapterElement.select2('data', {
        'text': 'Select Chapter'
      });
      chapterElement.append('<option value="">All Chapters</option>');
      _.each(items, (function(_this) {
        return function(item, index) {
          return chapterElement.append('<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>');
        };
      })(this));
      if (curr_item) {
        return chapterElement.select2().select2('val', curr_item);
      }
    } else {
      txt = 'All' != null ? 'All' : !{
        selectedTextbook: 'No'
      };
      chapterElement.select2('data', {
        'text': txt + ' chapters'
      });
      ele.find('#sections-filter').select2('data', {
        'text': txt + ' Sections'
      });
      return ele.find('#subsections-filter').select2('data', {
        'text': txt + ' Sub Sections'
      });
    }
  };
  $.populateSections = function(items, ele, curr_item) {
    var sectionElement, selectedChapter, txt;
    if (curr_item == null) {
      curr_item = [];
    }
    ele.find('#sections-filter,#subsections-filter').html('');
    sectionElement = ele.find('#sections-filter');
    selectedChapter = ele.find("#chapters-filter").val();
    if (items instanceof Backbone.Collection) {
      items = items.models;
    }
    if (_.size(items) > 0 && selectedChapter) {
      sectionElement.select2('data', {
        'text': 'Select Section'
      });
      sectionElement.append('<option value="">All Sections</option>');
      _.each(items, (function(_this) {
        return function(item, index) {
          return sectionElement.append('<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>');
        };
      })(this));
      if (_.isArray(curr_item)) {
        curr_item = _.flatten(_.compact(curr_item));
      }
      if (!_.isEmpty(curr_item)) {
        return sectionElement.select2().select2('val', curr_item);
      }
    } else {
      txt = 'All' != null ? 'All' : !{
        selectedChapter: 'No'
      };
      sectionElement.select2('data', {
        'text': txt + ' Sections'
      });
      return ele.find('#subsections-filter').select2('data', {
        'text': txt + ' Sub Sections'
      });
    }
  };
  $.populateSubSections = function(items, ele, curr_item) {
    var selectedSection, subsectionsElement, txt;
    if (curr_item == null) {
      curr_item = [];
    }
    subsectionsElement = ele.find('#subsections-filter');
    subsectionsElement.html('');
    selectedSection = ele.find("#sections-filter").val();
    if (items instanceof Backbone.Collection) {
      items = items.models;
    }
    if (_.size(items) > 0 && selectedSection) {
      subsectionsElement.select2('data', {
        'text': 'Select Sub Section'
      });
      subsectionsElement.append('<option value="">All Sections</option>');
      _.each(items, (function(_this) {
        return function(item, index) {
          return subsectionsElement.append('<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>');
        };
      })(this));
      if (_.isArray(curr_item)) {
        curr_item = _.flatten(_.compact(curr_item));
      }
      if (!_.isEmpty(curr_item)) {
        return subsectionsElement.select2().select2('val', curr_item);
      }
    } else {
      txt = 'All' != null ? 'All' : !{
        selectedSection: 'No'
      };
      return subsectionsElement.select2('data', {
        'text': txt + ' Sub Sections'
      });
    }
  };
  $.populateChaptersOrSections = function(items, ele, curr_item) {
    if (curr_item == null) {
      curr_item = [];
    }
    ele.html('');
    if (items instanceof Backbone.Collection) {
      items = items.models;
    }
    if (_.size(items) > 0) {
      _.each(items, (function(_this) {
        return function(item, index) {
          return ele.append('<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>');
        };
      })(this));
      if (_.isArray(curr_item)) {
        curr_item = _.flatten(_.compact(curr_item));
      }
      return ele.select2().select2('val', curr_item);
    }
  };
  return $.filterTableByTextbooks = function(_this) {
    var content_post_status, content_status, content_type, difficulty_level, filterCollection, filter_elements, filter_ids, filtered_data, filtered_models, quiz_type;
    filter_elements = _this.$el.find('select.textbook-filter');
    filterCollection = _this.fullCollection.clone();
    filter_ids = _.map(filter_elements, function(ele, index) {
      var item;
      item = '';
      if (!isNaN(ele.value)) {
        item = ele.value;
      }
      return item;
    });
    filter_ids = _.compact(filter_ids);
    content_type = _this.$el.find('#content-type-filter').val();
    content_status = _this.$el.find('#content-status-filter').val();
    content_post_status = _this.$el.find('#content-post-status-filter').val();
    quiz_type = _this.$el.find('#quiz-type-filter').val();
    difficulty_level = parseInt(_this.$el.find('#difficulty-level-filter').val());
    if (content_type) {
      filterCollection.reset(filterCollection.where({
        'content_type': content_type
      }));
    }
    if (content_status) {
      filterCollection.reset(filterCollection.where({
        'status': content_status
      }));
    }
    if (content_post_status) {
      filterCollection.reset(filterCollection.where({
        'post_status': content_post_status
      }));
    }
    if (quiz_type) {
      filterCollection.reset(filterCollection.where({
        'quiz_type': quiz_type
      }));
    }
    if (difficulty_level) {
      filterCollection.reset(filterCollection.where({
        'difficulty_level': difficulty_level
      }));
    }
    filtered_models = filterCollection.models;
    if (_.size(filter_ids) > 0) {
      filtered_data = _.filter(filtered_models, (function(_this) {
        return function(item) {
          var filtered_item, term_ids;
          filtered_item = '';
          term_ids = _.flatten(item.get('term_ids'));
          if (_.size(_.intersection(term_ids, filter_ids)) === _.size(filter_ids)) {
            filtered_item = item;
          }
          return filtered_item;
        };
      })(this));
    } else {
      filtered_data = filtered_models;
    }
    return filtered_data;
  };
});
