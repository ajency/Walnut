var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-modules/edit-module/content-selection/all-content-app', 'apps/content-modules/edit-module/content-selection/search-results-app', 'apps/content-modules/edit-module/content-selection/add-set-app', 'apps/textbook-filters/textbook-filters-app'], function(App, RegionController) {
  return App.module("ContentSelectionApp.Controller", function(Controller, App) {
    Controller.ContentSelectionController = (function(_super) {
      var ContentSelectionLayout;

      __extends(ContentSelectionController, _super);

      function ContentSelectionController() {
        return ContentSelectionController.__super__.constructor.apply(this, arguments);
      }

      ContentSelectionController.prototype.initialize = function(opts) {
        this.model = opts.model, this.contentGroupCollection = opts.contentGroupCollection;
        if (this.model.get('type') === 'teaching-module') {
          this.contentPiecesCollection = App.request("get:content:pieces", {
            content_type: ['teacher_question', 'content_piece'],
            post_status: 'publish'
          });
        }
        if (this.model.get('type') === 'quiz') {
          this.contentPiecesCollection = App.request("get:content:pieces", {
            content_type: ['student_question'],
            post_status: 'publish'
          });
        }
        this.selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse();
        return App.execute("when:fetched", [this.contentPiecesCollection, this.contentGroupCollection], (function(_this) {
          return function() {
            var model, _i, _len, _ref;
            _ref = _this.contentGroupCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _this.contentPiecesCollection.remove(model);
            }
            _this.fullCollection = _this.contentPiecesCollection.clone();
            _this.layout = _this._getContentSelectionLayout();
            _this.show(_this.layout, {
              loading: true
            });
            _this.selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse();
            _this.listenTo(_this.layout, "show", function() {
              var filters;
              filters = ['textbooks', 'chapters', 'sections', 'subsections', 'content_type'];
              if (_this.model.get('type') === 'quiz') {
                filters.pop();
              }
              App.execute("show:textbook:filters:app", {
                region: _this.layout.filtersRegion,
                collection: _this.contentPiecesCollection,
                selectedFilterParamsObject: _this.selectedFilterParamsObject,
                model: _this.model,
                filters: filters
              });
              App.execute("show:all:content:selection:app", {
                region: _this.layout.allContentRegion,
                contentPiecesCollection: _this.contentPiecesCollection,
                contentGroupCollection: _this.contentGroupCollection,
                groupType: _this.model.get('type')
              });
              App.execute("show:content:search:results:app", {
                region: _this.layout.searchResultsRegion,
                contentGroupCollection: _this.contentGroupCollection,
                selectedFilterParamsObject: _this.selectedFilterParamsObject,
                groupType: _this.model.get('type')
              });
              if (_this.model.get('type') === 'quiz') {
                return App.execute('show:add:set:app', {
                  region: _this.layout.addSetRegion,
                  contentPiecesCollection: _this.contentPiecesCollection,
                  contentGroupCollection: _this.contentGroupCollection,
                  selectedFilterParamsObject: _this.selectedFilterParamsObject
                });
              }
            });
            return _this.listenTo(_this.layout.filtersRegion, "update:pager", function() {
              return _this.layout.allContentRegion.trigger("update:pager");
            });
          };
        })(this));
      };

      ContentSelectionController.prototype._getContentSelectionLayout = function() {
        return new ContentSelectionLayout({
          model: this.model
        });
      };

      ContentSelectionLayout = (function(_super1) {
        __extends(ContentSelectionLayout, _super1);

        function ContentSelectionLayout() {
          return ContentSelectionLayout.__super__.constructor.apply(this, arguments);
        }

        ContentSelectionLayout.prototype.template = '<div class="grid-title no-border"> <h4 class="">Content <span class="semi-bold">Selection</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div id="filters-region" class="m-b-10"></div> <ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent"> <li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Questions</a></li> {{#isQuiz}}<li><a href="#add-set-region"><span class="semi-bold">Add</span> Set</a></li>{{/isQuiz}} <li><a href="#search-results-region"><span class="semi-bold">Search</span> Questions</a></li> </ul> <div id="tab-content" class="tab-content" > <div id="all-content-region" class="tab-pane active"></div> <div id="add-set-region" class="tab-pane"></div> <div id="search-results-region" class="tab-pane"></div> </div> </div>';

        ContentSelectionLayout.prototype.mixinTemplateHelpers = function(data) {
          data = ContentSelectionLayout.__super__.mixinTemplateHelpers.call(this, data);
          if (data.type === 'quiz') {
            data.isQuiz = true;
          }
          return data;
        };

        ContentSelectionLayout.prototype.className = 'tiles white grid simple vertical green';

        ContentSelectionLayout.prototype.regions = {
          filtersRegion: '#filters-region',
          allContentRegion: '#all-content-region',
          searchResultsRegion: '#search-results-region',
          addSetRegion: '#add-set-region'
        };

        ContentSelectionLayout.prototype.events = {
          'click #addContent a': 'changeTab'
        };

        ContentSelectionLayout.prototype.changeTab = function(e) {
          e.preventDefault();
          this.$el.find('#addContent a').removeClass('active');
          return $(e.target).closest('a').addClass('active').tab('show');
        };

        return ContentSelectionLayout;

      })(Marionette.Layout);

      return ContentSelectionController;

    })(RegionController);
    return App.commands.setHandler("show:content:selectionapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ContentSelectionController(opt);
    });
  });
});
