var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/single-question/templates/module-description-template.html'], function(App, RegionController, moduleDescriptionTemplate) {
  return App.module("TeacherTeachingApp.ModuleDescription", function(ModuleDescription, App) {
    var ModuleDescriptionController, ModuleDescriptionView;
    ModuleDescriptionController = (function(_super) {
      __extends(ModuleDescriptionController, _super);

      function ModuleDescriptionController() {
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        return ModuleDescriptionController.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionController.prototype.initialize = function(opts) {
        var model, view;
        model = opts.model;
        this.view = view = this._showModuleDescriptionView(model);
        return this.show(view);
      };

      ModuleDescriptionController.prototype._showModuleDescriptionView = function(model) {
        return new ModuleDescriptionView({
          model: model
        });
      };

      return ModuleDescriptionController;

    })(RegionController);
    ModuleDescriptionView = (function(_super) {
      __extends(ModuleDescriptionView, _super);

      function ModuleDescriptionView() {
        this.updateTime = __bind(this.updateTime, this);
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = moduleDescriptionTemplate;

      ModuleDescriptionView.prototype.onShow = function() {
        var clock;
        return clock = setInterval(this.updateTime, 500);
      };

      ModuleDescriptionView.prototype.updateTime = function() {
        if (_.size($('#timekeeper')) > 0) {
          return this.$el.find('.timedisplay').html('<i class="fa fa-clock-o"></i> ' + $('#timekeeper').html());
        }
      };

      return ModuleDescriptionView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:teacher:teaching:module:description", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ModuleDescriptionController(opt);
    });
  });
});
