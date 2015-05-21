 define ['app'
        'apps/admin-content-modules/recipients-popup/item-view'
        ], (App)->

    App.module "ModulesEmailRecipientsPopup.Views", (Views)-> 

        class Views.RecipientsView extends Marionette.CompositeView

            template: '<table class="table table-bordered tiles white">                                
                            <thead>
                                <tr>
                                    <th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;">
                                        <input id="check_all" type="checkbox">
                                        <label for="check_all"></label>
                                    </div></th>
                                    <th>Parent</th>
                                    <th>Student</th>
                                    <th>Module Name</th>
                                    <th>Preview</th>
                                </tr>
                            </thead>
                            <tbody id="list-recipients" class="rowlink"></tbody>
                        </table>
                        <button class="send-email pull-left m-l-20 none btn btn-success m-t-10" type="submit">
                            <i class="fa fa-check"></i> Send Email
                        </button>'

            itemView: Views.RecipientsItemView

            itemViewContainer: '#list-recipients'

            className: 'row'

            events:
                'change #check_all_div'                 :-> $.toggleCheckAll @$el.find 'table'
                'change .tab_checkbox,#check_all_div '  : 'showSubmitButton'
                'click .send-email'                     : 'sendEmail'

            initialize:->
                @dialogOptions = 
                    modal_title : 'Confirm Recipients'

            onShow:->
                @$el.find '#check_all_div'
                .trigger 'click'

            showSubmitButton:->
                if @$el.find '.tab_checkbox'
                .is ':checked'
                    @$el.find '.send-email'
                    .show()

                else
                    @$el.find '.send-email'
                    .hide()

            sendEmail:->

                @$el.find '.communication_sent'
                .remove()

                allCheckedRecipients= _.map $.getCheckedItems(@$el.find('table')), (m)-> parseInt m
                raw_recipients = _.map allCheckedRecipients, (id,index)=> @collection.get(id).toJSON()

                if not _.isEmpty raw_recipients
                    additional_data= @model.get 'additional_data'
                    additional_data.raw_recipients = raw_recipients

                    @model.save()

                    data= communication_type  : 'taught_in_class_student_mail'

                    @model.save data,
                        'success':=>
                            @$el.find '.send-email'
                            .after '<span class="m-l-40 text-success small communication_sent">
                                    Your Emails have been queued successfully</span>'

                            @model.set 'communication_type'  : 'taught_in_class_parent_mail'
                                
                        'error':=>
                            @$el.find '.send-email'
                            .after '<span class="m-l-40 text-error small communication_sent">
                                    Error sending mail</span>'                    

                else
                    @$el.find '.send-email'
                    .after '<span class="m-l-40 text-error small communication_sent">
                            No Recipients Selected</span>'