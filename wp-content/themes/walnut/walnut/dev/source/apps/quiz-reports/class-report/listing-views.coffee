define ['app'
        'text!apps/quiz-reports/class-report/templates/outer-template.html'
], (App, contentListTpl)->
    App.module "ClassQuizReportListing.Views", (Views, App, Backbone, Marionette, $, _)->
        class ListItemView extends Marionette.ItemView

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

        class EmptyView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',6

        class Views.ModulesListingView extends Marionette.CompositeView

            template : contentListTpl

            className : 'row'

            itemView : ListItemView

            emptyView : EmptyView

            itemViewContainer : '#list-content-pieces'

            itemViewOptions : ->
                textbooksCollection : @textbooks
                chaptersCollection  : Marionette.getOption @, 'chaptersCollection'

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                @textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')

            onShow : ->
                @$el.find '#content-pieces-table'
                .tablesorter();

                @onUpdatePager()

            onUpdatePager:->

                @$el.find "#content-pieces-table"
                .trigger "updateCache"
                pagerOptions =
                    container : @$el.find ".pager"
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find "#content-pieces-table"
                .tablesorterPager pagerOptions