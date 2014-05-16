var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/edit-group/templates/content-group.html', 'apps/content-group/view-group/group-details/details-app', 'apps/content-group/view-group/content-display/content-display-app'], function(App, RegionController, contentGroupTpl) {
  return App.module("ContentGroupApp.View", function(View, App) {
    var ContentGroupViewLayout;
    View.GroupController = (function(_super) {
      var groupContentCollection, model;

      __extends(GroupController, _super);

      function GroupController() {
        this._getContentGroupViewLayout = __bind(this._getContentGroupViewLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        this.gotoTrainingModule = __bind(this.gotoTrainingModule, this);
        this.startTeachingModule = __bind(this.startTeachingModule, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      model = null;

      groupContentCollection = null;

      GroupController.prototype.initialize = function(opts) {
        var layout;
        model = opts.model, this.classID = opts.classID, this.mode = opts.mode, this.division = opts.division;
        this.questionResponseCollection = App.request("get:question:response:collection", {
          'division': this.division,
          'collection_id': model.get('id')
        });
        App.execute("when:fetched", model, function() {
          return groupContentCollection = App.request("get:content:pieces:by:ids", model.get('content_pieces'));
        });
        this.layout = layout = this._getContentGroupViewLayout();
        this.show(layout, {
          loading: true,
          entities: [model, this.questionResponseCollection, groupContentCollection, this.textbookNames]
        });
        this.listenTo(layout, 'show', this.showContentGroupViews);
        this.listenTo(this.layout.collectionDetailsRegion, 'start:teaching:module', this.startTeachingModule);
        return this.listenTo(this.layout.contentDisplayRegion, 'goto:question:readonly', (function(_this) {
          return function(questionID) {
            App.navigate(App.getCurrentRoute() + '/question');
            return _this.gotoTrainingModule(questionID, 'readonly');
          };
        })(this));
      };

      GroupController.prototype.startTeachingModule = function() {
        var content_pieces, nextQuestion, responseCollection, responseQuestionIDs;
        responseCollection = this.questionResponseCollection.where({
          "status": "completed"
        });
        responseQuestionIDs = _.chain(responseCollection).map(function(m) {
          return m.toJSON();
        }).pluck('content_piece_id').value();
        content_pieces = model.get('content_pieces');
        nextQuestion = _.first(_.difference(content_pieces, responseQuestionIDs));
        return this.gotoTrainingModule(nextQuestion, 'class_mode');
      };

      GroupController.prototype.gotoTrainingModule = function(question, display_mode) {
        if (this.mode === 'training') {
          display_mode = 'training';
        }
        return App.execute("start:teacher:teaching:app", {
          region: App.mainContentRegion,
          division: this.division,
          contentPiece: groupContentCollection.get(question),
          questionResponseCollection: this.questionResponseCollection,
          contentGroupModel: model,
          questionsCollection: groupContentCollection,
          textbookNames: this.textbookNames,
          classID: this.classID,
          display_mode: display_mode
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
            if (_.size(model.get('content_pieces')) > 0) {
              return App.execute("show:viewgroup:content:displayapp", {
                region: _this.layout.contentDisplayRegion,
                model: model,
                mode: _this.mode,
                questionResponseCollection: _this.questionResponseCollection,
                groupContentCollection: groupContentCollection
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
    return ContentGroupViewLayout = (function(_super) {
      __extends(ContentGroupViewLayout, _super);

      function ContentGroupViewLayout() {
        return ContentGroupViewLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupViewLayout.prototype.template = contentGroupTpl;

      ContentGroupViewLayout.prototype.className = '';

      ContentGroupViewLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupViewLayout;

    })(Marionette.Layout);
  });
});
