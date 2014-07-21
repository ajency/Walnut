var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/quiz-content-display/quiz-content-display-views'], function(App, RegionController) {
  return App.module("QuizModuleApp.EditQuiz.QuizContentDisplay", function(QuizContentDisplay, App) {
    QuizContentDisplay.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.saveContentPieces = __bind(this.saveContentPieces, this);
        this.contentOrderChanged = __bind(this.contentOrderChanged, this);
        this.contentPiecesChanged = __bind(this.contentPiecesChanged, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.model = opts.model, this.quizContentCollection = opts.quizContentCollection;
        this.view = this._getCollectionContentDisplayView();
        this.listenTo(this.view, 'after:item:added', this.contentPiecesChanged);
        this.listenTo(this.view, 'item:removed', this.contentPiecesChanged);
        this.listenTo(this.view, 'changed:order', this.contentOrderChanged);
        this.listenTo(this.view, 'remove:model:from:quiz', this.removeModelFromQuiz);
        if (this.quizContentCollection.length > 0) {
          return App.execute("when:fetched", this.quizContentCollection.models, (function(_this) {
            return function() {
              return _this.show(_this.view, {
                loading: true
              });
            };
          })(this));
        } else {
          return this.show(this.view, {
            loading: true
          });
        }
      };

      Controller.prototype.contentPiecesChanged = function() {
        var content;
        content = this.quizContentCollection.map(function(quizContent) {
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
        return this.saveContentPieces(content);
      };

      Controller.prototype.contentOrderChanged = function(ids) {
        var content;
        content = new Array();
        _.each(ids, (function(_this) {
          return function(id) {
            var setModel;
            if (_.str.include(id, 'set')) {
              setModel = _this.quizContentCollection.findWhere({
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
        return this.saveContentPieces(content);
      };

      Controller.prototype.saveContentPieces = function(content) {
        console.log(content);
        this.model.set('content_pieces', content);
        return this.model.save({
          'changed': 'content_pieces'
        }, {
          wait: true
        });
      };

      Controller.prototype._getCollectionContentDisplayView = function() {
        return new QuizContentDisplay.Views.ContentDisplayView({
          model: this.model,
          collection: this.quizContentCollection
        });
      };

      Controller.prototype.removeModelFromQuiz = function(id) {
        var setModel;
        if (_.str.include(id, 'set')) {
          setModel = this.quizContentCollection.findWhere({
            'id': id
          });
          return this.quizContentCollection.remove(setModel);
        } else {
          return this.quizContentCollection.remove(parseInt(id));
        }
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:quiz:content:display:app", function(options) {
      return new QuizContentDisplay.Controller(options);
    });
  });
});
