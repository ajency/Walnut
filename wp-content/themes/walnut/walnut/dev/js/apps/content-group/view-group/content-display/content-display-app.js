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
        return CollectionContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionContentDisplayController.prototype.initialize = function(opts) {
        var groupContentCollection, model, questionResponseCollection, view;
        model = opts.model, this.module_name = opts.module_name, questionResponseCollection = opts.questionResponseCollection;
        groupContentCollection = App.request("get:content:pieces:by:ids", model.get('content_pieces'));
        questionResponseCollection = App.request("get:question:response:collection", {
          'division': 3,
          'collection_id': model.get('id')
        });
        this.view = view = this._getCollectionContentDisplayView(model, groupContentCollection, questionResponseCollection);
        this.show(view, {
          loading: true,
          entities: [groupContentCollection, questionResponseCollection]
        });
        return this.listenTo(model, 'training:module:started', this.trainingModuleStarted);
      };

      CollectionContentDisplayController.prototype._getCollectionContentDisplayView = function(model, collection, responseCollection) {
        return new ContentDisplayView({
          model: model,
          collection: collection,
          responseCollection: responseCollection,
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

      ContentDisplayView.prototype.onShow = function() {
        var question, responseCollection, responseQuestionIDs, _i, _len, _ref, _results;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        responseQuestionIDs = responseCollection.pluck('content_piece_id');
        _ref = this.$el.find('.contentPiece');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          question = _ref[_i];
          if (_.contains(responseQuestionIDs, $(question).attr('data-id'))) {
            _results.push($(question).find('.cbp_tmlabel').addClass('done'));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

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
