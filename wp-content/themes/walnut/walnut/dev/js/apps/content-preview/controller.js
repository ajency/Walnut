var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'controllers/region-controller', 'apps/content-preview/view', 'apps/content-preview/content-board/controller', 'apps/content-preview/top-panel/controller', 'apps/content-preview/dialogs/hint-dialog/hint-dialog-controller', 'apps/content-preview/dialogs/comment-dialog/comment-dialog-controller', 'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'], function(App, RegionController) {
  return App.module("ContentPreview", function(ContentPreview, App, Backbone, Marionette, $, _) {
    var ContentPreviewRouter, Controller;
    ContentPreviewRouter = (function(_super) {
      __extends(ContentPreviewRouter, _super);

      function ContentPreviewRouter() {
        return ContentPreviewRouter.__super__.constructor.apply(this, arguments);
      }

      ContentPreviewRouter.prototype.appRoutes = {
        'content-piece/:contentID': 'viewContentPieces'
      };

      return ContentPreviewRouter;

    })(Marionette.AppRouter);
    Controller = {
      viewContentPieces: function(id) {
        return App.execute("show:content:preview", {
          region: App.mainContentRegion,
          contentID: id,
          display_mode: 'read-only',
          content_preview: true
        });
      }
    };
    ContentPreview.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getContentPreviewLayout = __bind(this._getContentPreviewLayout, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var contentID, content_preview;
        contentID = options.contentID, this.model = options.model, this.questionResponseModel = options.questionResponseModel, this.timerObject = options.timerObject, this.display_mode = options.display_mode, this.students = options.students, content_preview = options.content_preview, this.classID = options.classID;
        if (contentID) {
          this.model = App.request("get:content:piece:by:id", contentID);
        }
        this.layout = this._getContentPreviewLayout(content_preview);
        this.listenTo(this.layout, 'show:hint:dialog', function(options) {
          return App.execute('show:hint:dialog', {
            hint: options.hint
          });
        });
        this.listenTo(this.layout, 'show:comment:dialog', function(options) {
          return App.execute('show:comment:dialog', {
            comment: options.comment
          });
        });
        App.execute("when:fetched", this.model, (function(_this) {
          return function() {
            return _this.show(_this.layout, {
              loading: true
            });
          };
        })(this));
        return this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:top:panel", {
              region: _this.layout.topPanelRegion,
              model: _this.model,
              questionResponseModel: _this.questionResponseModel,
              timerObject: _this.timerObject,
              display_mode: _this.display_mode,
              students: _this.students,
              classID: _this.classID
            });
            if (_this.model.get('question_type') === 'multiple_eval') {
              return App.execute("show:single:question:multiple:evaluation:app", {
                region: _this.layout.contentBoardRegion,
                questionResponseModel: _this.questionResponseModel,
                studentCollection: _this.students,
                display_mode: _this.display_mode,
                timerObject: _this.timerObject,
                evaluationParams: _this.model.get('grading_params')
              });
            } else {
              return App.execute("show:content:board", {
                region: _this.layout.contentBoardRegion,
                model: _this.model
              });
            }
          };
        })(this));
      };

      Controller.prototype._getContentPreviewLayout = function(content_preview) {
        return new ContentPreview.Views.Layout({
          model: this.model,
          content_preview: content_preview
        });
      };

      return Controller;

    })(RegionController);
    App.commands.setHandler("show:content:preview", function(options) {
      if (options.content_preview == null) {
        options.content_preview = false;
      }
      return new ContentPreview.Controller(options);
    });
    return ContentPreview.on("start", function() {
      return new ContentPreviewRouter({
        controller: Controller
      });
    });
  });
});
