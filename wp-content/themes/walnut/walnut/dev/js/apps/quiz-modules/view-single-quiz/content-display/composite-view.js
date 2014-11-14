var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/view-single-quiz/content-display/item-view'], function(App, RegionController) {
  return App.module("QuizItemsDisplayApp.ContentCompositeView", function(ContentCompositeView, App) {
    return ContentCompositeView.View = (function(_super) {
      __extends(View, _super);

      function View() {
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
        return data = {
          quizModel: this.model,
          responseModel: responseModel != null ? responseModel : void 0
        };
      };

      return View;

    })(Marionette.CompositeView);
  });
});
