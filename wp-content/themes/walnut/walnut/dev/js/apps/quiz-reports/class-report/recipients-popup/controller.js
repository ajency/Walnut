var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/quiz-reports/class-report/recipients-popup/composite-view'], function(App, RegionController) {
  return App.module('QuizRecipientsPopup', function(QuizRecipientsPopup, App) {
    QuizRecipientsPopup.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._getSelectRecipientsView = bind(this._getSelectRecipientsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var recipients;
        console.log(options);
        this.communicationModel = options.communicationModel;
        recipients = this.communicationModel.getRecipients();
        return recipients.done((function(_this) {
          return function(result) {
            var recipientsCollection;
            recipientsCollection = new Backbone.Collection(result);
            if (options.communicationModel.attributes.communication_type === 'quiz_published_parent_mail' || options.communicationModel.attributes.communication_type === 'quiz_summary_parent_mail') {
              recipientsCollection = new Backbone.Collection(result[0]);
            }
            recipientsCollection.each(function(m, index) {
              return m.set({
                'id': index + 1
              });
            });
            console.log(recipientsCollection);
            _this.view = _this._getSelectRecipientsView(recipientsCollection);
            _this.show(_this.view);
            _this.listenTo(_this.view, 'close:popup:dialog', function() {
              return this.region.closeDialog();
            });
            return _this.listenTo(_this.view, 'itemview:preview:email', function(itemview, id) {
              var preview, recipient;
              recipient = recipientsCollection.get(id);
              preview = this.communicationModel.getPreview(recipient);
              return preview.done((function(_this) {
                return function(content) {
                  return itemview.triggerMethod("show:preview", content.html);
                };
              })(this));
            });
          };
        })(this));
      };

      Controller.prototype._getSelectRecipientsView = function(recipients) {
        return new QuizRecipientsPopup.Views.RecipientsView({
          model: this.communicationModel,
          collection: recipients
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:quiz:select:recipients:popup', function(options) {
      return new QuizRecipientsPopup.Controller(options);
    });
  });
});
