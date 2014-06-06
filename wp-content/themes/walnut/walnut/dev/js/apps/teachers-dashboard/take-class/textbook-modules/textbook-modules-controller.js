var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/take-class/textbook-modules/textbook-modules-views'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ScheduleModalView;
    View.textbookModulesController = (function(_super) {
      __extends(textbookModulesController, _super);

      function textbookModulesController() {
        this._showScheduleModal = __bind(this._showScheduleModal, this);
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        this._saveTrainingStatus = __bind(this._saveTrainingStatus, this);
        return textbookModulesController.__super__.constructor.apply(this, arguments);
      }

      textbookModulesController.prototype.initialize = function(opts) {
        var textbookID, view;
        textbookID = opts.textbookID;
        this.classID = opts.classID;
        this.division = opts.division;
        this.textbook = App.request("get:textbook:by:id", textbookID);
        this.contentGroupsCollection = App.request("get:content:groups", {
          'textbook': textbookID,
          'division': this.division
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
                  'link': '#teachers/take-class/' + _this.classID + '/' + _this.division
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
          "schedule:training": (function(_this) {
            return function(id) {
              var modalview;
              _this.singleModule = _this.contentGroupsCollection.get(id);
              modalview = _this._showScheduleModal(_this.singleModule);
              _this.show(modalview, {
                region: App.dialogRegion
              });
              return _this.listenTo(modalview, "save:scheduled:date", _this._saveTrainingStatus);
            };
          })(this)
        });
      };

      textbookModulesController.prototype._saveTrainingStatus = function(id, date) {
        var data, first_content_piece, singleModule;
        singleModule = this.contentGroupsCollection.get(id);
        first_content_piece = _.first(singleModule.get('content_pieces'));
        data = {
          collection_id: id,
          content_piece_id: first_content_piece,
          start_date: date,
          division: this.division,
          status: 'scheduled'
        };
        App.request("schedule:content:group", data);
        return this.view.triggerMethod('scheduled:module', id, date);
      };

      textbookModulesController.prototype._getContentGroupsListingView = function(collection) {
        return new View.TakeClassTextbookModules.ContentGroupsView({
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

      textbookModulesController.prototype._showScheduleModal = function(model) {
        return new ScheduleModalView({
          model: model
        });
      };

      return textbookModulesController;

    })(RegionController);
    return ScheduleModalView = (function(_super) {
      __extends(ScheduleModalView, _super);

      function ScheduleModalView() {
        this.saveScheduledDate = __bind(this.saveScheduledDate, this);
        return ScheduleModalView.__super__.constructor.apply(this, arguments);
      }

      ScheduleModalView.prototype.template = '<div class="modal fade" id="schedule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title" id="myModalLabel">Schedule Module</h4> </div> <div class="modal-body"> <div data-date-format="yyyy-mm-dd" class="input-append success date"> <input id="scheduled-date" type="text" value="{{training_date}}" placeholder="Select Date" class="span12"> <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span> </div> <button type="button" class="btn btn-primary" data-dismiss="modal">Save</button> </div> </div> </div> </div>';

      ScheduleModalView.prototype.events = {
        'click .btn-primary': 'saveScheduledDate'
      };

      ScheduleModalView.prototype.onShow = function() {
        var nowDate, today;
        nowDate = new Date();
        today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
        return $('.input-append.date').datepicker({
          autoclose: true,
          todayHighlight: true,
          startDate: today
        });
      };

      ScheduleModalView.prototype.serializeData = function() {
        var data, training_date;
        data = ScheduleModalView.__super__.serializeData.call(this);
        training_date = this.model.get('training_date');
        if (training_date !== '') {
          data.training_date = moment(training_date).format("YYYY-MM-DD");
        }
        return data;
      };

      ScheduleModalView.prototype.saveScheduledDate = function(e) {
        var dataID, scheduledDate;
        dataID = this.model.get('id');
        scheduledDate = this.$el.find('#scheduled-date').val();
        if (scheduledDate !== '') {
          return this.trigger("save:scheduled:date", dataID, scheduledDate);
        }
      };

      return ScheduleModalView;

    })(Marionette.ItemView);
  });
});
