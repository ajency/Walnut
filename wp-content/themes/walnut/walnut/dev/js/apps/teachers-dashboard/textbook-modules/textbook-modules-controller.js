var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ContentGroupsItemView, ContentGroupsView;
    View.textbookModulesController = (function(_super) {
      __extends(textbookModulesController, _super);

      function textbookModulesController() {
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        return textbookModulesController.__super__.constructor.apply(this, arguments);
      }

      textbookModulesController.prototype.initialize = function(opts) {
        var textbookID, view;
        textbookID = opts.textbookID;
        this.textbook = App.request("get:textbook:by:id", textbookID);
        this.contentGroupsCollection = App.request("get:content:groups", {
          'textbook': textbookID
        });
        this.view = view = this._getContentGroupsListingView(this.contentGroupsCollection);
        App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            var breadcrumb_items, textbookName;
            textbookName = _this.textbook.get('name');
            breadcrumb_items = {
              'items': [
                {
                  'label': 'Dashboard',
                  'link': '#teachers/dashboard'
                }, {
                  'label': 'Take Class',
                  'link': 'javascript:;'
                }, {
                  'label': textbookName,
                  'link': 'javascript:;',
                  'active': 'active'
                }
              ]
            };
            App.execute("update:breadcrumb:model", breadcrumb_items);
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        return this.listenTo(this.view, {
          "save:training:status": (function(_this) {
            return function(id) {
              var singleModule;
              singleModule = _this.contentGroupsCollection.get(id);
              singleModule.set({
                'status': 'started'
              });
              singleModule.save({
                'changed': 'status'
              }, {
                wait: true
              });
              return _this.view.triggerMethod('status:change', singleModule);
            };
          })(this)
        });
      };

      textbookModulesController.prototype._getContentGroupsListingView = function(collection) {
        return new ContentGroupsView({
          collection: collection,
          templateHelpers: {
            showTextbookName: (function(_this) {
              return function() {
                return _this.textbook.get('name');
              };
            })(this)
          }
        });
      };

      return textbookModulesController;

    })(RegionController);
    ContentGroupsItemView = (function(_super) {
      __extends(ContentGroupsItemView, _super);

      function ContentGroupsItemView() {
        return ContentGroupsItemView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsItemView.prototype.template = '<td class="v-align-middle"><a href="#"></a>{{name}}</td> <td class="v-align-middle"><span class="muted">{{duration}} {{minshours}}</span></td> <td> <span class="muted status_label">{{&status_str}}</span> <button data-id="{{id}}" type="button" class="btn btn-white btn-small pull-right action start-training"> {{&action_str}} </button> <button type="button" class="btn btn-white btn-small pull-right m-r-10 training-date" data-toggle="modal" data-target="#schedule"> <i class="fa fa-calendar"></i> {{training_date}} </button> </td>';

      ContentGroupsItemView.prototype.tagName = 'tr';

      ContentGroupsItemView.prototype.events = {
        'click .training-date': 'scheduleTraining'
      };

      ContentGroupsItemView.prototype.onShow = function() {
        return this.$el.attr('id', 'row-' + this.model.get('id'));
      };

      ContentGroupsItemView.prototype.serializeData = function() {
        var data, status, training_date;
        data = ContentGroupsItemView.__super__.serializeData.call(this);
        training_date = this.model.get('training_date');
        if (training_date === '') {
          data.training_date = 'Schedule';
        } else {
          data.training_date = moment(training_date).format("Do MMM YYYY");
        }
        status = this.model.get('status');
        if (status === 'started') {
          data.status_str = '<span class="label label-info">In Progress</span>';
          data.action_str = '<i class="fa fa-pause"></i> Resume';
        } else if (status === 'completed') {
          data.status_str = '<span class="label label-success">Completed</span>';
          data.action_str = '<i class="fa fa-repeat"></i> Replay';
        } else {
          data.status_str = '<span class="label label-important">Not Started</span>';
          data.action_str = '<i class="fa fa-play"></i> Start';
        }
        return data;
      };

      ContentGroupsItemView.prototype.scheduleTraining = function() {
        return console.log('schedule training');
      };

      return ContentGroupsItemView;

    })(Marionette.ItemView);
    return ContentGroupsView = (function(_super) {
      __extends(ContentGroupsView, _super);

      function ContentGroupsView() {
        this.startTraining = __bind(this.startTraining, this);
        return ContentGroupsView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsView.prototype.template = '<div class="tiles white grid simple vertical blue"> <div class="grid-title no-border"> <h4 class="">Textbook <span class="semi-bold">{{showTextbookName}}</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div class="row"> <div class="col-lg-12"> <h4><span class="semi-bold">All</span> Modules</h4> <table class="table table-hover table-condensed table-fixed-layout table-bordered" id="modules"> <thead> <tr> <th style="width:50%">Name</th> <th style="width:10%" >Duration</th> <th style="width:40%">Status</th> </tr> </thead> <tbody> </tbody> </table> </div> </div> </div> </div>';

      ContentGroupsView.prototype.itemView = ContentGroupsItemView;

      ContentGroupsView.prototype.itemViewContainer = 'tbody';

      ContentGroupsView.prototype.className = 'teacher-app moduleList';

      ContentGroupsView.prototype.events = {
        'click .start-training': 'startTraining'
      };

      ContentGroupsView.prototype.startTraining = function(e) {
        var dataID;
        dataID = $(e.target).attr('data-id');
        return this.trigger("save:training:status", dataID);
      };

      ContentGroupsView.prototype.onStatusChange = function(model) {
        var id, status;
        status = model.get('status');
        id = model.get('id');
        if (status === 'started') {
          this.$el.find('tr#row-' + id + ' .start-training').empty().html('<i class="fa fa-pause"></i> Resume');
          this.$el.find('tr#row-' + id + ' .status_label').html('<span class="label label-info">In Progress</span>');
          return this.$el.find('tr#row-' + id + ' .training-date').html('<i class="fa fa-calendar"></i> ' + moment().format("Do MMM YYYY"));
        }
      };

      ContentGroupsView.prototype.onShow = function() {
        return $('.input-append.date').datepicker({
          autoclose: true,
          todayHighlight: true
        });
      };

      return ContentGroupsView;

    })(Marionette.CompositeView);
  });
});
