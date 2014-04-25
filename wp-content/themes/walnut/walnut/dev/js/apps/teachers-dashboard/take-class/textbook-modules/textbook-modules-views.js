var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("TeachersDashboardApp.View.TakeClassTextbookModules", function(TextbookModules, App) {
    var ContentGroupsItemView;
    ContentGroupsItemView = (function(_super) {
      __extends(ContentGroupsItemView, _super);

      function ContentGroupsItemView() {
        return ContentGroupsItemView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsItemView.prototype.template = '<td class="v-align-middle"><a href="#"></a>{{name}}</td> <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td> <td> <span class="muted status_label">{{&status_str}}</span> <button data-id="{{id}}" type="button" class="btn btn-white btn-small pull-right action start-training"> {{&action_str}} </button> {{&training_date}} </td>';

      ContentGroupsItemView.prototype.tagName = 'tr';

      ContentGroupsItemView.prototype.onShow = function() {
        this.$el.attr('id', 'row-' + this.model.get('id'));
        return this.$el.attr('data-id', this.model.get('id'));
      };

      ContentGroupsItemView.prototype.serializeData = function() {
        var data, status, training_date;
        data = ContentGroupsItemView.__super__.serializeData.call(this);
        training_date = this.model.get('training_date');
        if (training_date === '') {
          training_date = 'Schedule';
        } else {
          training_date = moment(training_date).format("Do MMM YYYY");
        }
        status = this.model.get('status');
        if (status === 'started' || status === 'resumed') {
          data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
          data.status_str = '<span class="label label-info">In Progress</span>';
          data.action_str = '<i class="fa fa-pause"></i> Resume';
        } else if (status === 'completed') {
          data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
          data.status_str = '<span class="label label-success">Completed</span>';
          data.action_str = '<i class="fa fa-repeat"></i> Replay';
        } else {
          data.status_str = '<span class="label label-important">Not Started</span>';
          data.action_str = '<i class="fa fa-play"></i> Start';
          data.training_date = '<button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-right m-r-10 training-date"> <i class="fa fa-calendar"></i> ' + training_date + '</button>';
        }
        return data;
      };

      return ContentGroupsItemView;

    })(Marionette.ItemView);
    return TextbookModules.ContentGroupsView = (function(_super) {
      __extends(ContentGroupsView, _super);

      function ContentGroupsView() {
        this.onShow = __bind(this.onShow, this);
        this.startTraining = __bind(this.startTraining, this);
        return ContentGroupsView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsView.prototype.template = '<div class="tiles white grid simple vertical blue"> <div class="grid-title no-border"> <h4 class="">Textbook <span class="semi-bold">{{showTextbookName}}</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div class="row"> <div class="col-lg-12"> <h4><span class="semi-bold">All</span> Modules</h4> <table class="table table-hover table-condensed table-fixed-layout table-bordered" id="take-class-modules"> <thead> <tr> <th style="width:50%">Name</th> <th class="{sorter:\'minutesSort\'}" style="width:10%" >Duration</th> <th style="width:40%">Status</th> </tr> </thead> <tbody> </tbody> </table> </div> </div> </div> </div>';

      ContentGroupsView.prototype.itemView = ContentGroupsItemView;

      ContentGroupsView.prototype.itemViewContainer = 'tbody';

      ContentGroupsView.prototype.className = 'teacher-app moduleList';

      ContentGroupsView.prototype.events = {
        'click .start-training': 'startTraining',
        'click .training-date': 'scheduleTraining'
      };

      ContentGroupsView.prototype.startTraining = function(e) {
        var dataID;
        dataID = $(e.target).attr('data-id');
        return this.trigger("save:training:status", dataID, 'started');
      };

      ContentGroupsView.prototype.onStatusChange = function(model) {
        var date, id, status;
        status = model.get('status');
        id = model.get('id');
        if (status === 'started') {
          this.$el.find('tr#row-' + id + ' .start-training').empty().html('<i class="fa fa-pause"></i> Resume');
          this.$el.find('tr#row-' + id + ' .status_label').html('<span class="label label-info">In Progress</span>');
          this.$el.find('tr#row-' + id + ' .training-date').html('<i class="fa fa-calendar"></i> ' + moment().format("Do MMM YYYY"));
        }
        if (status === 'scheduled') {
          date = model.get('training_date');
          return this.$el.find('tr#row-' + id + ' .training-date').html('<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY"));
        }
      };

      ContentGroupsView.prototype.scheduleTraining = function(e) {
        var dataID;
        dataID = $(e.target).closest('tr').attr('data-id');
        return this.trigger("schedule:training", dataID);
      };

      ContentGroupsView.prototype.onShow = function() {
        var pagerDiv, pagerOptions;
        this.$el.find('#take-class-modules').tablesorter();
        pagerDiv = '<div id="pager" class="pager"> <i class="fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="fa fa-chevron-right next"></i> <select class="pagesize"> <option selected="selected" value="5">5</option> <option value="10">10</option> <option value="20">20</option> <option value="30">30</option> <option value="40">40</option> </select> </div>';
        this.$el.find('#take-class-modules').after(pagerDiv);
        pagerOptions = {
          totalRows: _.size(this.collection.modules),
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      return ContentGroupsView;

    })(Marionette.CompositeView);
  });
});
