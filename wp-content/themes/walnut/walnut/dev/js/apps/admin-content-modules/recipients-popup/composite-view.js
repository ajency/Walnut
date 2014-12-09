var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/admin-content-modules/recipients-popup/item-view'], function(App) {
  return App.module("ModulesEmailRecipientsPopup.Views", function(Views) {
    return Views.RecipientsView = (function(_super) {
      __extends(RecipientsView, _super);

      function RecipientsView() {
        return RecipientsView.__super__.constructor.apply(this, arguments);
      }

      RecipientsView.prototype.template = '<table class="table table-bordered tiles white"> <thead> <tr> <th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div></th> <th>Parent</th> <th>Student</th> <th>Module Name</th> <th>Preview</th> </tr> </thead> <tbody id="list-recipients" class="rowlink"></tbody> </table> <button class="send-email pull-left m-l-20 none btn btn-success m-t-10" type="submit"> <i class="fa fa-check"></i> Send Email </button>';

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
        var additional_data, allCheckedRecipients, data, raw_recipients;
        this.$el.find('.communication_sent').remove();
        allCheckedRecipients = _.map($.getCheckedItems(this.$el.find('table')), function(m) {
          return parseInt(m);
        });
        raw_recipients = _.map(allCheckedRecipients, (function(_this) {
          return function(id, index) {
            return _this.collection.get(id).toJSON();
          };
        })(this));
        if (!_.isEmpty(raw_recipients)) {
          additional_data = this.model.get('additional_data');
          additional_data.raw_recipients = raw_recipients;
          this.model.save();
          data = {
            communication_type: 'taught_in_class_student_mail'
          };
          return this.model.save(data, {
            'success': (function(_this) {
              return function() {
                _this.$el.find('.send-email').after('<span class="m-l-40 text-success small communication_sent"> Your Emails have been queued successfully</span>');
                return _this.model.set({
                  'communication_type': 'taught_in_class_parent_mail'
                });
              };
            })(this),
            'error': (function(_this) {
              return function() {
                return _this.$el.find('.send-email').after('<span class="m-l-40 text-error small communication_sent"> Error sending mail</span>');
              };
            })(this)
          });
        } else {
          return this.$el.find('.send-email').after('<span class="m-l-40 text-error small communication_sent"> No Recipients Selected</span>');
        }
      };

      return RecipientsView;

    })(Marionette.CompositeView);
  });
});
