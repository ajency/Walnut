var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-modules/modules-listing/modules-listing-views'], function(App, RegionController) {
  return App.module("ContentModulesApp.ModulesListing", function(ModulesListing, App, Backbone, Marionette, $, _) {
    ModulesListing.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._getContentModulessListingView = bind(this._getContentModulessListingView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var breadcrumb_items;
        console.log("here ModulesListing");
        this.contentModulesCollection = opts.contentModulesCollection, this.textbooksCollection = opts.textbooksCollection, this.groupType = opts.groupType;
        this.allChaptersCollection = null;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'View All Content Moduless',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        return App.execute("when:fetched", [this.contentModulesCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var chapter_ids;
            chapter_ids = _.chain(_this.contentModulesCollection.pluck('term_ids')).pluck('chapter').unique().compact().value();
            _this.allChaptersCollection = App.request("get:textbook:names:by:ids", chapter_ids);
            _this.fullCollection = _this.contentModulesCollection.clone();
            return App.execute("when:fetched", _this.allChaptersCollection, function() {
              var view;
              _this.view = view = _this._getContentModulessListingView();
              _this.show(view, {
                loading: true,
                entities: [_this.contentModulesCollection, _this.textbooksCollection, _this.fullCollection]
              });
              _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
                var chaptersOrSections;
                chaptersOrSections = App.request("get:chapters", {
                  'parent': parentID
                });
                return App.execute("when:fetched", chaptersOrSections, function() {
                  return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
                });
              });
              _this.listenTo(_this.region, "update:pager", function() {
                return _this.view.triggerMethod("update:pager");
              });
              return _this.listenTo(_this.view, "save:communications", function(data) {
                var communicationModel;
                console.log("save:communication");
                data = {
                  component: 'quiz',
                  communication_type: 'quiz_published_parent_mail',
                  communication_mode: data.communication_mode,
                  additional_data: {
                    quiz_ids: data.quizIDs
                  }
                };
                communicationModel = App.request("create:communication", data);
                return _this._showSelectRecipientsApp(communicationModel);
              });
            });
          };
        })(this));
      };

      Controller.prototype._getContentModulessListingView = function() {
        return new ModulesListing.Views.ModulesListingView({
          collection: this.contentModulesCollection,
          fullCollection: this.fullCollection,
          textbooksCollection: this.textbooksCollection,
          chaptersCollection: this.allChaptersCollection,
          groupType: this.groupType
        });
      };

      Controller.prototype._showSelectRecipientsApp = function(communicationModel) {
        console.log(communicationModel);
        return App.execute("show:quiz:select:recipients:popup", {
          region: App.dialogRegion,
          communicationModel: communicationModel
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:list:all:modules:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ModulesListing.Controller(opt);
    });
  });
});
