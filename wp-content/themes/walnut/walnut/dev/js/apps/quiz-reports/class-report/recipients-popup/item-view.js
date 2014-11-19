var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/quiz-reports/class-report/recipients-popup/item-view'], function(App) {
  return App.module("RecipientsPopup.Views", function(Views) {
    return Views.RecipientsItemView = (function(_super) {
      __extends(RecipientsItemView, _super);

      function RecipientsItemView() {
        return RecipientsItemView.__super__.constructor.apply(this, arguments);
      }

      RecipientsItemView.prototype.tagName = 'tr';

      RecipientsItemView.prototype.className = 'gradeX odd';

      RecipientsItemView.prototype.template = ' <td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td>{{parent_name}}</td> <td class="col-md-6">{{parent_email}}</td> <td>{{student_name}}</td> <td>{{quiz_name}}</td>';

      RecipientsItemView.prototype.events = {
        'click .btn-success': 'saveScheduled'
      };

      return RecipientsItemView;

    })(Marionette.ItemView);
  });
});
