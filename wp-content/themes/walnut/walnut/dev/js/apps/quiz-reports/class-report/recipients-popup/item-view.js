var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'bootbox', 'apps/quiz-reports/class-report/recipients-popup/item-view'], function(App, bootbox) {
  return App.module("QuizRecipientsPopup.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.RecipientsItemView = (function(superClass) {
      extend(RecipientsItemView, superClass);

      function RecipientsItemView() {
        return RecipientsItemView.__super__.constructor.apply(this, arguments);
      }

      RecipientsItemView.prototype.tagName = 'tr';

      RecipientsItemView.prototype.className = 'gradeX odd';

      RecipientsItemView.prototype.template = ' <td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td>{{parent_name}}</td> <td>{{parent_email}}</td> <td>{{student_name}}</td> {{#quiz_component}} <td>{{quiz_name}}</td> {{/quiz_component}} <td><button class="btn btn-info pull-left email-preview"> <i class="progress-spinner fa fa-spinner fa-spin none"></i> Preview</button> </td>';

      RecipientsItemView.prototype.events = {
        'click .email-preview': function(e) {
          $(e.target).find('i').removeClass('none');
          return this.trigger("preview:email", this.model.id);
        }
      };

      RecipientsItemView.prototype.initialize = function() {
        return console.log(this.model);
      };

      RecipientsItemView.prototype.serializeData = function() {
        var data;
        data = RecipientsItemView.__super__.serializeData.call(this);
        data.quiz_component = localStorage.getItem('quiz_component');
        return data;
      };

      RecipientsItemView.prototype.onShowPreview = function(preview_data) {
        var w;
        this.$el.find('.email-preview i').addClass('none');
        w = window.open("", "Test", "width=650,height=800,scrollbars=1,resizable=1");
        return w.document.writeln(preview_data);
      };

      return RecipientsItemView;

    })(Marionette.ItemView);
  });
});
