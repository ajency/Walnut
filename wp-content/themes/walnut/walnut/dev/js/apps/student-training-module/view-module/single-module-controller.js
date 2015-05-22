var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/student-training-module/view-module/module-description/description-app', 'apps/student-training-module/view-module/content-display/content-display-app', 'apps/student-training-module/take-module/take-module-controller'], function(App, RegionController) {
  return App.module("StudentTrainingApp.View", function(View, App) {
    var ContentGroupViewLayout;
    View.GroupController = (function(_super) {
      var groupContentCollection, model;

      __extends(GroupController, _super);

      function GroupController() {
        this._getContentGroupViewLayout = __bind(this._getContentGroupViewLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        this.gotoTrainingModule = __bind(this.gotoTrainingModule, this);
        this.startTrainingModule = __bind(this.startTrainingModule, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      model = null;

      groupContentCollection = null;

      GroupController.prototype.initialize = function(opts) {
        $.showHeaderAndLeftNav();
        model = opts.model, this.classID = opts.classID, this.mode = opts.mode, this.division = opts.division, this.questionResponseCollection = opts.questionResponseCollection;
        if (!this.questionResponseCollection) {
          this.questionResponseCollection = App.request("get:question:response:collection", {
            'division': this.division,
            'collection_id': model.get('id')
          });
        }
        return App.execute("when:fetched", model, (function(_this) {
          return function() {
            var layout;
            if (model.get('code') === 'ERROR') {
              App.execute("show:no:permissions:app", {
                region: App.mainContentRegion,
                error_header: 'Unauthorized Training Module',
                error_msg: model.get('error_msg')
              });
              return false;
            }
            groupContentCollection = _this._getContentItems(model);
            _this.layout = layout = _this._getContentGroupViewLayout();
            _this.show(_this.layout, {
              loading: true,
              entities: [model, _this.questionResponseCollection, groupContentCollection, _this.textbookNames]
            });
            _this.listenTo(_this.layout, 'show', _this.showContentGroupViews);
            _this.listenTo(_this.layout.collectionDetailsRegion, 'start:training:module', _this.startTrainingModule);
            return _this.listenTo(_this.layout.contentDisplayRegion, 'goto:question:readonly', function(questionID) {
              return _this.gotoTrainingModule(questionID, 'readonly');
            });
          };
        })(this));
      };

      GroupController.prototype._getContentItems = function(model) {
        this.contentLayoutItems = new Backbone.Collection;
        _.each(model.get('content_layout'), (function(_this) {
          return function(content) {
            var itemModel;
            if (content.type === 'content-piece') {
              itemModel = App.request("get:content:piece:by:id", content.id);
            } else {
              itemModel = App.request("get:quiz:by:id", content.id);
            }
            return _this.contentLayoutItems.add(itemModel);
          };
        })(this));
        return this.contentLayoutItems;
      };

      GroupController.prototype.startTrainingModule = function() {
        var content_piece_ids, content_pieces, nextQuestion, responseCollection, responseQuestionIDs;
        responseCollection = this.questionResponseCollection.where({
          "status": "completed"
        });
        window.f = responseCollection;
        responseQuestionIDs = _.chain(responseCollection).map(function(m) {
          return m.toJSON();
        }).pluck('content_piece_id').value();
        content_pieces = model.get('content_pieces');
        if (content_pieces) {
          content_piece_ids = _.map(content_pieces, function(m) {
            return parseInt(m);
          });
        }
        nextQuestion = _.first(_.difference(content_piece_ids, responseQuestionIDs));
        if (model.get('post_status') === 'archive') {
          return this.gotoTrainingModule(nextQuestion, 'readonly');
        } else {
          return this.gotoTrainingModule(nextQuestion, 'class_mode');
        }
      };

      GroupController.prototype.gotoTrainingModule = function(question, display_mode) {
        return App.execute("start:student:training:app", {
          region: App.mainContentRegion,
          division: this.division,
          contentPiece: groupContentCollection.get(question),
          questionResponseCollection: this.questionResponseCollection,
          contentGroupModel: model,
          questionsCollection: groupContentCollection,
          classID: this.classID,
          display_mode: 'training'
        });
      };

      GroupController.prototype.showContentGroupViews = function() {
        var textbook_termIDs;
        textbook_termIDs = _.flatten(model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        return App.execute("when:fetched", this.textbookNames, (function(_this) {
          return function() {
            App.execute("show:viewgroup:content:group:detailsapp", {
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
    ContentGroupViewLayout = (function(_super) {
      __extends(ContentGroupViewLayout, _super);

      function ContentGroupViewLayout() {
        return ContentGroupViewLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupViewLayout.prototype.template = '<div class="teacher-app"> <div id="collection-details-region"></div> </div> <div id="content-display-region"></div>';

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
