var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-views'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("QuizModuleApp.EditQuiz.QuizDetails", function(QuizDetails, App) {
    QuizDetails.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.successFn = __bind(this.successFn, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.model = opts.model;
        this.message = this.model.get('message');
        this.view = this._getQuizDetailsView();
        this.listenTo(this.view, 'show:custom:msg:popup', (function(_this) {
          return function(options) {
            var slug;
            slug = options.slug;
            if (_this.message[slug] == null) {
              _this.message[slug] = '';
            }
            return App.execute('show:single:edit:popup', {
              title: slug,
              textArray: _this.message
            });
          };
        })(this));
        this.listenTo(this.view, "save:quiz:details", (function(_this) {
          return function(data) {
            _this.model.set('changed', 'quiz_details');
            _this.model.save(data, {
              wait: true,
              success: _this.successFn,
              error: _this.errorFn
            });
            if (data.status !== 'underreview') {
              return _this.region.trigger("close:content:selection:app");
            }
          };
        })(this));
        return this.show(this.view, {
          loading: true
        });
      };

      Controller.prototype.successFn = function(model) {
        App.navigate("edit-quiz/" + (model.get('id')));
        return this.view.triggerMethod('saved:quiz', model);
      };

      Controller.prototype.errorFn = function() {
        return console.log('error');
      };

      Controller.prototype._getQuizDetailsView = function() {
        return new QuizDetails.Views.DeatailsView({
          model: this.model
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:edit:quiz:details", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new QuizDetails.Controller(opt);
    });
  });
});
