var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['marionette'], function(Marionette) {
  return Marionette.Region.Settings = (function(_super) {
    __extends(Settings, _super);

    function Settings() {
      this._closeViewWhenClickedOutside = __bind(this._closeViewWhenClickedOutside, this);
      return Settings.__super__.constructor.apply(this, arguments);
    }

    Settings.prototype.onShow = function(view) {
      $(window).on('click', this._closeViewWhenClickedOutside);
      return this.$el.draggable();
    };

    Settings.prototype.onClose = function() {
      this.$el.draggable('destroy');
      return $(window).off('click', this._closeViewWhenClickedOutside);
    };

    Settings.prototype._closeViewWhenClickedOutside = function() {
      return this.close();
    };

    return Settings;

  })(Marionette.Region);
});
