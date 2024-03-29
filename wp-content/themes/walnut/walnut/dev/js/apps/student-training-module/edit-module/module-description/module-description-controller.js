var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/student-training-module/edit-module/module-description/module-description-views'], function(App, RegionController) {
  return App.module("StudentTrainingEditDescription", function(StudentTrainingEditDescription, App) {
    StudentTrainingEditDescription.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._fetchSubsections = bind(this._fetchSubsections, this);
        this._fetchSections = bind(this._fetchSections, this);
        this._fetchChapters = bind(this._fetchChapters, this);
        this.successFn = bind(this.successFn, this);
        this.showView = bind(this.showView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.model = opts.model, this.contentGroupCollection = opts.contentGroupCollection;
        this.textbooksCollection = App.request("get:textbooks", {
          "fetch_all": true
        });
        return App.execute("when:fetched", [this.textbooksCollection], this.showView);
      };

      Controller.prototype.showView = function() {
        var term_ids, view;
        this.view = view = this._getCollectionDetailsView(this.model);
        term_ids = this.model.get('term_ids');
        this.listenTo(this.view, "show", (function(_this) {
          return function() {
            var chapter_id, fetchChapters, section_ids, textbook_id;
            if (_.size(term_ids) > 0) {
              textbook_id = term_ids['textbook'];
              if (term_ids['chapter'] != null) {
                chapter_id = term_ids['chapter'];
              }
              if (term_ids['sections'] != null) {
                section_ids = _.flatten(term_ids['sections']);
              }
              fetchChapters = _this._fetchChapters(textbook_id, chapter_id);
              return fetchChapters.done(function() {
                if (chapter_id != null) {
                  _this._fetchSections(chapter_id);
                }
                if (section_ids != null) {
                  return _this._fetchSubsections(section_ids);
                }
              });
            }
          };
        })(this));
        this.listenTo(this.view, "fetch:chapters", this._fetchChapters);
        this.listenTo(this.view, "fetch:sections", this._fetchSections);
        this.listenTo(this.view, "fetch:subsections", this._fetchSubsections);
        this.listenTo(this.view, "save:content:collection:details", (function(_this) {
          return function(data) {
            _this.model.set({
              'changed': 'module_details'
            });
            _this.model.save(data, {
              wait: true,
              success: _this.successFn,
              error: _this.errorFn
            });
            if (data.post_status !== 'underreview') {
              return _this.region.trigger("close:content:selection:app");
            }
          };
        })(this));
        return this.show(view, {
          loading: true,
          entities: [this.textbooksCollection]
        });
      };

      Controller.prototype.successFn = function(model) {
        App.navigate("edit-student-training-module/" + (model.get('id')));
        return this.view.triggerMethod('saved:content:group', model);
      };

      Controller.prototype.errorFn = function() {
        return console.log('error');
      };

      Controller.prototype._fetchChapters = function(term_id, current_chapter) {
        var chaptersCollection, defer;
        defer = $.Deferred();
        chaptersCollection = App.request("get:chapters", {
          'parent': term_id
        });
        App.execute("when:fetched", chaptersCollection, (function(_this) {
          return function() {
            _this.view.triggerMethod('fetch:chapters:complete', chaptersCollection, current_chapter);
            return defer.resolve();
          };
        })(this));
        return defer.promise();
      };

      Controller.prototype._fetchSections = function(term_id) {
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

      Controller.prototype._fetchSubsections = function(term_id) {
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

      Controller.prototype._getCollectionDetailsView = function(model) {
        return new StudentTrainingEditDescription.Views.CollectionDetailsView({
          model: model,
          contentGroupCollection: this.contentGroupCollection,
          templateHelpers: {
            textbooksFilter: (function(_this) {
              return function() {
                var textbooks;
                textbooks = [];
                _.each(_this.textbooksCollection.models, function(el, ind) {
                  return textbooks.push({
                    'name': el.get('name'),
                    'id': el.get('term_id')
                  });
                });
                return textbooks;
              };
            })(this)
          }
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:student:training:edit:description", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new StudentTrainingEditDescription.Controller(opt);
    });
  });
});
