define(['jquery', 'underscore'], function($, _) {
  $.populateChapters = function(chaps, ele, curr_chapter) {
    if (curr_chapter == null) {
      curr_chapter = 0;
    }
    ele.select2().select2('data', null);
    ele.html('');
    if (_.size(chaps) > 0) {
      _.each(chaps.models, (function(_this) {
        return function(chap, index) {
          return ele.append('<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>');
        };
      })(this));
      return ele.select2().select2('val', curr_chapter);
    }
  };
  $.populateSections = function(sections, ele, sectionIDs) {
    if (sectionIDs == null) {
      sectionIDs = [];
    }
    ele.select2().select2('data', null);
    ele.html('');
    if (_.size(sections) > 0) {
      _.each(sections, (function(_this) {
        return function(section, index) {
          return ele.append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
        };
      })(this));
      return ele.select2().select2('val', sectionIDs);
    }
  };
  return $.populateSubSections = function(subsections, ele, subSectionIDs) {
    if (subSectionIDs == null) {
      subSectionIDs = [];
    }
    ele.select2().select2('data', null);
    ele.html('');
    if (_.size(subsections) > 0) {
      _.each(subsections, (function(_this) {
        return function(section, index) {
          return ele.append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
        };
      })(this));
      return ele.select2().select2('val', subSectionIDs);
    }
  };
});
