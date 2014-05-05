var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/edit-group/templates/content-group.html', 'apps/content-group/view-group/group-details/details-app', 'apps/content-group/view-group/content-display/content-display-app'], function(App, RegionController, contentGroupTpl) {
  return App.module("ContentGroupApp.View", function(View, App) {
    var ContentGroupViewLayout;
    View.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this._getContentGroupViewLayout = __bind(this._getContentGroupViewLayout, this);
        this.showContentGroupViews = __bind(this.showContentGroupViews, this);
        this.gotoTrainingModule = __bind(this.gotoTrainingModule, this);
        this.startTeachingModule = __bind(this.startTeachingModule, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function(opts) {
        var layout;
        this.model = opts.model, this.mode = opts.mode, this.division = opts.division;
        this.questionResponseCollection = App.request("get:question:response:collection", {
          'division': this.division,
          'collection_id': this.model.get('id')
        });
        App.execute("when:fetched", this.model, (function(_this) {
          return function() {
            return _this.groupContentCollection = App.request("get:content:pieces:by:ids", _this.model.get('content_pieces'));
          };
        })(this));
        this.layout = layout = this._getContentGroupViewLayout();
        this.show(layout, {
          loading: true,
          entities: [this.model, this.questionResponseCollection, this.groupContentCollection]
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
        var content_pieces, nextQuestion, responseQuestionIDs;
        responseQuestionIDs = this.questionResponseCollection.pluck('content_piece_id');
        content_pieces = this.model.get('content_pieces');
        nextQuestion = _.first(_.difference(content_pieces, responseQuestionIDs));
        return this.gotoTrainingModule(nextQuestion, 'class_mode');
      };

      GroupController.prototype.gotoTrainingModule = function(question, display_mode) {
        display_mode = 'training' != null ? 'training' : this.mode === 'training';
        return App.execute("start:teacher:teaching:app", {
          region: App.mainContentRegion,
          division: this.division,
          contentPiece: this.groupContentCollection.get(question),
          questionResponseCollection: this.questionResponseCollection,
          contentGroupModel: this.model,
          questionsCollection: this.groupContentCollection,
          display_mode: display_mode
        });
      };

      GroupController.prototype.showContentGroupViews = function() {
        return App.execute("when:fetched", this.model, (function(_this) {
          return function() {
            App.execute("show:viewgroup:content:group:detailsapp", {
              region: _this.layout.collectionDetailsRegion,
              model: _this.model,
              mode: _this.mode,
              questionResponseCollection: _this.questionResponseCollection
            });
            if (_.size(_this.model.get('content_pieces')) > 0) {
              return App.execute("show:viewgroup:content:displayapp", {
                region: _this.layout.contentDisplayRegion,
                model: _this.model,
                mode: _this.mode,
                questionResponseCollection: _this.questionResponseCollection,
                groupContentCollection: _this.groupContentCollection
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
