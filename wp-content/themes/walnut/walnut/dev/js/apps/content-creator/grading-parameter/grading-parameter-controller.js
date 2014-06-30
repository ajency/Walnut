var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/grading-parameter/grading-parameter-view'], function(App, RegionController) {
  return App.module("ContentCreator.GradingParameter", function(GradingParameter, App) {
    GradingParameter.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var gradingParamsData;
        this.contentPieceModel = options.contentPieceModel;
        gradingParamsData = this.contentPieceModel.get('grading_params');
        this.gradingParamsCollection = App.request('get:grading:parameter:collection', gradingParamsData);
        this.view = this._getView();
        this.listenTo(this.view, 'itemview:save:grading:parameter', this._saveGradingCollection);
        this.listenTo(this.view, 'itemview:delete:grading:parameter', this._deleteParameter);
        this.listenTo(this.view, 'add:new:grading:parameter', this._addNewParameter);
        this._setMinCollectionSizeAsTwo();
        return this.show(this.view, {
          loading: true,
          entities: this.gradingParamsCollection
        });
      };

      Controller.prototype._setMinCollectionSizeAsTwo = function() {
        var gradingParamsModel, _results;
        _results = [];
        while (this.gradingParamsCollection.size() < 2) {
          gradingParamsModel = App.request("get:grading:parameter");
          _results.push(this.gradingParamsCollection.push(gradingParamsModel));
        }
        return _results;
      };

      Controller.prototype._getView = function() {
        return new GradingParameter.Views.GradingParamsView({
          collection: this.gradingParamsCollection
        });
      };

      Controller.prototype._saveGradingCollection = function() {
        return this.contentPieceModel.set('grading_params', this.gradingParamsCollection.toJSON());
      };

      Controller.prototype._deleteParameter = function(options) {
        this.gradingParamsCollection.remove(options.model);
        this.contentPieceModel.set('grading_params', this.gradingParamsCollection.toJSON());
        return this._setMinCollectionSizeAsTwo();
      };

      Controller.prototype._addNewParameter = function() {
        var gradingParamsModel;
        gradingParamsModel = App.request("get:grading:parameter");
        return this.gradingParamsCollection.push(gradingParamsModel);
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:grading:parameter:view', function(options) {
      console.log('show:grading:parameter:view');
      return new GradingParameter.Controller(options);
    });
  });
});
