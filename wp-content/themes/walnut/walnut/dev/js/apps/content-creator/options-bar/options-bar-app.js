var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/options-bar/options-bar-views'], function(App, RegionController) {
  return App.module("ContentCreator.OptionsBar", function(OptionsBar, App, Backbone, Marionette, $, _) {
    var OptionsBarController;
    OptionsBarController = (function(_super) {
      __extends(OptionsBarController, _super);

      function OptionsBarController() {
        this._getOptionsBarView = __bind(this._getOptionsBarView, this);
        this._fetchSections = __bind(this._fetchSections, this);
        this._fetchChapters = __bind(this._fetchChapters, this);
        this.showView = __bind(this.showView, this);
        return OptionsBarController.__super__.constructor.apply(this, arguments);
      }

      OptionsBarController.prototype.initialize = function(options) {
        this.contentPieceModel = options.contentPieceModel;
        this.view = this._getOptionsBarView();
        this.textbooksCollection = App.request("get:textbooks");
        App.execute("when:fetched", [this.textbooksCollection, this.contentPieceModel], this.showView);
        this.listenTo(this.view, "save:data:to:model", (function(_this) {
          return function(data) {
            _this.contentPieceModel.set(data);
            return App.execute("save:question");
          };
        })(this));
        this.listenTo(this.view, 'show:grading:parameter', (function(_this) {
          return function() {
            return _this.region.trigger('show:grading:parameter');
          };
        })(this));
        return this.listenTo(this.view, 'close:grading:parameter', (function(_this) {
          return function() {
            return _this.region.trigger('close:grading:parameter');
          };
        })(this));
      };

      OptionsBarController.prototype.showView = function() {
        var chapter_id, term_ids, textbook_id;
        this.show(this.view, {
          loading: true,
          entities: [this.textbooksCollection]
        });
        term_ids = this.contentPieceModel.get('term_ids');
        if (term_ids) {
          textbook_id = term_ids['textbook'];
          if (term_ids['chapter'] != null) {
            chapter_id = term_ids['chapter'];
          }
          if (textbook_id != null) {
            this._fetchChapters(textbook_id, chapter_id);
          }
          if (chapter_id != null) {
            this._fetchSections(chapter_id);
          }
        }
        this.listenTo(this.view, "fetch:chapters", this._fetchChapters);
        return this.listenTo(this.view, "fetch:sections:subsections", this._fetchSections);
      };

      OptionsBarController.prototype._fetchChapters = function(term_id, current_chapter) {
        var chaptersCollection;
        chaptersCollection = App.request("get:chapters", {
          'parent': term_id
        });
        return App.execute("when:fetched", chaptersCollection, (function(_this) {
          return function() {
            return _this.view.triggerMethod('fetch:chapters:complete', chaptersCollection, current_chapter);
          };
        })(this));
      };

      OptionsBarController.prototype._fetchSections = function(term_id) {
        var allSectionsCollection;
        allSectionsCollection = App.request("get:subsections:by:chapter:id", {
          'child_of': term_id
        });
        return App.execute("when:fetched", allSectionsCollection, (function(_this) {
          return function() {
            var allSections, sectionsList, subsectionsList;
            sectionsList = allSectionsCollection.where({
              'parent': term_id
            });
            subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
            allSections = {
              'sections': sectionsList,
              'subsections': subsectionsList
            };
            return _this.view.triggerMethod('fetch:subsections:complete', allSections);
          };
        })(this));
      };

      OptionsBarController.prototype._getOptionsBarView = function() {
        return new OptionsBar.Views.OptionsBarView({
          model: this.contentPieceModel,
          templateHelpers: this._getTemplateHelpers()
        });
      };

      OptionsBarController.prototype._getTemplateHelpers = function() {
        return {
          textbooksFilter: (function(_this) {
            return function() {
              var term_ids, textbook_id, textbooks;
              textbooks = new Array();
              term_ids = _this.contentPieceModel.get('term_ids');
              if (term_ids != null) {
                textbook_id = term_ids['textbook'];
              }
              _this.textbooksCollection.each(function(el, ind) {
                var data;
                data = {
                  'name': el.get('name'),
                  'id': el.get('term_id')
                };
                if (textbook_id && textbook_id === el.get('term_id')) {
                  data['selected'] = 'selected';
                }
                return textbooks.push(data);
              });
              return textbooks;
            };
          })(this)
        };
      };

      return OptionsBarController;

    })(RegionController);
    return App.commands.setHandler("show:options:bar", function(options) {
      return new OptionsBarController(options);
    });
  });
});
