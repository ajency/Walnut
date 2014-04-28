var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/view-group/content-display/templates/content-display.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("CollectionContentDisplayApp.Controller", function(Controller, App) {
    var ContentDisplayView, ContentItemView;
    Controller.CollectionContentDisplayController = (function(_super) {
      __extends(CollectionContentDisplayController, _super);

      function CollectionContentDisplayController() {
        this.trainingModuleStarted = __bind(this.trainingModuleStarted, this);
        this._getCollectionContentDisplayView = __bind(this._getCollectionContentDisplayView, this);
        this.showView = __bind(this.showView, this);
        return CollectionContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionContentDisplayController.prototype.initialize = function(opts) {
        this.model = opts.model;
        this.module = opts.module;
        this.groupContentCollection = App.request("get:content:pieces:by:ids", this.model.get('content_pieces'));
        App.execute("when:fetched", this.groupContentCollection, this.showView);
        return this.listenTo(this.model, 'training:module:started', this.trainingModuleStarted);
      };

      CollectionContentDisplayController.prototype.showView = function() {
        var view;
        this.view = view = this._getCollectionContentDisplayView(this.model);
        return this.show(view, {
          loading: true,
          entities: [this.groupContentCollection]
        });
      };

      CollectionContentDisplayController.prototype._getCollectionContentDisplayView = function(model) {
        return new ContentDisplayView({
          model: model,
          collection: this.groupContentCollection,
          module: this.module
        });
      };

      CollectionContentDisplayController.prototype.trainingModuleStarted = function() {
        return this.view.triggerMethod("apply:urls");
      };

      return CollectionContentDisplayController;

    })(RegionController);
    ContentItemView = (function(_super) {
      __extends(ContentItemView, _super);

      function ContentItemView() {
        return ContentItemView.__super__.constructor.apply(this, arguments);
      }

      ContentItemView.prototype.template = contentDisplayItemTpl;

      ContentItemView.prototype.tagName = 'li';

      ContentItemView.prototype.className = '';

      return ContentItemView;

    })(Marionette.ItemView);
    ContentDisplayView = (function(_super) {
      __extends(ContentDisplayView, _super);

      function ContentDisplayView() {
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = '<ul class="cbp_tmtimeline"></ul>';

      ContentDisplayView.prototype.itemView = ContentItemView;

      ContentDisplayView.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      ContentDisplayView.prototype.className = 'col-md-10';

      ContentDisplayView.prototype.id = 'myCanvas-miki';

      ContentDisplayView.prototype.onApplyUrls = function() {
        var currentRoute, item, itemurl, url, _i, _len, _ref, _results;
        currentRoute = App.getCurrentRoute();
        url = '#' + currentRoute + '/';
        _ref = this.$el.find('li .contentPiece');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          itemurl = url + $(item).attr('data-id');
          _results.push($(item).find('a').attr('href', itemurl));
        }
        return _results;
      };

      return ContentDisplayView;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:viewgroup:content:displayapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollectionContentDisplayController(opt);
    });
  });
});
