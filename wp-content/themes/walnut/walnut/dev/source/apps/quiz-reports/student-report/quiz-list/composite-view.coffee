define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/student-report/quiz-list/item-views'], (App, RegionController)->
    App.module "StudentReportApp.QuizList.Views", (Views, App)->

        class Views.QuizListView extends Marionette.CompositeView

            template : '<div class="col-lg-12">
                            <button class="reset-quiz none btn btn-success m-b-10 m-r-10" type="submit">
                                <i class="fa fa-check"></i> Reset Quiz
                            </button>
                            <table class="table table-bordered m-t-15" id="quiz-table" >                                
                                <thead>
                                    <tr>
                                        {{#allowResetQuiz}}
                                        <th style="width:4%">
                                            <div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;">
                                                <input id="check_all" type="checkbox">
                                                <label for="check_all"></label>
                                            </div>
                                        </th>
                                        {{/allowResetQuiz}}
                                        <th>Quiz Name</th>
                                        <th>Textbook</th>
                                        <th>Chapter</th>
                                        <th>Time Taken</th>
                                        <th>Type</th>
                                        <th>Last Marks Obtained</th>
                                        <th>Attempt</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="list-students" class="rowlink"></tbody>
                            </table>

                            <div id="pager" class="pager">
                                <i class="cursor fa fa-chevron-left prev"></i>
                                <span style="padding:0 15px"  class="pagedisplay"></span>
                                <i class="cursor fa fa-chevron-right next"></i>
                                <select class="pagesize">
                                    <option selected value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <button class="reset-quiz none btn btn-success pull-left m-t-10 m-r-10" type="submit">
                                <i class="fa fa-check"></i> Reset Quiz
                            </button>
                        </div>'

            className: 'row'

            itemView: Views.ListItemView

            emptyView: Views.EmptyView

            itemViewContainer: '#list-students'

            itemViewOptions:(model, index)->
                quizResponseSummaries = Marionette.getOption @,'quizResponseSummaries'
                summaries = quizResponseSummaries.where 'collection_id' : model.id
                textbookNames =  Marionette.getOption @,'textbookNames'

                data=
                    summaries       : summaries
                    textbookNames   : textbookNames
                    allowResetQuiz  : Marionette.getOption @, 'allowResetQuiz'

            mixinTemplateHelpers:(data)->

                data.allowResetQuiz = true if Marionette.getOption @, 'allowResetQuiz'

                data


            events:
                'change #check_all_div'                 : 'checkAll'
                'change .tab_checkbox,#check_all_div '  : 'showClearResponseButton'
                'click .reset-quiz'                     : 'clearQuizResponse'

            onShow:->
                pagerOptions =
                    container : @$el.find ".pager"
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find '#quiz-table'
                .tablesorter()
                .tablesorterPager pagerOptions

            checkAll:->

                all_ids = @collection.pluck 'id'

                classTestModules= _.chain @collection.where 'quiz_type': 'test'
                .pluck 'id'
                .value()

                excludeIDs = _.difference all_ids,classTestModules

                $.toggleCheckAll @$el.find('#quiz-table'), excludeIDs

            showClearResponseButton:->

                if @$el.find '.tab_checkbox'
                .is ':checked'
                    @$el.find '.reset-quiz'
                    .show()

                else
                    @$el.find '.reset-quiz'
                    .hide()

            clearQuizResponse:->

                quizIDs= $.getCheckedItems @$el.find '#quiz-table'

                @deleteResponse(quizID) for quizID in quizIDs if not _.isEmpty quizIDs

                @$el.find '#check_all'
                .attr 'checked', false

                @$el.find '#reset-quiz'
                .hide()


            deleteResponse:(quizID)->

                quizResponseSummaries = Marionette.getOption @,'quizResponseSummaries'

                summary= quizResponseSummaries.findWhere 'collection_id' : parseInt quizID
                summary.destroy()

                @collection.remove quizID

                @updateTableSorter()

                @showResetSuccessMsg()

            updateTableSorter:->
                @$el.find "#quiz-table"
                .trigger "update"

                @$el.find "#quiz-table"
                .trigger "updateCache"

            showResetSuccessMsg:->

                @$el.find '.reset-success-msg'
                .remove()

                @$el.find '#pager'
                .after '<div class="reset-success-msg text-success small">Quiz Reset Successful</div>'
            
