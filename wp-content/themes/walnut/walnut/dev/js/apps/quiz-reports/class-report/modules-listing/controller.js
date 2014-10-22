var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/class-report/modules-listing/composite-view'], function(App, RegionController) {
  return App.module("ClassQuizReportListing", function(ClassQuizReportListing, App, Backbone, Marionette, $, _) {
    ClassQuizReportListing.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getContentModulessListingView = __bind(this._getContentModulessListingView, this);
        this._getAllTermIDs = __bind(this._getAllTermIDs, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.contentModulesCollection = opts.contentModulesCollection, this.textbooksCollection = opts.textbooksCollection;
        this.textbookNamesCollection = null;
        return App.execute("when:fetched", [this.contentModulesCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var term_ids;
            term_ids = _this._getAllTermIDs();
            _this.textbookNamesCollection = App.request("get:textbook:names:by:ids", term_ids);
            return App.execute("when:fetched", _this.textbookNamesCollection, function() {
              var view;
              _this.view = view = _this._getContentModulessListingView();
              _this.show(view, {
                loading: true,
                entities: [_this.contentModulesCollection, _this.textbooksCollection]
              });
              _this.listenTo(_this.region, "update:pager", function() {
                var newNamesCollection;
                term_ids = _this._getAllTermIDs();
                newNamesCollection = App.request("get:textbook:names:by:ids", term_ids);
                return App.execute("when:fetched", newNamesCollection, function() {
                  return _this.view.triggerMethod("reset:textbook:names", newNamesCollection);
                });
              });
              _this.listenTo(_this.view, 'itemview:view:quiz:report', _this._showQuizReportApp);
              return _this.listenTo(_this.view, "save:communications", function(data) {
                return _this.region.trigger("save:communications", data);
              });
            });
          };
        })(this));
      };

      Controller.prototype._getAllTermIDs = function() {
        return _.chain(this.contentModulesCollection.pluck('term_ids')).map(function(m) {
          return _.values(m);
        }).flatten().unique().compact().value();
      };

      Controller.prototype._showQuizReportApp = function(itemview, quiz_id) {
        return this.region.trigger("show:quiz:report", this.contentModulesCollection.get(quiz_id));
      };

      Controller.prototype._getContentModulessListingView = function() {
        return new ClassQuizReportListing.Views.ModulesListingView({
          collection: this.contentModulesCollection,
          textbookNamesCollection: this.textbookNamesCollection
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:list:quiz:report:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ClassQuizReportListing.Controller(opt);
    });
  });
});
