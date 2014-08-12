var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/view-single-quiz/content-display/item-view'], function(App, RegionController) {
  return App.module("QuizItemsDisplayApp.ContentCompositeView", function(ContentCompositeView, App) {
    return ContentCompositeView.View = (function(_super) {
      __extends(View, _super);

      function View() {
        this.viewQuestionReadOnly = __bind(this.viewQuestionReadOnly, this);
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.template = '<div style="display:none" class="tiles grey m-t-20 text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b" id="teacher-check"> Your answers are sent for evaluation. You will be notified as soon as the results are out on your registered email and phone number </div> <div id="myCanvas-miki" class="col-md-10"><ul class="cbp_tmtimeline"></ul></div>';

      View.prototype.itemView = ContentCompositeView.ContentItemView.View;

      View.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      View.prototype.itemViewOptions = function(model, index) {
        var data, responseCollection, responseModel;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        if (responseCollection) {
          responseModel = responseCollection.findWhere({
            "content_piece_id": model.get('ID')
          });
        }
        return data = responseModel != null ? {
          display_answer: this.model.hasPermission('display_answer'),
          responseModel: responseModel
        } : void 0;
      };

      View.prototype.events = {
        'click .cbp_tmlabel.completed': 'viewQuestionReadOnly'
      };

      View.prototype.onShow = function() {
        var completedResponses, question, responseCollection, responseQuestionIDs, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        if (responseCollection) {
          completedResponses = responseCollection.where({
            'status': 'completed'
          });
          if (this.model.hasPermission('teacher_check')) {
            this.$el.find("#teacher-check").show();
          }
          responseQuestionIDs = _.chain(completedResponses).map(function(m) {
            return m.toJSON();
          }).pluck('content_piece_id').value();
          if (Marionette.getOption(this, 'mode') === 'training') {
            _ref = this.$el.find('.contentPiece');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              question = _ref[_i];
              _results.push($(question).find('.cbp_tmlabel').addClass('completed').css('cursor', 'pointer'));
            }
            return _results;
          } else {
            _ref1 = this.$el.find('.contentPiece');
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              question = _ref1[_j];
              if (_.contains(responseQuestionIDs, parseInt($(question).attr('data-id')))) {
                _results1.push($(question).find('.cbp_tmlabel').addClass('done completed').css('cursor', 'pointer'));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }
        }
      };

      View.prototype.viewQuestionReadOnly = function(e) {
        var questionID;
        questionID = $(e.target).closest('.contentPiece').attr('data-id');
        return this.trigger("view:question:readonly", questionID);
      };

      return View;

    })(Marionette.CompositeView);
  });
});
