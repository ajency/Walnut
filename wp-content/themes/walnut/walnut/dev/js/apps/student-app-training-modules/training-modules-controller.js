var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/student-app-training-modules/training-modules-views'], function(App, RegionController) {
  return App.module("StudentsAppTrainingModule.View", function(View, App) {
    var ScheduleModalView;
    View.TrainingModuleController = (function(superClass) {
      extend(TrainingModuleController, superClass);

      function TrainingModuleController() {
        this._showScheduleModal = bind(this._showScheduleModal, this);
        this._getContentGroupsListingView = bind(this._getContentGroupsListingView, this);
        this._saveSchedule = bind(this._saveSchedule, this);
        return TrainingModuleController.__super__.constructor.apply(this, arguments);
      }

      TrainingModuleController.prototype.initialize = function(opts) {
        var textbookID;
        textbookID = opts.textbookID, this.classID = opts.classID, this.division = opts.division, this.mode = opts.mode;
        $.showHeaderAndLeftNav();
        this.textbook = App.request("get:textbook:by:id", textbookID);
        this.contentGroupsCollection = App.request("get:student:training:modules", {
          'textbook': textbookID,
          'division': this.division
        });
        this.chaptersCollection = App.request("get:chapters", {
          'parent': textbookID
        });
        return App.execute("when:fetched", [this.chaptersCollection, this.contentGroupsCollection, this.textbook], (function(_this) {
          return function() {
            var chapter_ids, term_ids, textbook_ids;
            chapter_ids = _.chain(_this.contentGroupsCollection.pluck('term_ids')).pluck('chapter').unique().compact().value();
            textbook_ids = _.chain(_this.contentGroupsCollection.pluck('term_ids')).pluck('textbook').unique().compact().value();
            term_ids = _.union(textbook_ids, chapter_ids);
            _this.textbookNames = App.request("get:textbook:names:by:ids", term_ids);
            return App.execute("when:fetched", _this.textbookNames, function() {
              var view;
              _this.view = view = _this._getContentGroupsListingView(_this.contentGroupsCollection, _this.textbookNames);
              _this.show(_this.view, {
                loading: true
              });
              _this.listenTo(_this.view, {
                "schedule:training": function(id) {
                  var modalview;
                  _this.singleModule = _this.contentGroupsCollection.get(id);
                  modalview = _this._showScheduleModal(_this.singleModule);
                  _this.show(modalview, {
                    region: App.popupRegion
                  });
                  return _this.listenTo(modalview, "save:scheduled:date", _this._saveSchedule);
                }
              });
              return _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
                var chaptersOrSections;
                chaptersOrSections = App.request("get:chapters", {
                  'parent': parentID
                });
                return App.execute("when:fetched", chaptersOrSections, function() {
                  return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
                });
              });
            });
          };
        })(this));
      };

      TrainingModuleController.prototype._saveSchedule = function(id, date) {
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

      TrainingModuleController.prototype._getContentGroupsListingView = function(collection, textbookNames) {
        return new View.TakeClassTextbookModules.ContentGroupsView({
          collection: collection,
          mode: this.mode,
          chaptersCollection: this.chaptersCollection,
          fullCollection: collection.clone(),
          textbookNames: textbookNames,
          templateHelpers: {
            showModulesHeading: (function(_this) {
              return function() {
                var headingString;
                headingString = '<span class="semi-bold">All</span> Modules';
                if (_this.mode === 'training') {
                  headingString = '<span class="semi-bold">Practice</span> Modules';
                }
                return headingString;
              };
            })(this)
          }
        });
      };

      TrainingModuleController.prototype._showScheduleModal = function(model) {
        return new ScheduleModalView({
          model: model
        });
      };

      return TrainingModuleController;

    })(RegionController);
    ScheduleModalView = (function(superClass) {
      extend(ScheduleModalView, superClass);

      function ScheduleModalView() {
        this.saveScheduledDate = bind(this.saveScheduledDate, this);
        return ScheduleModalView.__super__.constructor.apply(this, arguments);
      }

      ScheduleModalView.prototype.template = '<div class="modal fade" id="schedule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title" id="myModalLabel">Schedule Module</h4> </div> <div class="modal-body"> <div data-date-format="yyyy-mm-dd" class="input-append success date"> <input id="scheduled-date" type="text" value="{{training_date}}" placeholder="Select Date" class="span12"> <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span> </div> <button type="button" class="btn btn-success" data-dismiss="modal">Save</button> </div> </div> </div> </div>';

      ScheduleModalView.prototype.events = {
        'click .btn-success': 'saveScheduledDate'
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
    return App.commands.setHandler("show:student:app:training:modules", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new View.TrainingModuleController(opt);
    });
  });
});
