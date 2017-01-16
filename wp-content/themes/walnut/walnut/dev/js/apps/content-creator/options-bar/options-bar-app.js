var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'bootbox', 'apps/content-creator/options-bar/options-bar-views'], function(App, RegionController, bootbox) {
  return App.module("ContentCreator.OptionsBar", function(OptionsBar, App, Backbone, Marionette, $, _) {
    var OptionsBarController;
    OptionsBarController = (function(superClass) {
      extend(OptionsBarController, superClass);

      function OptionsBarController() {
        this._getOptionsBarView = bind(this._getOptionsBarView, this);
        this._fetchSubsections = bind(this._fetchSubsections, this);
        this._fetchSections = bind(this._fetchSections, this);
        this._fetchChapters = bind(this._fetchChapters, this);
        this.showView = bind(this.showView, this);
        this._beforeChangeContentPiece = bind(this._beforeChangeContentPiece, this);
        return OptionsBarController.__super__.constructor.apply(this, arguments);
      }

      OptionsBarController.prototype.initialize = function(options) {
        this.contentPieceModel = options.contentPieceModel;
        this.view = this._getOptionsBarView();
        this.textbooksCollection = App.request("get:textbooks", {
          "fetch_all": true
        });
        App.execute("when:fetched", [this.textbooksCollection, this.contentPieceModel], this.showView);
        this.listenTo(this.region, "change:content:piece", this._beforeChangeContentPiece);
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

      OptionsBarController.prototype._beforeChangeContentPiece = function(nextID) {
        var message;
        if (this.contentPieceModel.isNew()) {
          return message = 'You are in the middle of creating a new content piece. If you reload the page your changes will be lost.';
        } else {
          this.view.triggerMethod('save:question:settings');
          if ((!this.view.$el.find('form').valid()) || $('form input[name="complete"]').val() === 'false') {
            return bootbox.alert('Error occured saving your content');
          } else {
            return App.navigate("edit-content/" + nextID, true);
          }
        }
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
          localStorage.textbook_id = textbook_id;
          if (term_ids['chapter'] != null) {
            chapter_id = term_ids['chapter'];
          }
          localStorage.chapter_id = chapter_id;
          if (textbook_id != null) {
            this._fetchChapters(textbook_id, chapter_id);
          }
          if (chapter_id != null) {
            this._fetchSections(chapter_id);
          }
        }
        this.listenTo(this.view, "fetch:chapters", this._fetchChapters);
        this.listenTo(this.view, "fetch:sections", this._fetchSections);
        return this.listenTo(this.view, "fetch:subsections", this._fetchSubsections);
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
        this.subSectionsList = null;
        this.allSectionsCollection = App.request("get:subsections:by:chapter:id", {
          'child_of': term_id
        });
        return App.execute("when:fetched", this.allSectionsCollection, (function(_this) {
          return function() {
            var sectionsList;
            sectionsList = _this.allSectionsCollection.where({
              'parent': term_id
            });
            _this.subSectionsList = _.difference(_this.allSectionsCollection.models, sectionsList);
            return _this.view.triggerMethod('fetch:sections:complete', sectionsList);
          };
        })(this));
      };

      OptionsBarController.prototype._fetchSubsections = function(term_id) {
        return App.execute("when:fetched", this.allSectionsCollection, (function(_this) {
          return function() {
            var subSectionList;
            subSectionList = null;
            subSectionList = _.filter(_this.subSectionsList, function(subSection) {
              return _.contains(term_id, subSection.get('parent'));
            });
            return _this.view.triggerMethod('fetch:subsections:complete', subSectionList);
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
