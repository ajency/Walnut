var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/quiz-reports/class-report/recipients-popup/item-view'], function(App) {
  return App.module("QuizRecipientsPopup.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.RecipientsView = (function(superClass) {
      extend(RecipientsView, superClass);

      function RecipientsView() {
        return RecipientsView.__super__.constructor.apply(this, arguments);
      }

      RecipientsView.prototype.template = '<table class="table table-bordered tiles white"> <thead> <tr> <th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div></th> <th>Recipient Name (Parents)</th> <th>Recipient Email</th> <th>Student Name</th> {{#quiz_component}} <th>Quiz</th> {{/quiz_component}} <th></th> </tr> </thead> <tbody id="list-recipients" class="rowlink"></tbody> </table> <div class="table-div"> <div class="table-cell-div"> <button class="send-email pull-left m-l-15 none btn btn-success" type="submit"> <i class="fa fa-check"></i> Send Email </button> </div> <div class="table-cell-div2"> <p class="email_specific m-l-40 text-default m-b-0" style="font-size:15px;">&nbsp;</p> </div> </div>';

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
        if (this.model.get('communication_type') === 'quiz_published_parent_mail') {
          this.dialogOptions = {
            modal_title: 'New Quizzes'
          };
          return localStorage.setItem('quiz_component', '');
        } else if (this.model.get('communication_type') === 'quiz_summary_parent_mail') {
          this.dialogOptions = {
            modal_title: 'Summary Report'
          };
          return localStorage.setItem('quiz_component', '');
        } else {
          localStorage.setItem('quiz_component', 'true');
          return this.dialogOptions = {
            modal_title: 'Confirm Recipients'
          };
        }
      };

      RecipientsView.prototype.onShow = function() {
        if ((this.model.get('communication_type') === 'quiz_published_parent_mail') || (this.model.get('communication_type') === 'quiz_summary_parent_mail')) {
          this.$el.find('.email_specific').text('*The Emails will be sent to the entire class. One student is randomly picked for email preview');
          this.$el.find('#check_all_div').trigger('click');
          this.$el.find('#check_all').prop('disabled', true);
          return this.$el.find('.checkbox').prop('disabled', true);
        } else {
          return this.$el.find('#check_all_div').trigger('click');
        }
      };

      RecipientsView.prototype.mixinTemplateHelpers = function(data) {
        console.log(this.model.get('communication_type'));
        data = RecipientsView.__super__.mixinTemplateHelpers.call(this);
        if (this.model.get('communication_type') === 'quiz_completed_parent_mail') {
          data.quiz_component = true;
        }
        console.log(data);
        return data;
      };

      RecipientsView.prototype.showSubmitButton = function() {
        if (this.$el.find('.tab_checkbox').is(':checked')) {
          return this.$el.find('.send-email').show();
        } else {
          return this.$el.find('.send-email').hide();
        }
      };

      RecipientsView.prototype.sendEmail = function() {
        var additional_data, allCheckedRecipients, data, defer, div_id, end_date, quiz_ids, raw_recipients, start_date, url;
        additional_data = this.model.get('additional_data');
        start_date = additional_data['start_date'];
        end_date = additional_data['end_date'];
        quiz_ids = additional_data['quiz_ids'];
        div_id = additional_data['division'];
        this.$el.find('.communication_sent').remove();
        allCheckedRecipients = _.map($.getCheckedItems(this.$el.find('table')), function(m) {
          return parseInt(m);
        });
        raw_recipients = _.map(allCheckedRecipients, (function(_this) {
          return function(id, index) {
            return _this.collection.get(id).toJSON();
          };
        })(this));
        if (div_id === null) {
          div_id = raw_recipients[0]['student_division'];
        }
        if ((this.model.get('communication_type') === 'quiz_published_parent_mail') || (this.model.get('communication_type') === 'quiz_summary_parent_mail')) {
          data = {
            component: 'quiz',
            communication_type: this.model.get('communication_type'),
            communication_mode: this.model.get('communication_mode'),
            priority: 0,
            recipients: [],
            additional_data: {
              quiz_ids: quiz_ids,
              division: div_id
            },
            status: "OK"
          };
          url = AJAXURL + '?action=get-communication-recipients';
          defer = $.Deferred();

          /*$.post url, 
              data, (response, status) =>
                  console.log response
                  #response = response
                  defer.resolve response
              'json'
          defer.promise()
           */
          $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            async: true,
            success: (function(_this) {
              return function(response, textStatus, jqXHR) {
                var comm;
                allCheckedRecipients = _.map($.getCheckedItems(_this.$el.find('table')), function(m) {
                  return parseInt(m);
                });
                raw_recipients = _.map(allCheckedRecipients, function(id, index) {
                  return _this.collection.get(id).toJSON();
                });
                additional_data = _this.model.get('additional_data');
                additional_data.raw_recipients = raw_recipients;
                div_id = additional_data.division;
                comm = _this.model.get('communication_id');
                additional_data.raw_recipients = response;
                if ((_this.model.get('communication_type') === 'quiz_published_parent_mail') || (_this.model.get('communication_type') === 'quiz_summary_parent_mail')) {
                  data = {
                    component: 'quiz',
                    communication_type: _this.model.get('communication_type'),
                    communication_mode: 'email',
                    priority: 0,
                    recipients: [],
                    additional_data: {
                      start_date: start_date,
                      end_date: end_date,
                      quiz_ids: quiz_ids,
                      division: div_id,
                      raw_recipients: response
                    }
                  };
                  console.log(data);
                  url = AJAXURL + '?action=create-communications';
                  $.post(url, data, function(response, status) {
                    console.log(response);
                    return defer.resolve(response);
                  }, 'json');
                  defer.promise();
                }
                return _this.$el.find('.table-cell-div2').append('<p class="m-l-40 text-success small communication_sent m-b-0"> &nbsp;Your Emails have been queued successfully</p>');
              };
            })(this)
          });
        }
        if ((this.model.get('communication_type') !== 'quiz_summary_parent_mail') && (this.model.get('communication_type') !== 'quiz_published_parent_mail')) {
          if (!_.isEmpty(raw_recipients)) {
            additional_data = this.model.get('additional_data');
            additional_data.raw_recipients = raw_recipients;
            this.model.save();
            return this.$el.find('.table-cell-div2').append('<p class="m-l-40 text-success small communication_sent m-b-0"> &nbsp;Your Emails have been queued successfully</p>');
          } else {
            return this.$el.find('.table-cell-div2').append('<p class="m-l-40 text-error small communication_sent"> &nbsp;No Recipients Selected</p>');
          }
        }
      };

      return RecipientsView;

    })(Marionette.CompositeView);
  });
});
