var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("DashboardClassProgressApp.Controller", function(Controller, App) {
    var TeachersTakeClassView;
    Controller.DashboardClassProgressController = (function(_super) {
      __extends(DashboardClassProgressController, _super);

      function DashboardClassProgressController() {
        return DashboardClassProgressController.__super__.constructor.apply(this, arguments);
      }

      DashboardClassProgressController.prototype.initialize = function(opts) {
        var view;
        this.view = view = this._getClassProgressView(opts.divisionsCollection);
        return this.show(view, {
          loading: true
        });
      };

      DashboardClassProgressController.prototype._getTakeClassView = function(divisions) {
        return new TeachersTakeClassView({
          collection: divisions
        });
      };

      return DashboardClassProgressController;

    })(RegionController);
    TeachersTakeClassView = (function(_super) {
      __extends(TeachersTakeClassView, _super);

      function TeachersTakeClassView() {
        return TeachersTakeClassView.__super__.constructor.apply(this, arguments);
      }

      TeachersTakeClassView.prototype.template = '<h1 class="text-center muted m-b-20">Select a <span class="bold">class</span> to begin</h1> <ul class="classes"> {{#divisions}} {{#.}} <li><a href="#teachers/take-class/{{class_id}}/{{id}}"><div class="classesWrap">{{division}}</div></a></li> {{/.}} {{/divisions}} </ul>';

      TeachersTakeClassView.prototype.className = 'animated fadeInUp';

      TeachersTakeClassView.prototype.mixinTemplateHelpers = function() {
        var data;
        data = TeachersTakeClassView.__super__.mixinTemplateHelpers.call(this, data);
        data.divisions = _.chain(this.collection.toJSON()).groupBy('class_id').toArray().value();
        return data;
      };

      TeachersTakeClassView.prototype.changeTab = function(e) {
        e.preventDefault();
        this.$el.find('#teacherOptns a').removeClass('active');
        return $(e.target).addClass('active').tab('show');
      };

      return TeachersTakeClassView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:dashboard:class:progress:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.DashboardClassProgressController(opt);
    });
  });
});
