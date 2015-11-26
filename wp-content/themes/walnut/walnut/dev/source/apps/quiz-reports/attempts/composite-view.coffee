define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/attempts/item-views'], (App, RegionController)->
    App.module "AttemptsPopupApp.Views", (Views, App)->

        class Views.AttemptsMainView extends Marionette.CompositeView

            template : '<table class="table table-bordered tiles white" id="attempts-list-table" >                                
                            <thead>
                                <tr>
                                    <th>Attempted On</th>
                                    <th>Marks Obtained</th>
                                    <th>Time Taken</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="list-attempts" class="rowlink"></tbody>
                        </table>'

            className: 'row col-lg-12'

            itemView            : Views.AttemptsItemView

            itemViewContainer   : '#list-attempts'

            events :
                'click #confirm-yes'    :-> @trigger 'confirm:yes'
                'click #alert-ok'       :-> @trigger 'alert:ok'
                'click .comment-close'  : '_closeComment'

            initialize : (options)->

                student= Marionette.getOption @, 'student'
                student_name = student.get 'display_name'

                quiz =  Marionette.getOption @, 'quiz'
                quiz_name= quiz.get 'name'

                modal_title = "List of Attempts by #{student_name} <span class='m-l-20'>Quiz Name : #{quiz_name}</span>"
                @dialogOptions = modal_title : modal_title