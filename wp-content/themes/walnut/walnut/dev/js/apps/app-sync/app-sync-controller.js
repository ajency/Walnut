var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse"], function(Marionette, App, _, parse) {
  var SynchronizationController;
  return SynchronizationController = (function(_super) {
    __extends(SynchronizationController, _super);

    function SynchronizationController() {
      return SynchronizationController.__super__.constructor.apply(this, arguments);
    }

    SynchronizationController.prototype.initialize = function() {};

    SynchronizationController.prototype.startSync = function() {
      console.log('Started Controller');
      return this.error();
    };

    SynchronizationController.prototype.error = function() {};

    App.reqres.setHandler("get:sync:controller", function() {
      return new SynchronizationController;
    });

    return SynchronizationController;

  })(Marionette.Controller);
});
