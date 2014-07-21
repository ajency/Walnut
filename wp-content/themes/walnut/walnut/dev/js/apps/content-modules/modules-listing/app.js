var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-modules/modules-listing/modules-listing-controller', 'apps/content-modules/modules-listing/search-results-app', 'apps/textbook-filters/textbook-filters-app'], function(App, RegionController) {
  return App.module("ContentModulesApp.ModulesListing", function(ModulesListing, App) {
    return ModulesListing.ListController = (function(_super) {
      var ContentPiecesLayout;

      __extends(ListController, _super);

      function ListController() {
        return ListController.__super__.constructor.apply(this, arguments);
      }

      ListController.prototype.initialize = function() {
        this.textbooksCollection = App.request("get:textbooks");
        this.contentModulesCollection = App.request("get:content:groups", {
          'post_status': 'any'
        });
        this.selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse();
        this.layout = this._getContentPiecesLayout();
        return App.execute("when:fetched", [this.contentModulesCollection, this.textbooksCollection], (function(_this) {
          return function() {
            _this.show(_this.layout, {
              loading: true
            });
            _this.listenTo(_this.layout, "show", function() {
              App.execute("show:textbook:filters:app", {
                region: _this.layout.filtersRegion,
                collection: _this.contentModulesCollection,
                textbooksCollection: _this.textbooksCollection,
                selectedFilterParamsObject: _this.selectedFilterParamsObject,
                filters: ['textbooks', 'chapters', 'sections', 'subsections', 'module_status']
              });
              App.execute("show:list:all:modules:app", {
                region: _this.layout.allContentRegion,
                contentModulesCollection: _this.contentModulesCollection,
                textbooksCollection: _this.textbooksCollection
              });
              return new ModulesListing.SearchResults.Controller({
                region: _this.layout.searchResultsRegion,
                textbooksCollection: _this.textbooksCollection,
                selectedFilterParamsObject: _this.selectedFilterParamsObject
              });
            });
            return _this.listenTo(_this.layout.filtersRegion, "update:pager", function() {
              return _this.layout.allContentRegion.trigger("update:pager");
            });
          };
        })(this));
      };

      ListController.prototype._getContentPiecesLayout = function() {
        return new ContentPiecesLayout();
      };

      ContentPiecesLayout = (function(_super1) {
        __extends(ContentPiecesLayout, _super1);

        function ContentPiecesLayout() {
          return ContentPiecesLayout.__super__.constructor.apply(this, arguments);
        }

        ContentPiecesLayout.prototype.template = '<div class="grid-title no-border"> <h4 class="">List of <span class="semi-bold">Training Modules</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div id="filters-region" class="m-b-10"></div> <ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent"> <li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Modules</a></li> <li><a href="#search-results-region"><span class="semi-bold">Search</span> Modules</a></li> </ul> <div id="tab-content" class="tab-content" > <div id="all-content-region" class="tab-pane active"></div> <div id="search-results-region" class="tab-pane"></div> </div> </div>';

        ContentPiecesLayout.prototype.className = 'tiles white grid simple vertical green';

        ContentPiecesLayout.prototype.regions = {
          filtersRegion: '#filters-region',
          allContentRegion: '#all-content-region',
          searchResultsRegion: '#search-results-region'
        };

        ContentPiecesLayout.prototype.events = {
          'click #addContent a': 'changeTab'
        };

        ContentPiecesLayout.prototype.changeTab = function(e) {
          e.preventDefault();
          this.$el.find('#addContent a').removeClass('active');
          return $(e.target).closest('a').addClass('active').tab('show');
        };

        return ContentPiecesLayout;

      })(Marionette.Layout);

      return ListController;

    })(RegionController);
  });
});
