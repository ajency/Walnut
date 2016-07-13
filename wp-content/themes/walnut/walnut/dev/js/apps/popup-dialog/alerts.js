var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('AlertBox', function(AlertBox, App) {
    var AlertBoxView;
    AlertBox.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._getAlertBoxView = bind(this._getAlertBoxView, this);
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
        this.listenTo(this.view, 'alert:ok', (function(_this) {
          return function() {
            return _this.region.trigger("clicked:alert:ok", _this.message_type);
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
    AlertBoxView = (function(superClass) {
      extend(AlertBoxView, superClass);

      function AlertBoxView() {
        return AlertBoxView.__super__.constructor.apply(this, arguments);
      }

      AlertBoxView.prototype.template = '{{message_content}} <div class="clearfix"> {{#confirm}} <button class="btn btn-primary comment-close">No</button> <button id="confirm-yes" class="btn btn-info comment-close m-r-10">Yes</button> {{/confirm}} {{#alert}} <button id="alert-ok" class="btn btn-info comment-close m-r-10">Ok</button> {{/alert}} </div>';

      AlertBoxView.prototype.events = {
        'click #confirm-yes': function() {
          return this.trigger('confirm:yes');
        },
        'click #alert-ok': function() {
          return this.trigger('alert:ok');
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

      AlertBoxView.prototype.onShow = function() {
        return this.$el.closest('.modal-dialog').find('.modal-header h4').html(_.humanize(Marionette.getOption(this, 'alert_type')));
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
