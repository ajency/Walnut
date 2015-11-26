var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("DashboardStartTrainingApp.Controller", function(Controller, App) {
    var TeachersStartTrainingView;
    Controller.DashboardStartTrainingController = (function(_super) {
      __extends(DashboardStartTrainingController, _super);

      function DashboardStartTrainingController() {
        return DashboardStartTrainingController.__super__.constructor.apply(this, arguments);
      }

      DashboardStartTrainingController.prototype.initialize = function(opts) {
        var view;
        this.view = view = this._getStartTrainingView(opts.divisionsCollection);
        return this.show(view, {
          loading: true
        });
      };

      DashboardStartTrainingController.prototype._getStartTrainingView = function(divisions) {
        return new TeachersStartTrainingView({
          collection: divisions
        });
      };

      return DashboardStartTrainingController;

    })(RegionController);
    TeachersStartTrainingView = (function(_super) {
      __extends(TeachersStartTrainingView, _super);

      function TeachersStartTrainingView() {
        return TeachersStartTrainingView.__super__.constructor.apply(this, arguments);
      }

      TeachersStartTrainingView.prototype.template = '<h1 class="text-center muted m-b-20">Select a <span class="bold">class</span> to begin</h1> <ul class="classes"> {{#classes}} <li><a href="#teachers/start-training/{{id}}"><div class="classesWrap">{{label}}</div></a></li> {{/classes}} </ul>';

      TeachersStartTrainingView.prototype.className = 'animated fadeInUp';

      TeachersStartTrainingView.prototype.mixinTemplateHelpers = function() {
        var c, class_id, class_ids, classes, data, _i, _len;
        data = TeachersStartTrainingView.__super__.mixinTemplateHelpers.call(this, data);
        classes = [];
        class_ids = _.unique(this.collection.pluck('class_id'));
        for (_i = 0, _len = class_ids.length; _i < _len; _i++) {
          class_id = class_ids[_i];
          c = [];
          c.id = class_id;
          c.label = CLASS_LABEL[class_id];
          classes.push(c);
        }
        data.classes = classes;
        return data;
      };

      return TeachersStartTrainingView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:dashboard:start:training:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.DashboardStartTrainingController(opt);
    });
  });
});
