var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/quiz-reports/class-report/modules-listing/composite-view'], function(App, RegionController) {
  return App.module("ClassQuizReportListing", function(ClassQuizReportListing, App, Backbone, Marionette, $, _) {
    ClassQuizReportListing.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._getContentModulessListingView = bind(this._getContentModulessListingView, this);
        this._getAllTermIDs = bind(this._getAllTermIDs, this);
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
              console.log(_this.textbookNamesCollection);
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
              _this.listenTo(_this.view, 'itemview:clear:schedule', function(itemview, quiz_id) {
                return this.region.trigger('clear:schedule', this.contentModulesCollection.get(quiz_id));
              });
              _this.listenTo(_this.view, 'itemview:schedule:quiz', function(itemview, quiz_id) {
                return this.region.trigger('schedule:quiz', this.contentModulesCollection.get(quiz_id));
              });
              _this.listenTo(_this.view, "save:communications", function(data) {
                return _this.region.trigger("save:communications", data);
              });
              return _this.listenTo(_this.view, "summary:communication", function(data) {
                return _this.region.trigger("summary:communication", data);
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
