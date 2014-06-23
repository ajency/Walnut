var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("SingleQuestionMultipleEvaluationApp.EvaluationApp.Views", function(Views, App) {
    var EvaluationItemView;
    EvaluationItemView = (function(_super) {
      __extends(EvaluationItemView, _super);

      function EvaluationItemView() {
        return EvaluationItemView.__super__.constructor.apply(this, arguments);
      }

      EvaluationItemView.prototype.className = 'row m-l-0 m-r-0 m-t-10 b-grey b-b';

      EvaluationItemView.prototype.template = '<div class="col-sm-4"><h4 class="semi-bold m-t-5 p-b-5">{{param}}</h4></div> {{#attr}} <div class="col-sm-2"><button id="{{.}}" type="button" class="btn btn-white btn-sm btn-small h-center block">{{.}}</button></div> {{/attr}}';

      EvaluationItemView.prototype.events = {
        'click button': '_buttonClicked'
      };

      EvaluationItemView.prototype.initialize = function(options) {
        return this.responseObj = options.responseObj;
      };

      EvaluationItemView.prototype.onShow = function() {
        if (this.responseObj[this.model.get('param')] != null) {
          return this.$el.find("#" + this.responseObj[this.model.get('param')]).removeClass('btn-white').addClass('btn-primary');
        }
      };

      EvaluationItemView.prototype._buttonClicked = function(e) {
        if ($(e.target).closest('button').hasClass('btn-primary')) {

        } else {
          this.$el.find('button.btn-primary').removeClass('btn-primary').addClass('btn-white');
          $(e.target).closest('button').removeClass('btn-white').addClass('btn-primary');
          this.responseObj[this.model.get('param')] = $(e.target).attr('id');
          return console.log(this.responseObj);
        }
      };

      return EvaluationItemView;

    })(Marionette.ItemView);
    return Views.EvaluationView = (function(_super) {
      __extends(EvaluationView, _super);

      function EvaluationView() {
        return EvaluationView.__super__.constructor.apply(this, arguments);
      }

      EvaluationView.prototype.className = 'parameters animated fadeIn';

      EvaluationView.prototype.template = '<div class="tiles grey p-t-10 p-b-10 m-b-10"> <div class="row m-l-0 m-r-0"> <div class="pull-right"> <span id="close-parameters" class="fa fa-times text-grey p-r-15 p-l-15 p-t-15 p-b-15 closeEval"></span> </div> <h3 class="text-center text-grey semi-bold">Evaluation for {{studentName}}</h3> </div> <div id="evaluation-collection"> </div> <div class="row m-r-0 m-l-0 p-t-10"> <button class="btn btn-info h-center block" id="saveEval">Save</button> </div> </div>';

      EvaluationView.prototype.itemView = EvaluationItemView;

      EvaluationView.prototype.itemViewContainer = '#evaluation-collection';

      EvaluationView.prototype.itemViewOptions = function() {
        return {
          responseObj: this.responseObj
        };
      };

      EvaluationView.prototype.mixinTemplateHelpers = function(data) {
        data = EvaluationView.__super__.mixinTemplateHelpers.call(this, data);
        data.studentName = this.studentModel.get('display_name');
        return data;
      };

      EvaluationView.prototype.events = {
        'click #saveEval': '_saveEvalParameters'
      };

      EvaluationView.prototype.initialize = function(options) {
        this.studentModel = Marionette.getOption(this, 'studentModel');
        return this.responseObj = Marionette.getOption(this, 'responseObj');
      };

      EvaluationView.prototype._saveEvalParameters = function() {
        return this.trigger("save:eval:parameters");
      };

      return EvaluationView;

    })(Marionette.CompositeView);
  });
});
