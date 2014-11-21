var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizModuleApp.AttemptsController", function(AttemptsController, App) {
    var AttemptsItemView, QuizAttemptsView;
    AttemptsController.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.quizResponseSummaryCollection = opts.quizResponseSummaryCollection;
        this.view = view = this._getAttemptsView(this.model, this.quizResponseSummaryCollection);
        this.show(view);
        return this.listenTo(this.view, 'view:summary', function(summary_id) {
          return this.region.trigger('view:summary', summary_id);
        });
      };

      Controller.prototype._getAttemptsView = function(quizModel, collection) {
        return new QuizAttemptsView({
          model: quizModel,
          collection: collection
        });
      };

      return Controller;

    })(RegionController);
    AttemptsItemView = (function(_super) {
      __extends(AttemptsItemView, _super);

      function AttemptsItemView() {
        return AttemptsItemView.__super__.constructor.apply(this, arguments);
      }

      AttemptsItemView.prototype.template = '<div class="col-md-4"> <h5 class="semi-bold">{{taken_on}}</h5> </div> <div class="col-md-4"> <h5 class="semi-bold">{{total_marks_scored}}</h5> </div> <div class="col-md-3"> <h5 class="semi-bold">{{time_taken}}</h5> </div> <div class="col-md-1 p-b-5"> <button data-id={{summary_id}} type="button" class="pull-right view-summary btn btn-info btn-small m-t-5">view &nbsp; <i></i></button> <div class="clearfix"></div> </div>';

      AttemptsItemView.prototype.className = 'row b-t b-grey';

      AttemptsItemView.prototype.mixinTemplateHelpers = function(data) {
        data.taken_on = moment(data.taken_on).format("Do MMM YYYY");
        data.time_taken = $.timeMinSecs(data.total_time_taken);
        return data;
      };

      return AttemptsItemView;

    })(Marionette.ItemView);
    QuizAttemptsView = (function(_super) {
      __extends(QuizAttemptsView, _super);

      function QuizAttemptsView() {
        return QuizAttemptsView.__super__.constructor.apply(this, arguments);
      }

      QuizAttemptsView.prototype.template = '<div class="tiles white grid simple vertical blue"> <div class="grid-title no-border"> <h4 class="grid-body-toggle pointer">List of <span class="semi-bold">Attempts</span></h4> <div class="tools"> <a href="javascript:;" class="expand"></a> </div> </div> <div class="none grid-body no-border contentSelect"> <div class="row"> <div class="col-md-4"> <label class="text-grey">Attempted On </label> </div> <div class="col-md-4"> <label class="text-grey">Marks Scored (out of {{marks}}) </label> </div> <div class="col-md-3"> <label class="text-grey">Time Taken (out of {{total_minutes}}m) </label> </div> </div> <div id="attempts_list"> </div> </div> </div>';

      QuizAttemptsView.prototype.itemView = AttemptsItemView;

      QuizAttemptsView.prototype.itemViewContainer = '#attempts_list';

      QuizAttemptsView.prototype.events = {
        'click .view-summary': function(e) {
          $(e.target).find('i').addClass('fa fa-spinner fa-spin');
          return setTimeout((function(_this) {
            return function() {
              return _this.trigger('view:summary', $(e.target).attr('data-id'));
            };
          })(this), 200);
        }
      };

      return QuizAttemptsView;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:quiz:attempts:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new AttemptsController.Controller(opt);
    });
  });
});
