var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TextbookFiltersApp", function(TextbookFilters, App, Backbone, Marionette, $, _) {
    TextbookFilters.Controller = (function(_super) {
      var TextbookFiltersView;

      __extends(Controller, _super);

      function Controller() {
        this._getTextbookFiltersView = __bind(this._getTextbookFiltersView, this);
        this.fetchSectionOrSubsection = __bind(this.fetchSectionOrSubsection, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.contentPiecesCollection = opts.contentPiecesCollection, this.model = opts.model, this.textbooksCollection = opts.textbooksCollection;
        this.view = view = this._getTextbookFiltersView(this.contentPiecesCollection);
        this.show(this.view, {
          loading: true
        });
        this.listenTo(this.view, "show", (function(_this) {
          return function() {
            var chapter_id, fetchChapters, fetchSections, section_id, subsection_id, term_ids, textbook_id;
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
          };
        })(this));
        return this.listenTo(this.view, "fetch:chapters:or:sections", this.fetchSectionOrSubsection);
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
        return new TextbookFiltersView({
          collection: collection,
          fullCollection: collection.clone(),
          contentGroupModel: this.model,
          textbooksCollection: this.textbooksCollection
        });
      };

      TextbookFiltersView = (function(_super1) {
        __extends(TextbookFiltersView, _super1);

        function TextbookFiltersView() {
          return TextbookFiltersView.__super__.constructor.apply(this, arguments);
        }

        TextbookFiltersView.prototype.template = '<div class="col-xs-11"> <div class="filters"> <div class="table-tools-actions"> <span id="textbook-filters"></span> <select class="content-type-filter" id="content-type-filter" style="width:150px"> <option value="">All</option> <option value="teacher_question">Teacher Question</option> <option value="content_piece">Content Piece</option> </select> </div> </div> </div> <div class="col-xs-1"></div> <div class="clearfix"></div> <div class="col-sm-12"></div>';

        TextbookFiltersView.prototype.className = 'row';

        TextbookFiltersView.prototype.events = {
          'change .filters': function(e) {
            return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
          },
          'change #check_all_div': 'checkAll',
          'click #add-content-pieces': 'addContentPieces'
        };

        TextbookFiltersView.prototype.onShow = function() {
          var term_ids, textbookFiltersHTML;
          this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
          this.fullCollection = Marionette.getOption(this, 'fullCollection');
          textbookFiltersHTML = $.showTextbookFilters({
            textbooks: this.textbooksCollection
          });
          this.$el.find('#textbook-filters').html(textbookFiltersHTML);
          $("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
          $('#dataContentTable').tablesorter();
          this.contentGroupModel = Marionette.getOption(this, 'contentGroupModel');
          term_ids = this.contentGroupModel.get('term_ids');
          $("#textbooks-filter").select2().select2('val', term_ids['textbook']);
          return this.setFilteredContent();
        };

        TextbookFiltersView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType, currItem) {
          switch (filterType) {
            case 'textbooks-filter':
              $.populateChapters(filteredCollection, this.$el, currItem);
              break;
            case 'chapters-filter':
              $.populateSections(filteredCollection, this.$el, currItem);
              break;
            case 'sections-filter':
              $.populateSubSections(filteredCollection, this.$el, currItem);
          }
          return this.setFilteredContent();
        };

        TextbookFiltersView.prototype.setFilteredContent = function() {
          var filtered_data, pagerOptions;
          filtered_data = $.filterTableByTextbooks(this);
          this.collection.set(filtered_data);
          $("#dataContentTable").trigger("updateCache");
          pagerOptions = {
            container: $(".pager"),
            output: '{startRow} to {endRow} of {totalRows}'
          };
          return $('#dataContentTable').tablesorterPager(pagerOptions);
        };

        return TextbookFiltersView;

      })(Marionette.ItemView);

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
