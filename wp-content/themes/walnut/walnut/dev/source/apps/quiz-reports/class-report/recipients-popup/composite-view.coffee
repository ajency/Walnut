 define ['app'
        'apps/quiz-reports/class-report/recipients-popup/item-view'
        ], (App)->

    App.module "QuizRecipientsPopup.Views", (Views, App, Backbone, Marionette, $, _)-> 

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
                                    {{#quiz_component}}
                                    <th>Quiz</th>
                                    {{/quiz_component}}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="list-recipients" class="rowlink"></tbody>
                        </table>
                        <div class="table-div">
                            <div class="table-cell-div">
                                <button class="send-email pull-left m-l-15 none btn btn-success" type="submit">
                                    <i class="fa fa-check"></i> Send Email
                                </button>
                            </div>

                            <div class="table-cell-div2">
                                <p class="email_specific m-l-40 text-default m-b-0" style="font-size:15px;">&nbsp;</p>
                            </div>
                        
                        </div>'

            itemView: Views.RecipientsItemView

            itemViewContainer: '#list-recipients'

            className: 'row'

            events:
                'change #check_all_div'                 :-> $.toggleCheckAll @$el.find 'table'
                'change .tab_checkbox,#check_all_div '  : 'showSubmitButton'
                'click .send-email'                     : 'sendEmail'

            initialize:->
                if (this.model.get('communication_type') == 'quiz_published_parent_mail')
                    @dialogOptions = 
                        modal_title : 'New Quizzes'
                else if (this.model.get('communication_type') == 'quiz_summary_parent_mail')
                    @dialogOptions = 
                        modal_title : 'Summary Report'
                else
                    @dialogOptions = 
                        modal_title : 'Confirm Recipients'
                

            onShow:->
                if ( (this.model.get('communication_type') == 'quiz_published_parent_mail') || (this.model.get('communication_type') == 'quiz_summary_parent_mail'))
                    @$el.find '.email_specific'
                    .text '*The Emails will be sent to the entire class. One student is randomly picked for email preview'
                    @$el.find '#check_all_div'
                    .trigger 'click'
                    @$el.find '#check_all'
                    .prop 'disabled', true
                    @$el.find '.checkbox'
                    .prop 'disabled', true 
                else 
                    @$el.find '#check_all_div'
                    .trigger 'click'


            mixinTemplateHelpers:(data)->
                data=super data
                data.quiz_component = true if (this.model.get('communication_type') == 'quiz_completed_parent_mail')
                #data

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
                additional_data = @model.get 'additional_data'
                start_date = additional_data['start_date']
                end_date = additional_data['end_date']
                quiz_ids = additional_data['quiz_ids']
                div_id = additional_data['division']
                @$el.find '.communication_sent'
                .remove()

                allCheckedRecipients = _.map $.getCheckedItems(@$el.find('table')), (m)-> parseInt m

                raw_recipients = _.map allCheckedRecipients, (id,index)=> @collection.get(id).toJSON()
                if div_id == null
                    div_id = raw_recipients[0]['student_division']

                if ( (this.model.get('communication_type') == 'quiz_published_parent_mail') || (this.model.get('communication_type') == 'quiz_summary_parent_mail'))
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
                    url     = AJAXURL + '?action=get-communication-recipients'
                    #data    = @.toJSON()

                    defer = $.Deferred()

                    ###$.post url, 
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
                                allCheckedRecipients = _.map $.getCheckedItems(@$el.find('table')), (m)-> parseInt m

                                raw_recipients = _.map allCheckedRecipients, (id,index)=> @collection.get(id).toJSON()
                                additional_data = @model.get 'additional_data'
                                additional_data.raw_recipients = raw_recipients
                                div_id = additional_data.division
                                comm = @model.get 'communication_id'
                                additional_data.raw_recipients = response
                                #@model.save()
                                if ((this.model.get('communication_type') == 'quiz_published_parent_mail') || (this.model.get('communication_type') == 'quiz_summary_parent_mail'))
                                    data=
                                        component           : 'quiz'
                                        communication_type  : this.model.get('communication_type')
                                        communication_mode  : 'email'
                                        priority            : 0
                                        recipients          : []
                                        additional_data:
                                            start_date : start_date
                                            end_date : end_date
                                            quiz_ids        : quiz_ids
                                            division        : div_id
                                            raw_recipients  : response
                                        
                                    console.log data
                                    url = AJAXURL + '?action=create-communications'
                                    $.post url, 
                                        data, (response, status) =>
                                            console.log response
                                            #response = response
                                            defer.resolve response
                                        'json'
                                    defer.promise()
                                @$el.find '.table-cell-div2'
                                .append '<p class="m-l-40 text-success small communication_sent m-b-0">
                                                        &nbsp;Your Emails have been queued successfully</p>'

                    });


                if ( (this.model.get('communication_type') != 'quiz_summary_parent_mail') && (this.model.get('communication_type') != 'quiz_published_parent_mail'))
                    if not _.isEmpty raw_recipients
                        #console.log dataResponse.responseJSON
                        #raw_recipients = response.responseJSON
                        #console.log raw_recipients
                        additional_data= @model.get 'additional_data'
                        additional_data.raw_recipients = raw_recipients
                        @model.save()
                    

                        @$el.find '.table-cell-div2'
                        .append '<p class="m-l-40 text-success small communication_sent m-b-0">
                                &nbsp;Your Emails have been queued successfully</p>'

                    else
                        @$el.find '.table-cell-div2'
                        .append '<p class="m-l-40 text-error small communication_sent">
                                &nbsp;No Recipients Selected</p>'
                #@model.save()