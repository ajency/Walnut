define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "StudentReportApp.QuizList.Views", (Views, App)->

        class Views.ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td>{{name}}</td>
                        <td>{{chapterName}}</td>
                        <td>Quiz Time: {{total_minutes}}m<br>
                            Time Taken: {{time_taken}}
                        </td>
                        <td>{{quiz_type}}
                        </td>
                        <td>Marks Scored: {{marks_scored}}<br>
                            Negative Marks: {{negative_scored}}<br>
                            Total Marks Scored: {{total_marks_scored}}
                        </td>
                        <td>Attempted: {{attempts}} <span class="view-attempts">view</span>
                        </td>
                        <td><button class="btn btn-success btn-small replay_quiz" data-summary-id={{summary_id}}>Replay</button></td>'

            mixinTemplateHelpers:(data)->

                summaries= Marionette.getOption @, 'summaries'

                textbookNames = Marionette.getOption @, 'textbookNames'

                if not _.isEmpty summaries
                    completed_summaries = _.map summaries, (m)-> m.toJSON() if m.get('status') is 'completed'
                    data.answered = true
                    data =_.extend data, _.last completed_summaries
                    data.quiz_type = if data.quiz_type is 'practice' then 'Practice' else 'Class Test'
                    data.time_taken = $.timeMinSecs data.total_time_taken
                    data.attempts = _.size summaries
                
                data.chapterName = textbookNames.getChapterName data.term_ids
                data

            events:
                'click .replay_quiz' :(e)-> 
                    summary_id = $(e.target).attr 'data-summary-id'
                    @trigger 'replay:quiz',@model.id, summary_id

                'click .view-attempts' :(e)-> @trigger "view:attempts", @model.id

        class Views.EmptyView extends Marionette.ItemView

            template: "This student hasn't taken any quizzes yet"

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',7