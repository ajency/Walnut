var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/collection-details/templates/collection-details.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("CollecionDetailsApp.Controller", function(Controller, App) {
    var CollectionDetailsView;
    Controller.CollecionDetailsController = (function(_super) {
      __extends(CollecionDetailsController, _super);

      function CollecionDetailsController() {
        this.successFn = __bind(this.successFn, this);
        return CollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      CollecionDetailsController.prototype.initialize = function() {
        var textbooksCollection, view;
        textbooksCollection = App.request("get:textbooks");
        this.view = view = this._getCollectionDetailsView(textbooksCollection);
        this.show(view, {
          loading: true
        });
        this.listenTo(this.view, {
          "fetch:chapters": (function(_this) {
            return function(term_id) {
              var chaptersCollection;
              chaptersCollection = App.request("get:chapters", {
                'parent': term_id
              });
              return App.execute("when:fetched", chaptersCollection, function() {
                return _this.view.triggerMethod('fetch:chapters:complete', chaptersCollection);
              });
            };
          })(this)
        });
        this.listenTo(this.view, {
          "fetch:sections:subsections": function(term_id) {
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
          }
        });
        return this.listenTo(this.view, {
          "save:content:collection:details": (function(_this) {
            return function(data) {
              if (!_this.contentGroupModel) {
                _this.contentGroupModel = App.request("save:content:group:details", data);
              }
              return _this.contentGroupModel.save(data, {
                wait: true,
                success: _this.successFn,
                error: _this.errorFn
              });
            };
          })(this)
        });
      };

      CollecionDetailsController.prototype.successFn = function(resp) {
        return this.view.triggerMethod('saved:content:group', resp);
      };

      CollecionDetailsController.prototype.errorFn = function() {
        return console.log('error');
      };

      CollecionDetailsController.prototype._getCollectionDetailsView = function(collection) {
        return new CollectionDetailsView({
          collection: collection
        });
      };

      return CollecionDetailsController;

    })(RegionController);
    CollectionDetailsView = (function(_super) {
      __extends(CollectionDetailsView, _super);

      function CollectionDetailsView() {
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.className = 'tiles white grid simple vertical green';

      CollectionDetailsView.prototype.events = {
        'change #textbooks': function(e) {
          this.$el.find('#secs, #subsecs').select2('data', null);
          this.$el.find('#chapters, #secs, #subsecs').html('');
          return this.trigger("fetch:chapters", $(e.target).val());
        },
        'change #chapters': function(e) {
          return this.trigger("fetch:sections:subsections", $(e.target).val());
        },
        'click #save-content-collection': 'save_content'
      };

      CollectionDetailsView.prototype.onShow = function() {
        $("#textbooks").select2();
        $("#chapters").select2();
        $("#secs").val([]).select2();
        return $("#subsecs").val([]).select2();
      };

      CollectionDetailsView.prototype.onFetchChaptersComplete = function(chapters) {
        if (_.size(chapters) > 0) {
          this.$el.find('#chapters').html('');
          return _.each(chapters.models, (function(_this) {
            return function(chap, index) {
              return _this.$el.find('#chapters').append('<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>');
            };
          })(this));
        } else {
          return this.$el.find('#chapters').html('<option>No Chapters available</option>');
        }
      };

      CollectionDetailsView.prototype.onFetchSubsectionsComplete = function(allsections) {
        if (_.size(allsections) > 0) {
          if (_.size(allsections.sections) > 0) {
            this.$el.find('#secs').html('');
            _.each(allsections.sections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#secs').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
          } else {
            this.$el.find('#secs').html('<option>No Sections available</option>');
          }
          if (_.size(allsections.subsections) > 0) {
            this.$el.find('#subsecs').html('');
            return _.each(allsections.subsections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#subsecs').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
          } else {
            return this.$el.find('#subsecs').html('<option>No Sub Sections available</option>');
          }
        } else {
          this.$el.find('#secs').html('<option>No Sections available</option>');
          return this.$el.find('#subsecs').html('<option>No Sub Sections available</option>');
        }
      };

      CollectionDetailsView.prototype.save_content = function(e) {
        var data;
        e.preventDefault();
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          return this.trigger("save:content:collection:details", data);
        }
      };

      CollectionDetailsView.prototype.onSavedContentGroup = function(model) {
        return console.log(model);
      };

      return CollectionDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:collections:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollecionDetailsController(opt);
    });
  });
});
