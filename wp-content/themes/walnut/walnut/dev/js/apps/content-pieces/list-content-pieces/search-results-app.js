var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentPiecesApp.ContentList.SearchResults", function(SearchResults, App, Backbone, Marionette, $, _) {
    var SearchResultsLayout;
    SearchResults.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._searchContent = __bind(this._searchContent, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.textbooksCollection = opts.textbooksCollection, this.selectedFilterParamsObject = opts.selectedFilterParamsObject;
        this.layout = layout = this._getSearchResultsLayout();
        this.searchCollection = App.request("empty:content:pieces:collection");
        this.show(layout, {
          loading: true
        });
        this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            return App.execute("show:list:content:pieces:app", {
              region: _this.layout.contentSelectionRegion,
              contentPiecesCollection: _this.searchCollection,
              textbooksCollection: _this.textbooksCollection
            });
          };
        })(this));
        return this.listenTo(this.layout, "search:content", this._searchContent);
      };

      Controller.prototype._searchContent = function(searchStr, useFilters) {
        var filters;
        filters = {};
        if (useFilters) {
          filters = this.selectedFilterParamsObject.request("get:parameters:for:search");
        }
        if (!filters.post_status) {
          filters.post_status = 'any';
        }
        this.newCollection = App.request("get:content:pieces", {
          search_str: searchStr,
          textbook: filters.term_id ? filters.term_id : void 0,
          post_status: filters.post_status ? filters.post_status : void 0,
          content_type: filters.content_type ? [filters.content_type] : void 0
        });
        return App.execute("when:fetched", this.newCollection, (function(_this) {
          return function() {
            _this.searchCollection.reset(_this.newCollection.models);
            _this.layout.contentSelectionRegion.trigger("update:pager");
            return _this.layout.$el.find('.progress-spinner').hide();
          };
        })(this));
      };

      Controller.prototype._getSearchResultsLayout = function() {
        return new SearchResultsLayout();
      };

      return Controller;

    })(RegionController);
    return SearchResultsLayout = (function(_super) {
      __extends(SearchResultsLayout, _super);

      function SearchResultsLayout() {
        this.searchContent = __bind(this.searchContent, this);
        return SearchResultsLayout.__super__.constructor.apply(this, arguments);
      }

      SearchResultsLayout.prototype.template = 'Search: <input type="text" class="search-box" id="search-box"> <input id="use-filters" type="checkbox"> <span class="small"> Search with filters</span> <button class="btn btn-success btn-cons2" id="search-btn"> <i class="none progress-spinner fa fa-spinner fa-spin"></i> Search </button> <label id="error-div" class="none"><span class="small text-error">Please enter the search keyword</span></label> <div id="content-selection-region"></div>';

      SearchResultsLayout.prototype.regions = {
        contentSelectionRegion: '#content-selection-region'
      };

      SearchResultsLayout.prototype.events = {
        'click #search-btn': 'searchContent',
        'keypress .search-box': function(e) {
          if (e.which === 13) {
            return this.searchContent();
          }
        }
      };

      SearchResultsLayout.prototype.searchContent = function() {
        var searchStr, useFilters;
        searchStr = _.trim(this.$el.find('#search-box').val());
        if (this.$el.find('#use-filters').is(":checked")) {
          useFilters = true;
        } else {
          useFilters = false;
        }
        if (searchStr) {
          this.$el.find("#error-div").hide();
          this.$el.find('.progress-spinner').show();
          return this.trigger("search:content", searchStr, useFilters);
        } else {
          return this.$el.find("#error-div").show();
        }
      };

      return SearchResultsLayout;

    })(Marionette.Layout);
  });
});
