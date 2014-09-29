define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "AttemptsPopupApp.Views", (Views, App)->

        class Views.AttemptsItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td>{{taken_on}}</td>
                        <td>Marks Scored: {{marks_scored}}<br>
                            Negative Marks: {{negative_scored}}<br>
                            Total Marks Scored: {{total_marks_scored}}</td>
                        <td>{{time_taken}}</td>
                        <td><button class="btn btn-success btn-small replay_quiz" data-dismiss="modal">Replay</button></td>'

            mixinTemplateHelpers:(data)->

                data.taken_on = moment(data.taken_on).format("Do MMM YYYY")
                data.time_taken = $.timeMinSecs data.total_time_taken
                data

            events:
                'click .replay_quiz' :(e)-> @trigger 'replay:quiz', @model.id