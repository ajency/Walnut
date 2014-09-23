var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudentsFilterApp", function(StudentsFilterApp, App, Backbone, Marionette, $, _) {
    var StudentsFilterView;
    StudentsFilterApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.students = opts.students;
        this.view = this._getStudentsFilterView();
        this.show(this.view, {
          loading: true
        });
        return this.listenTo(this.region, "change:division", function(students) {
          this.students.reset(students.models);
          return this.show(this.view);
        });
      };

      Controller.prototype._getStudentsFilterView = function() {
        return new StudentsFilterView({
          students: this.students
        });
      };

      return Controller;

    })(RegionController);
    StudentsFilterView = (function(_super) {
      __extends(StudentsFilterView, _super);

      function StudentsFilterView() {
        return StudentsFilterView.__super__.constructor.apply(this, arguments);
      }

      StudentsFilterView.prototype.template = '<div>Number of Students : {{totalStudents}} View quizzes taken by Student Name : <select class="select-student"> {{#students}} <option value="{{ID}}">{{display_name}}</option> {{/students}} </select> or Roll Number : <select class="select-student"> {{#students}} <option value="{{ID}}">{{roll_no}}</option> {{/students}} </select> <button class="btn btn-success">View Student</button> </div>';

      StudentsFilterView.prototype.events = {
        'change .select-student': function(e) {
          return this.$el.find('.select-student').select2('val', $(e.target).val());
        }
      };

      StudentsFilterView.prototype.mixinTemplateHelpers = function(data) {
        data = StudentsFilterView.__super__.mixinTemplateHelpers.call(this, data);
        data.totalStudents = _.size(this.students);
        data.students = this.students.toJSON();
        return data;
      };

      StudentsFilterView.prototype.initialize = function() {
        return this.students = Marionette.getOption(this, 'students');
      };

      StudentsFilterView.prototype.onShow = function() {
        return this.$el.find('select').select2();
      };

      return StudentsFilterView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:student:filter:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new StudentsFilterApp.Controller(opt);
    });
  });
});
