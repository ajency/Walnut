var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/edit-group/content-display/templates/content-display.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("CollectionContentDisplayApp.Controller", function(Controller, App) {
    var ContentDisplayView, ContentItemView;
    Controller.CollectionEditContentDisplayController = (function(_super) {
      __extends(CollectionEditContentDisplayController, _super);

      function CollectionEditContentDisplayController() {
        this.saveContentPieces = __bind(this.saveContentPieces, this);
        this.contentPiecesChanged = __bind(this.contentPiecesChanged, this);
        return CollectionEditContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionEditContentDisplayController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.contentGroupCollection = opts.contentGroupCollection;
        this.view = view = this._getCollectionContentDisplayView(this.model, this.contentGroupCollection);
        this.listenTo(this.contentGroupCollection, 'content:pieces:of:group:added', this.contentPiecesChanged);
        this.listenTo(this.contentGroupCollection, 'content:pieces:of:group:removed', this.contentPiecesChanged);
        this.listenTo(view, 'changed:order', this.saveContentPieces);
        if (this.contentGroupCollection.length > 0) {
          return App.execute("when:fetched", this.contentGroupCollection.models, (function(_this) {
            return function() {
              return _this.show(view, {
                loading: true
              });
            };
          })(this));
        } else {
          return this.show(view, {
            loading: true
          });
        }
      };

      CollectionEditContentDisplayController.prototype.contentPiecesChanged = function() {
        var contentIDs;
        contentIDs = this.contentGroupCollection.pluck('ID');
        return this.saveContentPieces(contentIDs);
      };

      CollectionEditContentDisplayController.prototype.saveContentPieces = function(contentIDs) {
        this.model.set('content_pieces', contentIDs);
        return this.model.save({
          'changed': 'content_pieces'
        }, {
          wait: true
        });
      };

      CollectionEditContentDisplayController.prototype._getCollectionContentDisplayView = function(model, collection) {
        return new ContentDisplayView({
          model: model,
          collection: collection
        });
      };

      return CollectionEditContentDisplayController;

    })(RegionController);
    ContentItemView = (function(_super) {
      __extends(ContentItemView, _super);

      function ContentItemView() {
        return ContentItemView.__super__.constructor.apply(this, arguments);
      }

      ContentItemView.prototype.template = contentDisplayItemTpl;

      ContentItemView.prototype.tagName = 'li';

      ContentItemView.prototype.className = 'sortable';

      ContentItemView.prototype.onShow = function() {
        return this.$el.attr('id', this.model.get('ID'));
      };

      return ContentItemView;

    })(Marionette.ItemView);
    ContentDisplayView = (function(_super) {
      __extends(ContentDisplayView, _super);

      function ContentDisplayView() {
        this.removeItem = __bind(this.removeItem, this);
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = '<ul class="cbp_tmtimeline"></ul>';

      ContentDisplayView.prototype.itemView = ContentItemView;

      ContentDisplayView.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      ContentDisplayView.prototype.className = 'col-md-10';

      ContentDisplayView.prototype.id = 'myCanvas-miki';

      ContentDisplayView.prototype.events = {
        'click .remove': 'removeItem'
      };

      ContentDisplayView.prototype.onShow = function() {
        this.$el.find(".cbp_tmtimeline").sortable();
        return this.$el.find(".cbp_tmtimeline").on("sortstop", (function(_this) {
          return function(event, ui) {
            var sorted_order;
            sorted_order = _this.$el.find(".cbp_tmtimeline").sortable("toArray");
            return _this.trigger("changed:order", sorted_order);
          };
        })(this));
      };

      ContentDisplayView.prototype.removeItem = function(e) {
        var id;
        id = $(e.target).closest('.contentPiece').attr('data-id');
        return this.collection.remove(parseInt(id));
      };

      return ContentDisplayView;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:editgroup:content:displayapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollectionEditContentDisplayController(opt);
    });
  });
});
