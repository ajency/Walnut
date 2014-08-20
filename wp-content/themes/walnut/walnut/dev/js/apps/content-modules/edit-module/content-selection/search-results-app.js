var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentSelectionApp.SearchResults", function(SearchResults, App, Backbone, Marionette, $, _) {
    var SearchResultsLayout;
    SearchResults.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._searchContent = __bind(this._searchContent, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.contentGroupCollection = opts.contentGroupCollection, this.groupType = opts.groupType, this.selectedFilterParamsObject = opts.selectedFilterParamsObject;
        this.layout = layout = this._getSearchResultsLayout();
        this.searchCollection = App.request("empty:content:pieces:collection");
        this.show(layout, {
          loading: true
        });
        this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            return App.execute("show:all:content:selection:app", {
              region: _this.layout.contentSelectionRegion,
              contentPiecesCollection: _this.searchCollection,
              contentGroupCollection: _this.contentGroupCollection,
              groupType: _this.groupType
            });
          };
        })(this));
        return this.listenTo(this.layout, "search:content", this._searchContent);
      };

      Controller.prototype._searchContent = function(searchStr, useFilters) {
        var content_type, filters;
        content_type = this.groupType === 'teaching-module' ? ['teacher_question', 'content_piece'] : ['student_question'];
        filters = {};
        if (useFilters) {
          filters = this.selectedFilterParamsObject.request("get:parameters:for:search");
          if (filters.content_type) {
            content_type = [filters.content_type];
          }
        }
        this.newCollection = App.request("get:content:pieces", {
          content_type: content_type,
          search_str: searchStr,
          textbook: filters != null ? filters.term_id : void 0,
          post_status: filters != null ? filters.post_status : void 0,
          exclude: this.contentGroupCollection.pluck('ID')
        });
        return App.execute("when:fetched", this.newCollection, (function(_this) {
          return function() {
            _this.searchCollection.reset(_this.newCollection.models);
            return _this.layout.contentSelectionRegion.trigger("update:pager");
          };
        })(this));
      };

      Controller.prototype._getSearchResultsLayout = function() {
        return new SearchResultsLayout();
      };

      return Controller;

    })(RegionController);
    SearchResultsLayout = (function(_super) {
      __extends(SearchResultsLayout, _super);

      function SearchResultsLayout() {
        this.searchContent = __bind(this.searchContent, this);
        return SearchResultsLayout.__super__.constructor.apply(this, arguments);
      }

      SearchResultsLayout.prototype.template = 'Search: <input type="text" class="search-box" id="search-box"> <input id="use-filters" type="checkbox"> <span class="small"> Search with filters</span> <button class="btn btn-success btn-cons2" id="search-btn">Search</button> <label id="error-div" style="display:none"><span class="small text-error">Please enter the search keyword</span></label> <div id="content-selection-region"></div>';

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
          return this.trigger("search:content", searchStr, useFilters);
        } else {
          return this.$el.find("#error-div").show();
        }
      };

      return SearchResultsLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:content:search:results:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new SearchResults.Controller(opt);
    });
  });
});
