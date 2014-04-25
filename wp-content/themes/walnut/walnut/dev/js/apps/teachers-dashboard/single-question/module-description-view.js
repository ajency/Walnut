var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/teachers-dashboard/single-question/templates/module-description-template.html'], function(App, moduleDescriptionTemplate) {
  return App.module("TeachersDashboardApp.View.ModuleDescription", function(ModuleDescription, App) {
    return ModuleDescription.Description = (function(_super) {
      __extends(Description, _super);

      function Description() {
        this.updateTime = __bind(this.updateTime, this);
        return Description.__super__.constructor.apply(this, arguments);
      }

      Description.prototype.className = 'pieceWrapper';

      Description.prototype.template = moduleDescriptionTemplate;

      Description.prototype.onShow = function() {
        var clock;
        return clock = setInterval(this.updateTime, 500);
      };

      Description.prototype.updateTime = function() {
        return this.$el.find('.timedisplay').html('<i class="fa fa-clock-o"></i> ' + $('#timekeeper').html());
      };

      return Description;

    })(Marionette.ItemView);
  });
});
