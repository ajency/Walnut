var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/top-panel/view'], function(App, RegionController) {
  return App.module("ContentPreview.TopPanel", function(TopPanel, App, Backbone, Marionette, $, _) {
    TopPanel.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.triggerShowTotalMarks = __bind(this.triggerShowTotalMarks, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var triggerOnce;
        this.view = this._showView();
        this.total = 0;
        triggerOnce = _.once(this.triggerShowTotalMarks);
        App.commands.setHandler("show:total:marks", (function(_this) {
          return function(total) {
            _this.total += parseInt(total);
            return triggerOnce();
          };
        })(this));
        return this.show(this.view);
      };

      Controller.prototype.triggerShowTotalMarks = function() {
        return _.delay((function(_this) {
          return function() {
            return _this.view.triggerMethod("show:total:marks", _this.total);
          };
        })(this), 500);
      };

      Controller.prototype._showView = function() {
        return new TopPanel.Views.TopPanelView;
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:top:panel', function(options) {
      return new TopPanel.Controller(options);
    });
  });
});
