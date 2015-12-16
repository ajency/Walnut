define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "QuizReportApp.StudentsList.Views", (Views, App)->

        class Views.ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td>{{roll_no}}</td>
                        <td>{{display_name}}</td>
                        <td>{{#answered}}
                                Marks Scored: {{marks_scored}}<br>
                                Negative Marks: {{negative_scored}}<br>
                                Total Marks Scored: {{total_marks_scored}}
                            {{/answered}}
                            {{^answered}}N/A{{/answered}}
                        </td>
                        <td>{{#answered}}{{time_taken}}{{/answered}}
                            {{^answered}}N/A{{/answered}}
                        </td>
                        <td>{{#answered}}Attempted: {{attempts}} <span class="view-attempts fa fa-plus-circle"></span>{{/answered}}
                            {{^answered}}N/A{{/answered}}
                        </td>
                        <td>{{#answered}}
                                <button class="btn btn-success btn-small replay_quiz" data-summary-id={{summary_id}}>Replay</button>
                            {{/answered}}
                            {{#not_taken}}Not Taken{{/not_taken}}
                           {{#started}}Started{{/started}}
                        </td>'

            mixinTemplateHelpers:(data)->

               summaries= Marionette.getOption @, 'summaries'

               if not _.isEmpty summaries

                 started_summaries = _.map summaries, (m) ->
                   if m.get('status') == 'started'
                     true
                   else
                     false

                 if started_summaries[0]
                   data.started = true
                 else
                   completed_summaries = _.map summaries, (m)-> m.toJSON() if m.get('status') is 'completed'
                   data.answered = true
                   data =_.extend data, _.last completed_summaries
                   data.attempts = _.size summaries
                   data.time_taken = $.timeMinSecs data.total_time_taken
               else
                 data.not_taken = true
               data

            events:
                'click .replay_quiz' :(e)-> 
                    summary_id = $(e.target).attr 'data-summary-id'
                    @trigger 'replay:quiz',@model.id, summary_id

                'click .view-attempts' :(e)-> @trigger "view:attempts", @model.id

        class Views.EmptyView extends Marionette.ItemView

            template: 'No students registered to this class'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',6