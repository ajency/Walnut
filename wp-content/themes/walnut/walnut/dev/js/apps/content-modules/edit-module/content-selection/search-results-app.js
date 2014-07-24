var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentSelectionApp.Controller.SearchResults", function(SearchResults, App, Backbone, Marionette, $, _) {
    var SearchResultsLayout;
    SearchResults.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._searchContent = __bind(this._searchContent, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.contentGroupCollection = opts.contentGroupCollection;
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
              contentGroupCollection: _this.contentGroupCollection
            });
          };
        })(this));
        return this.listenTo(this.layout, "search:content", this._searchContent);
      };

      Controller.prototype._searchContent = function(searchStr) {
        this.newCollection = App.request("get:content:pieces", {
          content_type: ['teacher_question', 'content_piece'],
          search_str: searchStr,
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

      SearchResultsLayout.prototype.template = 'Search Questions: <input type="text" class="search-box" id="search-box"> <br><br> <div id="content-selection-region"></div>';

      SearchResultsLayout.prototype.regions = {
        contentSelectionRegion: '#content-selection-region'
      };

      SearchResultsLayout.prototype.events = {
        'keypress #search-box': 'searchContent'
      };

      SearchResultsLayout.prototype.searchContent = function(e) {
        var p, searchStr;
        p = e.which;
        if (p === 13) {
          searchStr = _.trim($(e.target).val());
          if (searchStr) {
            return this.trigger("search:content", searchStr);
          }
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
