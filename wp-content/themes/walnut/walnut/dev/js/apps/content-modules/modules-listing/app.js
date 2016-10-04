var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-modules/modules-listing/modules-listing-controller', 'apps/content-modules/modules-listing/search-results-app', 'apps/textbook-filters/textbook-filters-app'], function(App, RegionController) {
  return App.module("ContentModulesApp.ModulesListing", function(ModulesListing, App) {
    var ContentPiecesLayout;
    ModulesListing.ListController = (function(superClass) {
      var divisionsCollection, schoolsCollection, textbooksCollection;

      extend(ListController, superClass);

      function ListController() {
        this._fetchQuizzes = bind(this._fetchQuizzes, this);
        this._fetchTextbooks = bind(this._fetchTextbooks, this);
        return ListController.__super__.constructor.apply(this, arguments);
      }

      textbooksCollection = null;

      divisionsCollection = null;

      schoolsCollection = null;

      ListController.prototype.initialize = function(options) {
        this.groupType = options.groupType;
        this.division = 0;
        divisionsCollection = App.request("get:divisions");
        return App.execute("when:fetched", divisionsCollection, this._fetchTextbooks);
      };

      ListController.prototype._fetchTextbooks = function() {
        var class_id, division;
        class_id = divisionsCollection.first().get('class_id');
        division = divisionsCollection.first().get('id');
        if (this.groupType === 'teaching-module') {
          textbooksCollection = App.request("get:textbooks", {
            "fetch_all": true
          });
        } else {
          textbooksCollection = App.request("get:textbooks", {
            'class_id': class_id
          });
        }
        App.execute("when:fetched", textbooksCollection, (function(_this) {
          return function() {};
        })(this));
        return App.execute("when:fetched", textbooksCollection, this._fetchQuizzes);
      };

      ListController.prototype._fetchQuizzes = function() {
        var data, textbook;
        textbook = textbooksCollection.first();
        this.division = divisionsCollection.first().get('id');
        if (this.groupType === 'teaching-module') {
          data = {
            'post_status': 'any',
            'textbook': textbook.id
          };
        } else {
          data = {
            'post_status': 'any',
            'textbook': textbook.id,
            'division': this.division
          };
        }
        if (this.groupType === 'teaching-module') {
          this.contentModulesCollection = App.request("get:content:groups", data);
        } else if (this.groupType === 'student-training') {
          this.contentModulesCollection = App.request("get:student:training:modules", data);
        } else {
          console.log(data);
          this.contentModulesCollection = App.request("get:quizes", data);
        }
        this.selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse();
        this.layout = this._getContentPiecesLayout();
        return App.execute("when:fetched", [this.contentModulesCollection, textbooksCollection], (function(_this) {
          return function() {
            console.log(_this.contentModulesCollection);
            _this.show(_this.layout, {
              loading: true
            });
            _this.listenTo(_this.layout, "show", function() {
              var dataType;
              console.log(_this.groupType);
              dataType = (function() {
                switch (this.groupType) {
                  case 'teaching-module':
                    return 'teaching-modules';
                  case 'student-training':
                    return 'student-training';
                  default:
                    return 'quiz';
                }
              }).call(_this);
              if (_this.groupType === 'quiz') {
                App.execute("show:textbook:filters:app", {
                  region: _this.layout.filtersRegion,
                  collection: _this.contentModulesCollection,
                  textbooksCollection: textbooksCollection,
                  selectedFilterParamsObject: _this.selectedFilterParamsObject,
                  divisionsCollection: divisionsCollection,
                  dataType: dataType,
                  post_status: 'any',
                  filters: ['divisions', 'multi_textbooks', 'module_status']
                });
              } else {
                App.execute("show:textbook:filters:app", {
                  region: _this.layout.filtersRegion,
                  collection: _this.contentModulesCollection,
                  textbooksCollection: textbooksCollection,
                  selectedFilterParamsObject: _this.selectedFilterParamsObject,
                  dataType: dataType,
                  post_status: 'any',
                  filters: ['textbooks', 'chapters', 'sections', 'subsections', 'module_status']
                });
              }
              App.execute("show:list:all:modules:app", {
                region: _this.layout.allContentRegion,
                contentModulesCollection: _this.contentModulesCollection,
                textbooksCollection: textbooksCollection,
                groupType: _this.groupType,
                division: _this.division
              });
              return new ModulesListing.SearchResults.Controller({
                region: _this.layout.searchResultsRegion,
                textbooksCollection: textbooksCollection,
                selectedFilterParamsObject: _this.selectedFilterParamsObject,
                division: _this.division,
                groupType: _this.groupType
              });
            });
            return _this.listenTo(_this.layout.filtersRegion, "update:pager", function() {
              return _this.layout.allContentRegion.trigger("update:pager");
            });

            /*@listenTo @view, "save:communications", (data)=>
                              
                                  data=
                                      component           : 'quiz'
                                      communication_type  : 'quiz_completed_parent_mail'
                                      communication_mode  : data.communication_mode
                                      additional_data:
                                          quiz_ids        : data.quizIDs
                                          division        : @division
            
                                  communicationModel = App.request "create:communication",data
                                  @_showSelectRecipientsApp communicationModel
             */
          };
        })(this));
      };

      ListController.prototype._getContentPiecesLayout = function() {
        console.log("_getContentPiecesLayout");
        return new ContentPiecesLayout({
          groupType: this.groupType
        });
      };


      /*_showSelectRecipientsApp:(communicationModel)->
      				console.log communicationModel
      				App.execute "show:quiz:select:recipients:popup",
                      region               : App.dialogRegion
                      communicationModel   : communicationModel
       */

      return ListController;

    })(RegionController);
    ContentPiecesLayout = (function(superClass) {
      extend(ContentPiecesLayout, superClass);

      function ContentPiecesLayout() {
        return ContentPiecesLayout.__super__.constructor.apply(this, arguments);
      }

      ContentPiecesLayout.prototype.template = '<div class="grid-title no-border"> <h4 class="">List of <span class="semi-bold">{{type}}</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div id="filters-region" class="m-b-10"></div> <ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent"> <li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Modules</a></li> <li><a href="#search-results-region"><span class="semi-bold">Search</span> Modules</a></li> </ul> <div id="tab-content" class="tab-content" > <div id="all-content-region" class="tab-pane active"></div> <div id="search-results-region" class="tab-pane"></div> </div> </div>';

      ContentPiecesLayout.prototype.className = 'tiles white grid simple vertical green';

      ContentPiecesLayout.prototype.regions = {
        filtersRegion: '#filters-region',
        allContentRegion: '#all-content-region',
        searchResultsRegion: '#search-results-region'
      };

      ContentPiecesLayout.prototype.events = {
        'click #addContent a': 'changeTab'
      };

      ContentPiecesLayout.prototype.mixinTemplateHelpers = function(data) {
        data = ContentPiecesLayout.__super__.mixinTemplateHelpers.call(this, data);
        data.type = _.titleize(_.humanize(Marionette.getOption(this, 'groupType')));
        return data;
      };

      ContentPiecesLayout.prototype.changeTab = function(e) {
        e.preventDefault();
        this.$el.find('#addContent a').removeClass('active');
        return $(e.target).closest('a').addClass('active').tab('show');
      };

      return ContentPiecesLayout;

    })(Marionette.Layout);
    return App.commands.setHandler('show:module:listing:app', function(options) {
      return new ModulesListing.ListController(options);
    });
  });
});
