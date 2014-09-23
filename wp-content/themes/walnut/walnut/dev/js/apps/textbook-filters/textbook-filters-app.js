var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/textbook-filters/views'], function(App, RegionController) {
  return App.module("TextbookFiltersApp", function(TextbookFilters, App, Backbone, Marionette, $, _) {
    TextbookFilters.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getTextbookFiltersView = __bind(this._getTextbookFiltersView, this);
        this.fetchSectionOrSubsection = __bind(this.fetchSectionOrSubsection, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var class_id, data;
        this.collection = opts.collection, this.model = opts.model, this.filters = opts.filters, this.selectedFilterParamsObject = opts.selectedFilterParamsObject, this.dataType = opts.dataType, this.contentSelectionType = opts.contentSelectionType, this.divisionsCollection = opts.divisionsCollection;
        if (!this.filters) {
          this.filters = ['textbooks', 'chapters', 'sections', 'subsections'];
        }
        class_id = this.divisionsCollection.first().get('class_id');
        if (class_id) {
          data = {
            'class_id': class_id
          };
        }
        this.textbooksCollection = App.request("get:textbooks", data);
        this.selectedFilterParamsObject.setHandler("get:selected:parameters", (function(_this) {
          return function() {
            var ele, term_id, textbook_filters, _i, _len, _results;
            textbook_filters = $(_this.view.el).find('select.textbook-filter');
            _results = [];
            for (_i = 0, _len = textbook_filters.length; _i < _len; _i++) {
              ele = textbook_filters[_i];
              if ($(ele).val() != null) {
                _results.push(term_id = {
                  id: $(ele).val(),
                  text: $(ele).find(':selected').text()
                });
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this));
        this.selectedFilterParamsObject.setHandler("get:parameters:for:search", (function(_this) {
          return function() {
            var content_type, division, ele, post_status, term_id;
            ele = $(_this.view.el).find('#textbooks-filter');
            if ($(ele).val()) {
              term_id = $(ele).val();
            }
            ele = $(_this.view.el).find('#chapters-filter');
            if ($(ele).val()) {
              term_id = $(ele).val();
            }
            ele = $(_this.view.el).find('#sections-filter');
            if ($(ele).val()) {
              term_id = $(ele).val();
            }
            ele = $(_this.view.el).find('#subsections-filter');
            if ($(ele).val()) {
              term_id = $(ele).val();
            }
            ele = $(_this.view.el).find('#content-post-status-filter');
            post_status = $(ele).val();
            ele = $(_this.view.el).find('#content-type-filter');
            content_type = $(ele).val();
            ele = $(_this.view.el).find('#divisions-filter');
            division = $(ele).val();
            return data = {
              'term_id': term_id,
              'post_status': post_status,
              'content_type': content_type,
              'division': division
            };
          };
        })(this));
        return App.execute("when:fetched", this.textbooksCollection, (function(_this) {
          return function() {
            var view;
            _this.view = view = _this._getTextbookFiltersView(_this.collection);
            _this.show(_this.view, {
              loading: true
            });
            _this.listenTo(_this.view, "update:pager", function() {
              return _this.region.trigger("update:pager");
            });
            _this.listenTo(_this.view, "show", function() {
              var chapter_id, fetchChapters, fetchSections, section_id, subsection_id, term_ids, textbook_id;
              if (_this.model) {
                term_ids = _this.model.get('term_ids');
                if (term_ids) {
                  textbook_id = term_ids['textbook'];
                  if (term_ids['chapter'] != null) {
                    chapter_id = term_ids['chapter'];
                  }
                  if (term_ids['sections'] != null) {
                    section_id = _.first(_.flatten(term_ids['sections']));
                  }
                  if (term_ids['subsections'] != null) {
                    subsection_id = _.first(_.flatten(term_ids['subsections']));
                  }
                  if (textbook_id != null) {
                    fetchChapters = _this.fetchSectionOrSubsection(textbook_id, 'textbooks-filter', chapter_id);
                  }
                  if (chapter_id != null) {
                    fetchSections = _this.fetchSectionOrSubsection(chapter_id, 'chapters-filter', section_id);
                  }
                  return fetchChapters.done(function() {
                    if (chapter_id != null) {
                      _this.fetchSectionOrSubsection(chapter_id, 'chapters-filter', section_id);
                    }
                    return fetchSections.done(function() {
                      if (section_id != null) {
                        return _this.fetchSectionOrSubsection(section_id, 'sections-filter', subsection_id);
                      }
                    });
                  });
                }
              }
            });
            _this.listenTo(_this.view, "fetch:chapters:or:sections", _this.fetchSectionOrSubsection);
            _this.listenTo(_this.view, "fetch:new:content", function(textbook_id, post_status) {
              var division, newContent;
              division = this.view.$el.find('#divisions-filter').val();
              data = {
                'textbook': textbook_id,
                'post_status': 'any',
                'division': division ? division : void 0
              };
              if (this.contentSelectionType === 'quiz') {
                data.content_type = ['student_question'];
              } else if (this.contentSelectionType === 'teaching-module') {
                data.content_type = ['teacher_question', 'content_piece'];
              }
              if (this.dataType === 'teaching-modules') {
                newContent = App.request("get:content:groups", data);
              } else if (this.dataType === 'quiz') {
                newContent = App.request("get:quizes", data);
              } else {
                newContent = App.request("get:content:pieces", data);
              }
              return App.execute("when:fetched", newContent, (function(_this) {
                return function() {
                  return _this.view.triggerMethod("new:content:fetched");
                };
              })(this));
            });
            return _this.listenTo(_this.view, "fetch:textbooks:by:division", function(division) {
              var divisionModel, tCollection;
              divisionModel = _this.divisionsCollection.get(division);
              class_id = divisionModel.get('class_id');
              tCollection = App.request("get:textbooks", {
                'class_id': class_id
              });
              return App.execute("when:fetched", tCollection, function() {
                _this.view.triggerMethod("fetch:chapters:or:sections:completed", tCollection, 'divisions-filter');
                _this.view.$el.find('#textbooks-filter').trigger('change');
                return _this.region.trigger("division:changed", division);
              });
            });
          };
        })(this));
      };

      Controller.prototype.fetchSectionOrSubsection = function(parentID, filterType, currItem) {
        var chaptersOrSections, defer;
        defer = $.Deferred();
        chaptersOrSections = App.request("get:chapters", {
          'parent': parentID
        });
        App.execute("when:fetched", chaptersOrSections, (function(_this) {
          return function() {
            _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType, currItem);
            return defer.resolve();
          };
        })(this));
        return defer.promise();
      };

      Controller.prototype._getTextbookFiltersView = function(collection) {
        return new TextbookFilters.Views.TextbookFiltersView({
          collection: collection,
          contentGroupModel: this.model,
          textbooksCollection: this.textbooksCollection,
          divisionsCollection: this.divisionsCollection,
          filters: this.filters,
          dataType: this.dataType
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:textbook:filters:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new TextbookFilters.Controller(opt);
    });
  });
});
