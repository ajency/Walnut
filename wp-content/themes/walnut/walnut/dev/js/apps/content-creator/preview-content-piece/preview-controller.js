var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentCreator.View", function(View, App) {
    var ContentPieceView;
    View.PreviewController = (function(_super) {
      __extends(PreviewController, _super);

      function PreviewController() {
        return PreviewController.__super__.constructor.apply(this, arguments);
      }

      PreviewController.prototype.initialize = function() {
        var breadcrumb_items, view;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.view = view = this._getPreviewView();
        return this.show(view, {
          loading: true
        });
      };

      PreviewController.prototype._getPreviewView = function(divisions) {
        return new ContentPieceView;
      };

      return PreviewController;

    })(RegionController);
    return ContentPieceView = (function(_super) {
      __extends(ContentPieceView, _super);

      function ContentPieceView() {
        return ContentPieceView.__super__.constructor.apply(this, arguments);
      }

      ContentPieceView.prototype.template = '<div class="tiles grey text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b"> <p class="bold small-text">Question Info: </p> <p class="">Maths Chapter 2 Qt</p> </div> <div class="teacherCanvas "> <div class="grid-body p-t-20 p-b-15 no-border"></div> </div>';

      return ContentPieceView;

    })(Marionette.ItemView);
  });
});
