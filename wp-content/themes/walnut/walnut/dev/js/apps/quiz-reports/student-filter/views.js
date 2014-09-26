var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudentsFilterApp", function(StudentsFilterApp, App, Backbone, Marionette, $, _) {
    return StudentsFilterApp.StudentsFilterView = (function(_super) {
      __extends(StudentsFilterView, _super);

      function StudentsFilterView() {
        return StudentsFilterView.__super__.constructor.apply(this, arguments);
      }

      StudentsFilterView.prototype.template = 'View quizzes taken by : <select id="student-name" class="select-student"> <option value="">-student name-</option> {{#students}} <option value="{{ID}}">{{display_name}}</option> {{/students}} </select> or : <select class="select-student"> <option value="">-roll number-</option> {{#students}} <option value="{{ID}}">{{roll_no}}</option> {{/students}} </select> <button class="btn btn-success view-student">View Student</button> </div>';

      StudentsFilterView.prototype.events = {
        'change .select-student': function(e) {
          return this.$el.find('.select-student').select2('val', $(e.target).val());
        },
        'click .view-student': function() {
          var stud_id;
          stud_id = this.$el.find("#student-name").val();
          if (stud_id) {
            return this.trigger("view:student:report", stud_id);
          }
        }
      };

      StudentsFilterView.prototype.mixinTemplateHelpers = function(data) {
        data = StudentsFilterView.__super__.mixinTemplateHelpers.call(this, data);
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
  });
});
