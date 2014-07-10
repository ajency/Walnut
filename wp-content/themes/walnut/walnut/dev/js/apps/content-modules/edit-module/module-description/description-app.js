var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-modules/edit-module/module-description/templates/collection-details.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("CollecionDetailsApp.Controller", function(Controller, App) {
    var CollectionDetailsView;
    Controller.EditCollecionDetailsController = (function(_super) {
      __extends(EditCollecionDetailsController, _super);

      function EditCollecionDetailsController() {
        this.successFn = __bind(this.successFn, this);
        this._fetchSubsections = __bind(this._fetchSubsections, this);
        this._fetchSections = __bind(this._fetchSections, this);
        this._fetchChapters = __bind(this._fetchChapters, this);
        this.showView = __bind(this.showView, this);
        return EditCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      EditCollecionDetailsController.prototype.initialize = function(opts) {
        this.model = opts.model;
        this.textbooksCollection = App.request("get:textbooks");
        return App.execute("when:fetched", [this.textbooksCollection], this.showView);
      };

      EditCollecionDetailsController.prototype.showView = function() {
        var term_ids, view;
        this.view = view = this._getCollectionDetailsView(this.model);
        this.show(view, {
          loading: true,
          entities: [this.textbooksCollection]
        });
        term_ids = this.model.get('term_ids');
        this.listenTo(this.view, "show", (function(_this) {
          return function() {
            var chapter_id, section_ids, textbook_id;
            if (term_ids) {
              textbook_id = term_ids['textbook'];
              if (term_ids['chapter'] != null) {
                chapter_id = term_ids['chapter'];
              }
              if (term_ids['sections'] != null) {
                section_ids = _.flatten(term_ids['sections']);
              }
              if (textbook_id != null) {
                _this._fetchChapters(textbook_id, chapter_id);
              }
              if (chapter_id != null) {
                _this._fetchSections(chapter_id);
              }
              if (section_ids != null) {
                return _this._fetchSubsections(section_ids);
              }
            }
          };
        })(this));
        this.listenTo(this.view, "fetch:chapters", this._fetchChapters);
        this.listenTo(this.view, "fetch:sections", this._fetchSections);
        this.listenTo(this.view, "fetch:subsections", this._fetchSubsections);
        return this.listenTo(this.view, {
          "save:content:collection:details": (function(_this) {
            return function(data) {
              _this.model.set({
                'changed': 'module_details'
              });
              _this.model.save(data, {
                wait: true,
                success: _this.successFn,
                error: _this.errorFn
              });
              if (data.status !== 'underreview') {
                return _this.region.trigger("close:content:selection:app");
              }
            };
          })(this)
        });
      };

      EditCollecionDetailsController.prototype._fetchChapters = function(term_id, current_chapter) {
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

      EditCollecionDetailsController.prototype._fetchSections = function(term_id) {
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

      EditCollecionDetailsController.prototype._fetchSubsections = function(term_id) {
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

      EditCollecionDetailsController.prototype.successFn = function(model) {
        App.navigate("edit-module/" + (model.get('id')));
        return this.view.triggerMethod('saved:content:group', model);
      };

      EditCollecionDetailsController.prototype.errorFn = function() {
        return console.log('error');
      };

      EditCollecionDetailsController.prototype._getCollectionDetailsView = function(model) {
        return new CollectionDetailsView({
          model: model,
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

      return EditCollecionDetailsController;

    })(RegionController);
    CollectionDetailsView = (function(_super) {
      __extends(CollectionDetailsView, _super);

      function CollectionDetailsView() {
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.className = 'tiles white grid simple vertical green animated fadeIn';

      CollectionDetailsView.prototype.events = {
        'change #textbooks': function(e) {
          return this.trigger("fetch:chapters", $(e.target).val());
        },
        'change #chapters': function(e) {
          return this.trigger("fetch:sections", $(e.target).val());
        },
        'change #secs': function(e) {
          return this.trigger("fetch:subsections", $(e.target).val());
        },
        'click #save-content-collection': 'save_content'
      };

      CollectionDetailsView.prototype.modelEvents = {
        'change:status': 'statusChanged'
      };

      CollectionDetailsView.prototype.mixinTemplateHelpers = function(data) {
        data = CollectionDetailsView.__super__.mixinTemplateHelpers.call(this, data);
        data.statusOptions = [
          {
            name: 'Under Review',
            value: 'underreview'
          }, {
            name: 'Published',
            value: 'publish'
          }, {
            name: 'Archived',
            value: 'archive'
          }
        ];
        data.textBookSelected = function() {
          if (parseInt(this.id) === parseInt(data.term_ids['textbook'])) {
            return 'selected';
          }
        };
        data.statusSelected = function() {
          if (this.value === data.status) {
            return 'selected';
          }
        };
        return data;
      };

      CollectionDetailsView.prototype.onShow = function() {
        $("#textbooks, #chapters, #minshours, select").select2();
        $("#secs,#subsecs").val([]).select2();
        return this.statusChanged();
      };

      CollectionDetailsView.prototype.statusChanged = function() {
        var _ref;
        if ((_ref = this.model.get('status')) === 'publish' || _ref === 'archive') {
          this.$el.find('input, textarea, select').prop('disabled', true);
          this.$el.find('select#status').prop('disabled', false);
          return this.$el.find('select#status option[value="underreview"]').prop('disabled', true);
        }
      };

      CollectionDetailsView.prototype.onFetchChaptersComplete = function(chapters) {
        var chapterElement, currentChapter, termIDs;
        this.$el.find('#chapters, #secs, #subsecs').select2('data', null);
        this.$el.find('#chapters, #secs, #subsecs').html('');
        chapterElement = this.$el.find('#chapters');
        termIDs = this.model.get('term_ids');
        currentChapter = termIDs['chapter'];
        return $.populateChaptersOrSections(chapters, chapterElement, currentChapter);
      };

      CollectionDetailsView.prototype.setChapterValue = function() {
        if (this.model.get('term_ids')['chapter']) {
          this.$el.find('#chapters').val(this.model.get('term_ids')['chapter']);
          this.$el.find('#chapters').select2();
          return this.$el.find('#chapters').trigger('change');
        }
      };

      CollectionDetailsView.prototype.onFetchSectionsComplete = function(sections) {
        var sectionIDs, sectionsElement, term_ids;
        this.$el.find('#secs, #subsecs').select2('data', null);
        this.$el.find('#secs, #subsecs').html('');
        term_ids = this.model.get('term_ids');
        if (term_ids != null) {
          sectionIDs = term_ids['sections'];
        }
        sectionsElement = this.$el.find('#secs');
        return $.populateChaptersOrSections(sections, sectionsElement, sectionIDs);
      };

      CollectionDetailsView.prototype.onFetchSubsectionsComplete = function(subsections) {
        var subSectionIDs, subsectionsElemnet, term_ids;
        this.$el.find('#subsecs').select2('data', null);
        this.$el.find('#subsecs').html('');
        term_ids = this.model.get('term_ids');
        if (term_ids != null) {
          subSectionIDs = term_ids['subsections'];
        }
        subsectionsElemnet = this.$el.find('#subsecs');
        return $.populateChaptersOrSections(subsections, subsectionsElemnet, subSectionIDs);
      };

      CollectionDetailsView.prototype.markSelected = function(element, sections) {
        if (this.model.isNew()) {
          return '';
        }
        return $("#" + element).val(this.model.get('term_ids')[sections]).select2();
      };

      CollectionDetailsView.prototype.save_content = function(e) {
        var data;
        e.preventDefault();
        $('#s2id_textbooks .select2-choice').removeClass('error');
        if (this.$el.find('#textbooks').val() === '') {
          $('#s2id_textbooks .select2-choice').addClass('error');
        }
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          return this.trigger("save:content:collection:details", data);
        }
      };

      CollectionDetailsView.prototype.onSavedContentGroup = function(model) {
        this.$el.find('#saved-success').remove();
        return this.$el.find('.grid-title').prepend('<div id="saved-success">Saved Successfully. Click here to <a href="#view-group/' + model.get('id') + '">view your module</a><hr></div>');
      };

      return CollectionDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:editgroup:content:group:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.EditCollecionDetailsController(opt);
    });
  });
});
