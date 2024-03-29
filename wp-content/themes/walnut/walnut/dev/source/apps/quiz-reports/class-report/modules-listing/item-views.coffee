define ['app','bootbox'], (App,bootbox)->
    App.module "ClassQuizReportListing.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className : 'gradeX odd'

            template : '<td class="v-align-middle"><div class="checkbox check-default">
                            <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
                            <label for="checkbox{{id}}"></label>
                          </div>
                        </td>
                        <td>{{name}}</td>
                        <td>{{&textbookName}}</td>
                        <td>{{&chapterName}}</td>
                        <td>{{duration}} mins</td>
                        <td>{{quiz_type}}</td>
                        <td>{{taken_by}}</td>
                        {{#can_schedule}}
                            <td style="padding: 0 !important; vertical-align: middle;">
                                {{#class_test}}
                                    <div class="schedule_dates none">
                                        From: 
                                            <span id="schedule-from-date">
                                                {{scheduleFrom}}
                                            </span> <br>
                                        To:  
                                            <span id="schedule-to-date">
                                                {{scheduleTo}}
                                            </span><br>
                                        <span class="schedule-quiz">change</a></span> | 
                                        <span class="clear-schedule">clear</a>
                                    </div>
                                    <button id="schedule-button" type="button" class="btn btn-white btn-small schedule-quiz">
                                        <i class="fa fa-calendar"></i> Schedule
                                    </button>
                                {{/class_test}}
                            </td>
                        {{/can_schedule}}

                        <td style="padding: 0 !important; vertical-align: middle;"><div class="report-container"><button class="btn btn-small btn-success view-report">view report</button><button class="xl-report"><i class="fa fa-download" aria-hidden="true"></i></button></div></td>'

            mixinTemplateHelpers :(data) ->
                textbooks = Marionette.getOption @, 'textbookNamesCollection'

                term_ids = data.term_ids

                data.textbookName = textbooks.getTextbookName term_ids

                data.chapterName = textbooks.getChapterName term_ids

                data.class_test = true if data.quiz_type is 'class_test'

                data.quiz_type = @model.getQuizTypeLabel()

                data.taken_by = switch data.taken_by
                    when 0 then 'None'
                    when 1 then '1 Student'
                    else
                        if parseInt(data.taken_by) is parseInt data.totalStudents then 'All' else data.taken_by + ' Students'
                
                if @model.get('quiz_type') is 'class_test' and @model.get 'schedule'

                    schedule = @model.get 'schedule'

                    #data.scheduleFrom= moment(schedule['from']).format("Do MMM YYYY")
                    #data.scheduleTo= moment(schedule['to']).format("Do MMM YYYY")
                    data.scheduleFrom = schedule['from']
                    data.scheduleTo = schedule['to']

                data.can_schedule = true if App.request 'current:user:can','schedule_quiz'

                data

            events:
                'click .view-report'    :-> @trigger 'view:quiz:report', @model.id
                'click .schedule-quiz'  :-> @trigger 'schedule:quiz', @model
                'click .clear-schedule' : 'clearSchedule'
                'click .xl-report'      : -> @trigger 'view:excel:report', @model.id

            modelEvents:
                'change:schedule'  : 'changeScheduleDates'

            onShow:->
                #console.log @model.get('quiz_type')
                if @model.get('quiz_type') is 'class_test' and @model.get 'schedule'
                    @$el.find '.schedule_dates'
                    .show()
                    @$el.find '#schedule-button'
                    .hide()
                else
                    @$el.find '.xl-report'
                    .hide()

            generateXlReport:->
                #console.log @model
                options =
                    type : 'GET'
                    url : AJAXURL+ '?action=generate-xl-report&data='+@model.id

                $.ajax(options).done (response)->
                        console.log response
                        # contentPieceModel.set 'ID' : response.ID

                        # $ ".page-title"
                        # .before '<div id="saved-successfully" style="text-align:center;" class="alert alert-success">Content Piece Saved Successfully</div>'
                        
                        # setTimeout -> 
                        #     $('#saved-successfully').remove()
                        # , 3000

                    .fail (resp)->
                            console.log 'error'


            changeScheduleDates:->

                schedule = @model.get 'schedule'
                from = schedule['from']
                to   = schedule['to']

                #fromDate= moment(from).format("Do MMM YYYY")
                #toDate= moment(to).format("Do MMM YYYY")

                if from and to

                    @$el.find '#schedule-from-date'
                    .html from

                    @$el.find '#schedule-to-date'
                    .html to

                    @$el.find '.schedule_dates'
                    .show()

                    @$el.find '#schedule-button'
                    .hide()

                else

                    @$el.find '.schedule_dates'
                    .hide()

                    @$el.find '#schedule-button'
                    .show()

            clearSchedule:->

                bootbox.confirm 'Are you sure you want to clear the scheduled date?', (result)=>
                    @trigger('clear:schedule', @model.id) if result

        class Views.EmptyView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',7

        