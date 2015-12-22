var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/student-training-module/view-module/module-description/description-app', 'apps/student-training-module/view-module/content-display/content-display-app', 'apps/student-training-module/take-module/take-module-controller'], function(App, RegionController) {
  return App.module("StudentTrainingApp.View", function(View, App) {
    var ContentGroupViewLayout;
    View.GroupController = (function(superClass) {
      var groupContentCollection, model;

      extend(GroupController, superClass);

      function GroupController() {
        this._getContentGroupViewLayout = bind(this._getContentGroupViewLayout, this);
        this.showContentGroupViews = bind(this.showContentGroupViews, this);
        this.gotoTrainingModule = bind(this.gotoTrainingModule, this);
        this.startTrainingModule = bind(this.startTrainingModule, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      model = null;

      groupContentCollection = null;

      GroupController.prototype.initialize = function(opts) {
        $('.navbar .container-fluid').css("visibility", "visible");
        $.showHeaderAndLeftNav();
        model = opts.model, this.classID = opts.classID, this.mode = opts.mode, this.division = opts.division, this.questionResponseCollection = opts.questionResponseCollection;
        groupContentCollection = null;
        if (!this.questionResponseCollection) {
          this.questionResponseCollection = App.request("get:empty:question:response:collection");
        }
        App.vent.unbind("next:item:student:training:module");
        App.vent.bind("next:item:student:training:module", (function(_this) {
          return function(data) {
            var nextItem;
            nextItem = _this._getNextItem(data);
            if (nextItem) {
              return _this.gotoTrainingModule(nextItem);
            } else {
              return _this.showLayout();
            }
          };
        })(this));
        return App.execute("when:fetched", model, (function(_this) {
          return function() {
            var groupContentCollectionFetch;
            if (model.get('code') === 'ERROR') {
              App.execute("show:no:permissions:app", {
                region: App.mainContentRegion,
                error_header: 'Unauthorized Training Module',
                error_msg: model.get('error_msg')
              });
              return false;
            }
            groupContentCollectionFetch = _this._getContentItems(model);
            return groupContentCollectionFetch.done(function(groupContent) {
              groupContentCollection = groupContent;
              return _this.showLayout();
            });
          };
        })(this));
      };

      GroupController.prototype.showLayout = function() {
        var layout;
        this.layout = layout = this._getContentGroupViewLayout();
        this.show(this.layout, {
          loading: true,
          entities: [model, this.questionResponseCollection, groupContentCollection, this.textbookNames]
        });
        this.listenTo(this.layout, 'show', this.showContentGroupViews);
        this.listenTo(this.layout.collectionDetailsRegion, 'start:training:module', this.startTrainingModule);
        return this.listenTo(this.layout.contentDisplayRegion, 'goto:item', (function(_this) {
          return function(data) {
            return _this.gotoTrainingModule(data);
          };
        })(this));
      };

      GroupController.prototype._getNextItem = function(data) {
        var contentLayout, item, nextItem, pieceIndex;
        contentLayout = model.get('content_layout');
        item = _.filter(contentLayout, function(item) {
          if (item.type === data.type && parseInt(item.id) === data.id) {
            return item;
          }
        });
        pieceIndex = _.indexOf(contentLayout, item[0]);
        nextItem = contentLayout[pieceIndex + 1];
        if (!nextItem) {
          nextItem = false;
        }
        return nextItem;
      };

      GroupController.prototype._getContentItems = function(model) {
        var defs;
        this.contentLayoutItems = new Backbone.Collection;
        this.contentLayoutItems.comparator = 'order';
        this.deferContent = $.Deferred();
        if (groupContentCollection) {
          this.deferContent.resolve(groupContentCollection);
          return this.deferContent.promise();
        }
        this.defer = {};
        defs = _.map(model.get('content_layout'), (function(_this) {
          return function(content, index) {
            var itemModel;
            _this.defer[index] = $.Deferred();
            if (content.type === 'content-piece') {
              itemModel = App.request("get:content:piece:by:id", content.id);
            } else {
              itemModel = App.request("get:quiz:by:id", content.id);
            }
            App.execute("when:fetched", itemModel, function() {
              itemModel.set({
                'order': index + 1
              });
              _this.contentLayoutItems.add(itemModel);
              return _this.defer[index].resolve(itemModel);
            });
            return _this.defer[index].promise();
          };
        })(this));
        $.when.apply($, this.defer).done((function(_this) {
          return function() {
            return _this.deferContent.resolve(_this.contentLayoutItems);
          };
        })(this));
        return this.deferContent.promise();
      };

      GroupController.prototype.startTrainingModule = function() {
        var content_layout, nextQuestion;
        content_layout = model.get('content_layout');
        nextQuestion = _.first(content_layout);
        return this.gotoTrainingModule(nextQuestion, 'class_mode');
      };

      GroupController.prototype.gotoTrainingModule = function(data) {
        var currentItem;
        currentItem = _.first(groupContentCollection.filter(function(model) {
          var modelType;
          modelType = data.type === 'quiz' ? 'type' : 'post_type';
          if (model.id === parseInt(data.id) && model.get(modelType) === data.type) {
            return model;
          }
        }));
        return App.execute("start:student:training:app", {
          region: App.mainContentRegion,
          currentItem: currentItem,
          contentGroupModel: model,
          questionsCollection: groupContentCollection
        });
      };

      GroupController.prototype.showContentGroupViews = function() {
        var textbook_termIDs;
        textbook_termIDs = _.flatten(model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        return App.execute("when:fetched", this.textbookNames, (function(_this) {
          return function() {
            App.execute("show:student:training:content:group:detailsapp", {
              region: _this.layout.collectionDetailsRegion,
              model: model,
              mode: _this.mode,
              questionResponseCollection: _this.questionResponseCollection,
              textbookNames: _this.textbookNames
            });
            if (_.size(model.get('content_layout')) > 0) {
              return App.execute("show:student:training:content:displayapp", {
                region: _this.layout.contentDisplayRegion,
                model: model,
                mode: _this.mode,
                questionResponseCollection: _this.questionResponseCollection,
                groupContentCollection: groupContentCollection,
                studentCollection: _this.studentCollection
              });
            }
          };
        })(this));
      };

      GroupController.prototype._getContentGroupViewLayout = function() {
        return new ContentGroupViewLayout;
      };

      return GroupController;

    })(RegionController);
    ContentGroupViewLayout = (function(superClass) {
      extend(ContentGroupViewLayout, superClass);

      function ContentGroupViewLayout() {
        return ContentGroupViewLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupViewLayout.prototype.template = '<div class="teacher-app"> <div class="direction text-center"> <div class="icon goto-prev-page"><a href="javascript:" class="btn fab-content"><i class="fa fa-hand-o-left"></i></a></div> <p class="welcome-text">You\'re here to view the My Body Organ Lecture</p> </div> <div id="collection-details-region" class="col-lg-10 col-lg-offset-1"></div> </div> <div id="content-display-region"></div>';

      ContentGroupViewLayout.prototype.className = '';

      ContentGroupViewLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupViewLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:student:training:module", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new View.GroupController(opt);
    });
  });
});
