var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/dashboard/templates/teachers-dashboard.html'], function(App, RegionController, teachersDashboardTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var TeachersDashboardView;
    View.DashboardController = (function(_super) {
      __extends(DashboardController, _super);

      function DashboardController() {
        return DashboardController.__super__.constructor.apply(this, arguments);
      }

      DashboardController.prototype.initialize = function() {
        var breadcrumb_items, divisionsCollection, view;
        divisionsCollection = App.request("get:divisions");
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.view = view = this._getTeachersDashboardView(divisionsCollection);
        return this.show(view, {
          loading: true
        });
      };

      DashboardController.prototype._getTeachersDashboardView = function(divisions) {
        return new TeachersDashboardView({
          collection: divisions
        });
      };

      return DashboardController;

    })(RegionController);
    return TeachersDashboardView = (function(_super) {
      __extends(TeachersDashboardView, _super);

      function TeachersDashboardView() {
        this.loadDivisions = __bind(this.loadDivisions, this);
        return TeachersDashboardView.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardView.prototype.template = teachersDashboardTpl;

      TeachersDashboardView.prototype.className = 'row';

      TeachersDashboardView.prototype.events = {
        'change #class': function(e) {
          return this.loadDivisions($(e.target).val());
        },
        'click .submit-btn': 'onSubmitClicked'
      };

      TeachersDashboardView.prototype.onShow = function() {
        var c, c_id, class_ids, classes_dropdown, unique_classes, _i, _j, _len, _len1;
        console.log(this.collection);
        class_ids = this.collection.pluck('class_id');
        class_ids = _.uniq(class_ids);
        unique_classes = [];
        for (_i = 0, _len = class_ids.length; _i < _len; _i++) {
          c_id = class_ids[_i];
          unique_classes.push(this.collection.findWhere({
            'class_id': c_id
          }));
        }
        classes_dropdown = '';
        for (_j = 0, _len1 = unique_classes.length; _j < _len1; _j++) {
          c = unique_classes[_j];
          classes_dropdown += '<option value="' + c.get('class_id') + '">' + c.get('class_label') + '</option>';
        }
        this.$el.find('#class, #class-training').append(classes_dropdown);
        this.loadDivisions(class_ids[0]);
        this.$el.find('#teacherOptns a').click(function(e) {
          e.preventDefault();
          return $(this).tab('show');
        });
        return $('#class, #div, #class-training').select2();
      };

      TeachersDashboardView.prototype.loadDivisions = function(class_id) {
        var div, divs, _i, _len, _results;
        divs = this.collection.where({
          'class_id': parseInt(class_id)
        });
        this.$el.find('#div').empty().select2('data', null);
        _results = [];
        for (_i = 0, _len = divs.length; _i < _len; _i++) {
          div = divs[_i];
          _results.push(this.$el.find('#div').append('<option value="' + div.get('id') + '">' + div.get('division') + '</option>'));
        }
        return _results;
      };

      TeachersDashboardView.prototype.onSubmitClicked = function(e) {
        var class_id, div_id;
        if ($(e.target).val() === 'take-class') {
          class_id = this.$el.find('#class').val();
          div_id = this.$el.find('#div').val();
          App.navigate('teachers/take-class/' + class_id + '/' + div_id, {
            trigger: true
          });
        }
        if ($(e.target).val() === 'start-training') {
          class_id = this.$el.find('#class-training').val();
          return App.navigate('teachers/start-training/' + class_id, {
            trigger: true
          });
        }
      };

      return TeachersDashboardView;

    })(Marionette.ItemView);
  });
});
