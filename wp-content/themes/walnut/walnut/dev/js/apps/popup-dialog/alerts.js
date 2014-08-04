var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('AlertBox', function(AlertBox, App) {
    var AlertBoxView;
    AlertBox.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getAlertBoxView = __bind(this._getAlertBoxView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.message_content = options.message_content, this.message_type = options.message_type, this.alert_type = options.alert_type;
        this.view = this._getAlertBoxView();
        this.listenTo(this.view, 'close:popup:dialog', function() {
          return this.region.closeDialog();
        });
        this.listenTo(this.view, 'confirm:yes', (function(_this) {
          return function() {
            return _this.region.trigger("clicked:confirm:yes", _this.message_type);
          };
        })(this));
        return this.show(this.view);
      };

      Controller.prototype._getAlertBoxView = function() {
        return new AlertBoxView({
          message_content: this.message_content,
          alert_type: this.alert_type
        });
      };

      return Controller;

    })(RegionController);
    AlertBoxView = (function(_super) {
      __extends(AlertBoxView, _super);

      function AlertBoxView() {
        return AlertBoxView.__super__.constructor.apply(this, arguments);
      }

      AlertBoxView.prototype.template = '{{message_content}} <div class="clearfix"> {{#confirm}} <button class="btn btn-primary comment-close">No</button> <button id="confirm-yes" class="btn btn-info comment-close m-r-10">Yes</button> {{/confirm}} {{#alert}} <button class="btn btn-info comment-close m-r-10">Ok</button> {{/alert}} </div>';

      AlertBoxView.prototype.dialogOptions = {
        modal_title: 'ALERT'
      };

      AlertBoxView.prototype.events = {
        'click #confirm-yes': function() {
          return this.trigger('confirm:yes');
        },
        'click .comment-close': '_closeComment'
      };

      AlertBoxView.prototype.mixinTemplateHelpers = function(data) {
        var alert_type, message_content;
        message_content = Marionette.getOption(this, 'message_content');
        alert_type = Marionette.getOption(this, 'alert_type');
        data.message_content = message_content;
        if (alert_type === 'alert') {
          data.alert = true;
        }
        if (alert_type === 'confirm') {
          data.confirm = true;
        }
        return data;
      };

      AlertBoxView.prototype._closeComment = function() {
        return this.trigger('close:popup:dialog');
      };

      return AlertBoxView;

    })(Marionette.ItemView);
    return App.commands.setHandler('show:alert:popup', function(options) {
      return new AlertBox.Controller(options);
    });
  });
});
