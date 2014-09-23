var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudnetsFilterApp", function(StudnetsFilterApp, App, Backbone, Marionette, $, _) {
    var StudentsFilterView;
    StudnetsFilterApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.division = opts.division;
        this.view = this._getStudentsFilterView();
        return this.show(layout, {
          loading: true
        });
      };

      Controller.prototype._getStudentsFilterView = function() {
        return new StudentsFilterView();
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
        'click #search-btn': 'searchContent',
        'keypress .search-box': function(e) {
          if (e.which === 13) {
            return this.searchContent();
          }
        }
      };

      return StudentsFilterView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:student:filter:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new StudnetsFilterApp.Controller(opt);
    });
  });
});
