 define ['app'
        'apps/quiz-reports/class-report/recipients-popup/item-view'
        ], (App)->

    App.module "QuizRecipientsPopup.Views", (Views)-> 

        class Views.RecipientsView extends Marionette.CompositeView

            template: '<table class="table table-bordered tiles white">                                
                            <thead>
                                <tr>
                                    <th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;">
                                        <input id="check_all" type="checkbox">
                                        <label for="check_all"></label>
                                    </div></th>
                                    <th>Recipient Name (Parents)</th>
                                    <th>Recipient Email</th>
                                    <th>Student Name</th>
                                    <th>Quiz</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="list-recipients" class="rowlink"></tbody>
                        </table>
                        <button class="send-email pull-left m-l-20 none btn btn-success m-t-10" type="submit">
                            <i class="fa fa-check"></i> Send Email
                        </button>
                        <p class="email_specific m-l-40 text-default" style="font-size:15px;">&nbsp;</p>'

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
                if ( (this.model.get('communication_type') == 'quiz_published_parent_mail') || (this.model.get('communication_type') == 'quiz_summary_parent_mail'))
                    @$el.find '.email_specific'
                    .text '*The Emails will be sent to the entire class. One student is randomly picked for email preview'
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

                console.log @model
                console.log @model.get 'additional_data'
                additional_data = @model.get 'additional_data'
                quiz_ids = additional_data['quiz_ids']
                div_id = additional_data['division']
                @$el.find '.communication_sent'
                .remove()

                allCheckedRecipients = _.map $.getCheckedItems(@$el.find('table')), (m)-> parseInt m

                raw_recipients = _.map allCheckedRecipients, (id,index)=> @collection.get(id).toJSON()
                console.log raw_recipients
                if div_id == null
                    div_id = raw_recipients.student_division
                    console.log div_id

                if ( (this.model.get('communication_type') == 'quiz_published_parent_mail') || (this.model.get('communication_type') == 'quiz_summary_parent_mail'))
                    allCheckedRecipients = _.map $.getCheckedItems(@$el.find('table')), (m)-> parseInt m

                    raw_recipients = _.map allCheckedRecipients, (id,index)=> @collection.get(id).toJSON()
                    data=
                        component           : 'quiz'
                        communication_type  : @model.get 'communication_type'
                        communication_mode  : @model.get 'communication_mode'
                        priority            : 0
                        recipients          : []
                        additional_data:
                            quiz_ids        : quiz_ids
                            division        : div_id
                        status              :"OK"
                    console.log data
                    url     = AJAXURL + '?action=get-communication-recipients'
                    #data    = @.toJSON()

                    defer = $.Deferred()

                    ###dataResponse =  $.post url, 
                                        data, (response, status) =>
                                            console.log response
                                            #response = response
                                            defer.resolve response
                                        'json'
                                    defer.promise()###

                    $.ajax({
                        type : 'POST',
                        url : url,
                        data : data,
                        dataType: 'json',
                        async: true,
                        success :(response, textStatus, jqXHR)=>
                                                    console.log textStatus
                                                    console.log jqXHR
                                                    #@model.attributes.communication_id = '25'
                                                    #@model.attributes.status = 'OK'
                                                    allCheckedRecipients = _.map $.getCheckedItems(@$el.find('table')), (m)-> parseInt m

                                                    raw_recipients = _.map allCheckedRecipients, (id,index)=> @collection.get(id).toJSON()
                                                    console.log response
                                                    additional_data= @model.get 'additional_data'
                                                    # console.log additional_data
                                                    additional_data.raw_recipients = raw_recipients
                                                    console.log @model
                                                    comm = @model.get 'communication_id'
                                                    additional_data.raw_recipients = response
                                                    console.log @model
                                                    @model.save()
                                                    @$el.find '.send-email'
                                                    .after '<p class="m-l-40 text-success small communication_sent">
                                                        &nbsp;Your Emails have been queued successfully</p>'

                    });


                if ( (this.model.get('communication_type') != 'quiz_summary_parent_mail'))
                    if not _.isEmpty raw_recipients
                        #console.log dataResponse.responseJSON
                        #raw_recipients = response.responseJSON
                        #console.log raw_recipients
                        additional_data= @model.get 'additional_data'
                        console.log additional_data
                        console.log raw_recipients
                        additional_data.raw_recipients = raw_recipients
                        console.log @model
                        @model.save()
                        console.log @model
                    

                        @$el.find '.send-email'
                        .after '<p class="m-l-40 text-success small communication_sent">
                                &nbsp;Your Emails have been queued successfully</p>'

                    else
                        @$el.find '.send-email'
                        .after '<p class="m-l-40 text-error small communication_sent">
                                &nbsp;No Recipients Selected</p>'
                #@model.save()
