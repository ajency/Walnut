var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudentsFilterApp", function(StudentsFilterApp, App, Backbone, Marionette, $, _) {
    return StudentsFilterApp.StudentsFilterView = (function(superClass) {
      extend(StudentsFilterView, superClass);

      function StudentsFilterView() {
        return StudentsFilterView.__super__.constructor.apply(this, arguments);
      }

      StudentsFilterView.prototype.template = '<span class="small">View quizzes taken by:</span> <select id="student-name" class="textbook-filter select-student"> <option value="">-student name-</option> {{#students}} <option value="{{ID}}">{{display_name}}</option> {{/students}} </select> <span class="small">or:</span> <select class="textbook-filter select-student"> <option value="">-roll number-</option> {{#students}} <option value="{{ID}}">{{roll_no}}</option> {{/students}} </select> <button class="btn btn-success btn-small view-student">View Student</button> </div>';

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
