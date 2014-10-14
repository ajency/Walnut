define ['app'
], (App)->
    App.module "ClassQuizReportListing.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className : 'gradeX odd'

            template : '<td>{{name}}</td>
                        <td>{{&textbookName}}</td>
                        <td>{{&chapterName}}</td>
                        <td>{{duration}} mins</td>
                        <td>{{quiz_type}}</td>
                        <td>{{taken_by}}</td>
                        <td><button class="btn btn-small btn-success view-report">view report</button></td>'

            serializeData : ->
                data = super()
                @textbooks = Marionette.getOption @, 'textbooksCollection'
                @chapters = Marionette.getOption @, 'chaptersCollection'

                data.textbookName = =>
                    textbook = _.findWhere @textbooks, "id" : parseInt data.term_ids.textbook
                    textbook.name if textbook?

                data.chapterName = =>
                    if data.term_ids.chapter
                        chapter = _.chain @chapters.findWhere "id" : data.term_ids.chapter
                        .pluck 'name'
                            .compact()
                            .value()
                        chapter

                data.quiz_type = if data.quiz_type is 'practice' then 'Practice' else 'Class Test'

                data.taken_by = switch data.taken_by
                    when 0 then 'None'
                    when 1 then '1 Student'
                    else
                        if parseInt(data.taken_by) is parseInt data.totalStudents then 'All' else data.taken_by + ' Students'
                            
                data

            events:
                'click .view-report' :-> @trigger 'view:quiz:report', @model.id

        class Views.EmptyView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',6

        