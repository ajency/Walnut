var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-pieces/list-content-pieces/views'], function(App, RegionController) {
  return App.module("ContentPiecesApp.ContentList", function(ContentList, App) {
    ContentList.ListContentPiecesController = (function(superClass) {
      extend(ListContentPiecesController, superClass);

      function ListContentPiecesController() {
        return ListContentPiecesController.__super__.constructor.apply(this, arguments);
      }

      ListContentPiecesController.prototype.initialize = function(opts) {
        var chapter_ids;
        this.contentPiecesCollection = opts.contentPiecesCollection, this.textbooksCollection = opts.textbooksCollection;
        this.allChaptersCollection = null;
        chapter_ids = _.chain(this.contentPiecesCollection.pluck('term_ids')).pluck('chapter').unique().compact().value();
        this.allChaptersCollection = App.request("get:textbook:names:by:ids", chapter_ids);
        this.fullCollection = this.contentPiecesCollection.clone();
        return App.execute("when:fetched", this.allChaptersCollection, (function(_this) {
          return function() {
            var view;
            _this.view = view = _this._getContentPiecesListView();
            _this.show(view, {
              loading: true,
              entities: [_this.contentPiecesCollection, _this.fullCollection]
            });
            return _this.listenTo(_this.region, "update:pager", function() {
              return _this.view.triggerMethod("update:pager");
            });
          };
        })(this));
      };

      ListContentPiecesController.prototype._getContentPiecesListView = function() {
        console.log(this.contentPiecesCollection);
        return new ContentList.Views.ListView({
          collection: this.contentPiecesCollection,
          fullCollection: this.fullCollection,
          textbooksCollection: this.textbooksCollection,
          chaptersCollection: this.allChaptersCollection
        });
      };

      return ListContentPiecesController;

    })(RegionController);
    return App.commands.setHandler("show:list:content:pieces:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ContentList.ListContentPiecesController(opt);
    });
  });
});
