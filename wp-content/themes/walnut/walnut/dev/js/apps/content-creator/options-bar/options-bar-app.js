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
        this._fetchSubsections = __bind(this._fetchSubsections, this);
        this._fetchSections = __bind(this._fetchSections, this);
        this._fetchChapters = __bind(this._fetchChapters, this);
        this.showView = __bind(this.showView, this);
        this._beforeChangeContentPiece = __bind(this._beforeChangeContentPiece, this);
        this._saveBeforeUnload = __bind(this._saveBeforeUnload, this);
        return OptionsBarController.__super__.constructor.apply(this, arguments);
      }

      OptionsBarController.prototype.initialize = function(options) {
        this.contentPieceModel = options.contentPieceModel;
        this.view = this._getOptionsBarView();
        this.textbooksCollection = App.request("get:textbooks", {
          "fetch_all": true
        });
        App.execute("when:fetched", [this.textbooksCollection, this.contentPieceModel], this.showView);
        this.listenTo(this.region, "change:content:piece", this._saveBeforeUnload);
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
        this.listenTo(this.view, 'close:grading:parameter', (function(_this) {
          return function() {
            return _this.region.trigger('close:grading:parameter');
          };
        })(this));
        return $(window).on('beforeunload', (function(_this) {
          return function() {
            var message;
            message = _this._beforeChangeContentPiece();
            return message;
          };
        })(this));
      };

      OptionsBarController.prototype._saveBeforeUnload = function(nextID) {
        var msg;
        msg = this._beforeChangeContentPiece();
        msg += " Are you sure you want to leave this question?";
        if (confirm(msg)) {
          return App.navigate("edit-content/" + nextID, true);
        }
      };

      OptionsBarController.prototype._beforeChangeContentPiece = function() {
        var message;
        if (this.contentPieceModel.isNew()) {
          message = 'You are in the middle of creating a new content piece. If you reload the page your changes will be lost.';
        } else {
          this.view.triggerMethod('save:question:settings');
          if ((!this.view.$el.find('form').valid()) || $('form input[name="complete"]').val() === 'false') {
            message = 'Error occured saving your content. Some content may be lost if you refresh.';
          } else {
            message = 'All changes are saved successfully.';
          }
        }
        return message;
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
