var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/quiz-reports/class-report/recipients-popup/item-view'], function(App) {
  return App.module("QuizRecipientsPopup.Views", function(Views) {
    return Views.RecipientsView = (function(superClass) {
      extend(RecipientsView, superClass);

      function RecipientsView() {
        return RecipientsView.__super__.constructor.apply(this, arguments);
      }

      RecipientsView.prototype.template = '<table class="table table-bordered tiles white"> <thead> <tr> <th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div></th> <th>Recipient Name (Parents)</th> <th>Recipient Email</th> <th>Student Name</th> <th>Quiz</th> <th></th> </tr> </thead> <tbody id="list-recipients" class="rowlink"></tbody> </table> <button class="send-email pull-left m-l-20 none btn btn-success m-t-10" type="submit"> <i class="fa fa-check"></i> Send Email </button> <p style="font-size:15px;">&nbsp;&nbsp;*The Emails will be sent to the entire class. One student is randomly picked for email preview';

      RecipientsView.prototype.itemView = Views.RecipientsItemView;

      RecipientsView.prototype.itemViewContainer = '#list-recipients';

      RecipientsView.prototype.className = 'row';

      RecipientsView.prototype.events = {
        'change #check_all_div': function() {
          return $.toggleCheckAll(this.$el.find('table'));
        },
        'change .tab_checkbox,#check_all_div ': 'showSubmitButton',
        'click .send-email': 'sendEmail'
      };

      RecipientsView.prototype.initialize = function() {
        return this.dialogOptions = {
          modal_title: 'Confirm Recipients'
        };
      };

      RecipientsView.prototype.onShow = function() {
        return this.$el.find('#check_all_div').trigger('click');
      };

      RecipientsView.prototype.showSubmitButton = function() {
        if (this.$el.find('.tab_checkbox').is(':checked')) {
          return this.$el.find('.send-email').show();
        } else {
          return this.$el.find('.send-email').hide();
        }
      };

      RecipientsView.prototype.sendEmail = function() {
        var additional_data, allCheckedRecipients, raw_recipients;
        this.$el.find('.communication_sent').remove();
        allCheckedRecipients = _.map($.getCheckedItems(this.$el.find('table')), function(m) {
          return parseInt(m);
        });
        raw_recipients = _.map(allCheckedRecipients, (function(_this) {
          return function(id, index) {
            return _this.collection.get(id).toJSON();
          };
        })(this));
        console.log(raw_recipients);
        if (!_.isEmpty(raw_recipients)) {
          additional_data = this.model.get('additional_data');
          additional_data.raw_recipients = raw_recipients;
          console.log(this.model);
          this.model.save();
          return this.$el.find('.send-email').after('<span class="m-l-40 text-success small communication_sent"> Your Emails have been queued successfully</span>');
        } else {
          return this.$el.find('.send-email').after('<span class="m-l-40 text-error small communication_sent"> No Recipients Selected</span>');
        }
      };

      return RecipientsView;

    })(Marionette.CompositeView);
  });
});
