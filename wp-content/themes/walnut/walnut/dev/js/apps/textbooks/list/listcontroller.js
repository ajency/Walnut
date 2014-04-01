var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/textbooks/list/views', 'apps/textbooks/list/textbook-layout'], function(App, RegionController) {
  return App.module("TextbooksApp.List", function(List, App) {
    return List.ListController = (function(_super) {
      __extends(ListController, _super);

      function ListController() {
        this._showTextBooksListView = __bind(this._showTextBooksListView, this);
        return ListController.__super__.constructor.apply(this, arguments);
      }

      ListController.prototype.initialize = function() {
        var layout;
        this.textbooksCollection = App.request("get:textbooks");
        this.layout = layout = this._getTextbooksListLayout();
        this.listenTo(layout, "show", this._showTextBooksListView);
        this.listenTo(layout, "show", this._showBreadcrumbView);
        return this.show(layout, {
          loading: true
        });
      };

      ListController.prototype._showTextBooksListView = function() {
        return App.execute("when:fetched", this.textbooksCollection, (function(_this) {
          return function() {
            var textbookListView;
            textbookListView = new List.Views.ListView({
              collection: _this.textbooksCollection
            });
            return _this.layout.textbooksListRegion.show(textbookListView);
          };
        })(this));
      };

      ListController.prototype._showBreadcrumbView = function() {
        var breadcrumbView;
        breadcrumbView = new List.Views.TextbookBreadcrumbView;
        return this.layout.breadcrumbRegion.show(breadcrumbView);
      };

      ListController.prototype._getTextbooksListLayout = function() {
        return new List.Views.TextbookListLayout;
      };

      return ListController;

    })(RegionController);
  });
});
