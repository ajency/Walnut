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
        model = opts.model, this.mode = opts.mode, questionResponseCollection = opts.questionResponseCollection, groupContentCollection = opts.groupContentCollection;
        this.view = view = this._getCollectionContentDisplayView(model, groupContentCollection, questionResponseCollection);
        this.show(view, {
          loading: true,
          entities: [groupContentCollection, questionResponseCollection]
        });
        this.listenTo(model, 'training:module:started', this.trainingModuleStarted);
        return this.listenTo(this.view, 'view:question:readonly', (function(_this) {
          return function(questionID) {
            return _this.region.trigger('goto:question:readonly', questionID);
          };
        })(this));
      };

      CollectionContentDisplayController.prototype._getCollectionContentDisplayView = function(model, collection, responseCollection) {
        return new ContentDisplayView({
          model: model,
          collection: collection,
          responseCollection: responseCollection,
          mode: this.mode
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
        this.viewQuestionReadOnly = __bind(this.viewQuestionReadOnly, this);
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = '<ul class="cbp_tmtimeline"></ul>';

      ContentDisplayView.prototype.itemView = ContentItemView;

      ContentDisplayView.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      ContentDisplayView.prototype.className = 'col-md-10';

      ContentDisplayView.prototype.id = 'myCanvas-miki';

      ContentDisplayView.prototype.events = {
        'click .cbp_tmlabel.completed': 'viewQuestionReadOnly'
      };

      ContentDisplayView.prototype.onShow = function() {
        var completedResponses, question, responseCollection, responseQuestionIDs, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        completedResponses = responseCollection.where({
          'status': 'completed'
        });
        responseQuestionIDs = _.chain(completedResponses).map(function(m) {
          return m.toJSON();
        }).pluck('content_piece_id').value();
        if (Marionette.getOption(this, 'mode') === 'training') {
          _ref = this.$el.find('.contentPiece');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            question = _ref[_i];
            _results.push($(question).find('.cbp_tmlabel').addClass('completed').css('cursor', 'pointer'));
          }
          return _results;
        } else {
          _ref1 = this.$el.find('.contentPiece');
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            question = _ref1[_j];
            if (_.contains(responseQuestionIDs, $(question).attr('data-id'))) {
              _results1.push($(question).find('.cbp_tmlabel').addClass('done completed').css('cursor', 'pointer'));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }
      };

      ContentDisplayView.prototype.viewQuestionReadOnly = function(e) {
        var questionID;
        questionID = $(e.target).closest('.contentPiece').attr('data-id');
        return this.trigger("view:question:readonly", questionID);
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
