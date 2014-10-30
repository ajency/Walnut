var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/edit-module/content-display/templates/content-display.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("CollectionContentDisplayApp.Controller", function(Controller, App) {
    var ContentDisplayView, ContentItemView;
    Controller.CollectionEditContentDisplayController = (function(_super) {
      __extends(CollectionEditContentDisplayController, _super);

      function CollectionEditContentDisplayController() {
        this.saveContentPieces = __bind(this.saveContentPieces, this);
        this.contentOrderChanged = __bind(this.contentOrderChanged, this);
        this.contentPiecesChanged = __bind(this.contentPiecesChanged, this);
        return CollectionEditContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionEditContentDisplayController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.contentGroupCollection = opts.contentGroupCollection;
        this.view = view = this._getCollectionContentDisplayView();
        this.listenTo(this.contentGroupCollection, 'add remove', this.contentPiecesChanged);
        this.listenTo(view, 'changed:order', this.contentOrderChanged);
        this.listenTo(this.view, 'remove:model:from:quiz', this.removeModelFromQuiz);
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
        var content;
        if (this.model.get('type') === 'quiz') {
          content = this.contentGroupCollection.map(function(quizContent) {
            if (quizContent.get('post_type') === 'content-piece') {
              return {
                type: 'content-piece',
                id: quizContent.get('ID')
              };
            } else {
              return {
                type: 'content_set',
                data: quizContent.toJSON()
              };
            }
          });
        } else {
          content = this.contentGroupCollection.pluck('ID');
        }
        return this.saveContentPieces(content);
      };

      CollectionEditContentDisplayController.prototype.contentOrderChanged = function(ids) {
        var content;
        if (this.model.get('type') === 'quiz') {
          content = new Array();
          _.each(ids, (function(_this) {
            return function(id) {
              var setModel;
              if (_.str.include(id, 'set')) {
                setModel = _this.contentGroupCollection.findWhere({
                  'id': id
                });
                return content.push({
                  type: 'content_set',
                  data: setModel.toJSON()
                });
              } else {
                return content.push({
                  type: 'content-piece',
                  id: parseInt(id)
                });
              }
            };
          })(this));
        } else {
          content = ids;
        }
        return this.saveContentPieces(content);
      };

      CollectionEditContentDisplayController.prototype.saveContentPieces = function(content) {
        if (this.model.get('type') === 'teaching-module') {
          this.model.set('content_pieces', content);
        }
        if (this.model.get('type') === 'quiz') {
          this.model.set('content_layout', content);
        }
        return this.model.save({
          'changed': 'content_pieces'
        }, {
          wait: true
        });
      };

      CollectionEditContentDisplayController.prototype._getCollectionContentDisplayView = function() {
        return new ContentDisplayView({
          model: this.model,
          collection: this.contentGroupCollection
        });
      };

      CollectionEditContentDisplayController.prototype.removeModelFromQuiz = function(id) {
        var setModel;
        if (_.str.include(id, 'set')) {
          setModel = this.contentGroupCollection.findWhere({
            'id': id
          });
          return this.contentGroupCollection.remove(setModel);
        } else {
          return this.contentGroupCollection.remove(parseInt(id));
        }
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

      ContentItemView.prototype.mixinTemplateHelpers = function(data) {
        var i, lvl, _i;
        data = ContentItemView.__super__.mixinTemplateHelpers.call(this, data);
        if (data.post_type === 'content-piece') {
          data.isContentPiece = true;
        }
        if (data.post_type === 'content_set') {
          data.isSet = true;
          data.contentLevels = new Array();
          for (i = _i = 1; _i <= 3; i = ++_i) {
            lvl = parseInt(data["lvl" + i]);
            while (lvl > 0) {
              data.contentLevels.push("Level " + i);
              lvl--;
            }
          }
        }
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        if (this.groupType === 'teaching-module') {
          data.isModule = true;
        }
        if (this.groupType === 'quiz' && data.post_type === 'content-piece') {
          data.marks = this.model.get('marks');
        }
        return data;
      };

      ContentItemView.prototype.initialize = function() {
        return this.groupType = Marionette.getOption(this, 'groupType');
      };

      ContentItemView.prototype.onShow = function() {
        if (this.model.get('post_type') === 'content_set') {
          return this.$el.attr('id', this.model.get('id'));
        } else {
          return this.$el.attr('id', this.model.get('ID'));
        }
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

      ContentDisplayView.prototype.itemViewOptions = function() {
        return {
          groupType: this.model.get('type')
        };
      };

      ContentDisplayView.prototype.events = {
        'click .remove': 'removeItem'
      };

      ContentDisplayView.prototype.modelEvents = {
        'change:post_status': 'statusChanged'
      };

      ContentDisplayView.prototype.statusChanged = function(model, post_status) {
        if (post_status === 'publish' || post_status === 'archive') {
          this.$el.find('.remove').hide();
          return this.$el.find(".cbp_tmtimeline").sortable('disable');
        } else {
          return this.$el.find('.remove').show();
        }
      };

      ContentDisplayView.prototype.onShow = function() {
        this.$el.find(".cbp_tmtimeline").sortable({
          stop: (function(_this) {
            return function(event, ui) {
              var sorted_order;
              sorted_order = _this.$el.find(".cbp_tmtimeline").sortable("toArray");
              console.log(sorted_order);
              return _this.trigger("changed:order", sorted_order);
            };
          })(this)
        });
        return this.statusChanged(this.model, this.model.get('post_status'));
      };

      ContentDisplayView.prototype.removeItem = function(e) {
        var id;
        id = $(e.target).closest('.contentPiece').attr('data-id');
        return this.trigger('remove:model:from:quiz', id);
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