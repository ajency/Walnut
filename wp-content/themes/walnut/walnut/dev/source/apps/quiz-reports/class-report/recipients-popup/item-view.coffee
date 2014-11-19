 define ['app'
        'apps/quiz-reports/class-report/recipients-popup/item-view'
        ], (App)->

    App.module "RecipientsPopup.Views", (Views)-> 

    	class Views.RecipientsItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template: ' <td class="v-align-middle"><div class="checkbox check-default">
                            <input class="tab_checkbox" type="checkbox" value="{{id}}">
                            <label for="checkbox{{id}}"></label>
                          </div>
                        </td>
                        <td>{{parent_name}}</td>
                        <td class="col-md-6">{{parent_email}}</td>
                        <td>{{student_name}}</td>
                        <td>{{quiz_name}}</td>'

            events:
                'click .btn-success'    : 'saveScheduled'