var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ClassReportApp.SearchResults", function(SearchResults, App, Backbone, Marionette, $, _) {
    var SearchResultsLayout;
    SearchResults.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._searchContent = bind(this._searchContent, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.textbooksCollection = opts.textbooksCollection, this.selectedFilterParamsObject = opts.selectedFilterParamsObject;
        this.layout = layout = this._getSearchResultsLayout();
        this.searchCollection = App.request("empty:content:modules:collection");
        this.show(layout, {
          loading: true
        });
        this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            return App.execute("show:list:quiz:report:app", {
              region: _this.layout.contentSelectionRegion,
              contentModulesCollection: _this.searchCollection,
              textbooksCollection: _this.textbooksCollection
            });
          };
        })(this));
        this.listenTo(this.layout, "search:content", this._searchContent);
        return this.listenTo(this.layout.contentSelectionRegion, "show:quiz:report", function(quizModel) {
          return this.region.trigger("show:quiz:report", quizModel);
        });
      };

      Controller.prototype._searchContent = function(searchStr) {
        var filters;
        filters = this.selectedFilterParamsObject.request("get:parameters:for:search");
        this.newCollection = App.request("get:quizes", {
          search_str: searchStr,
          textbook: filters.term_id != null ? filters.term_id : void 0,
          division: filters.division != null ? filters.division : void 0
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
    return SearchResultsLayout = (function(superClass) {
      extend(SearchResultsLayout, superClass);

      function SearchResultsLayout() {
        this.searchContent = bind(this.searchContent, this);
        return SearchResultsLayout.__super__.constructor.apply(this, arguments);
      }

      SearchResultsLayout.prototype.template = 'Search: <input type="text" class="search-box" id="search-box"> <button class="btn btn-success btn-cons2" id="search-btn"> <i class="none progress-spinner fa fa-spinner fa-spin"></i> Search </button> <label id="error-div" class="none"><span class="small text-error">Please enter the search keyword</span></label> <div id="content-selection-region"></div>';

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
        var searchStr;
        searchStr = _.trim(this.$el.find('#search-box').val());
        if (searchStr) {
          this.$el.find("#error-div").hide();
          this.$el.find('.progress-spinner').show();
          return this.trigger("search:content", searchStr);
        } else {
          return this.$el.find("#error-div").show();
        }
      };

      return SearchResultsLayout;

    })(Marionette.Layout);
  });
});
