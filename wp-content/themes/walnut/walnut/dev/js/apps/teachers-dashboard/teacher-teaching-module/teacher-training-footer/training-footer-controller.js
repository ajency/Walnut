var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/teacher-teaching-module/teacher-training-footer/training-footer-view'], function(App, RegionController) {
  return App.module("TeacherTrainingFooter", function(TeacherTrainingFooter, App) {
    TeacherTrainingFooter.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var contentPiece;
        contentPiece = opts.contentPiece;
        this.question_type = contentPiece.get('question_type');
        this.contentPieceId = contentPiece.get('ID');
        console.log(this.contentPieceId);
        this.view = this._getFooterView(contentPiece);
        this.listenTo(this.view, "next:question", this._changeQuestion);
        return this.show(this.view);
      };

      Controller.prototype._changeQuestion = function() {
        return this.region.trigger('goto:next:question', this.contentPieceId);
      };

      Controller.prototype._getFooterView = function(contentPiece) {
        return new TeacherTrainingFooter.Views.TrainingFooterView({
          question_type: this.question_type,
          model: contentPiece
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:teacher:training:footer:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new TeacherTrainingFooter.Controller(opt);
    });
  });
});
