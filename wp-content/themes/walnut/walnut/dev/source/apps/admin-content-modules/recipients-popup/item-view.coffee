 define ['app'
        'bootbox'
        'apps/admin-content-modules/recipients-popup/item-view'
        ], (App,bootbox)->

    App.module "ModulesEmailRecipientsPopup.Views", (Views)-> 

    	class Views.RecipientsItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template: ' <td class="v-align-middle"><div class="checkbox check-default">
                            <input class="tab_checkbox" type="checkbox" value="{{id}}">
                            <label for="checkbox{{id}}"></label>
                          </div>
                        </td>
                        <td>Name: {{parent_name}}<br>Email: {{parent_email}}</td>
                        <td>Name: {{student_name}}<br>Email: {{student_email}}</td>
                        <td>{{module_name}}</td>
                        <td><button class="btn btn-info pull-left email-preview">
                            <i class="progress-spinner fa fa-spinner fa-spin none"></i>
                            Preview</button>
                        </td>'

            events:
                'click .email-preview'    :(e)-> 
                    $(e.target).find('i').removeClass 'none'
                    @trigger "preview:email", @model.id

            onShowPreview:(preview_data)->
                @$el.find('.email-preview i').addClass 'none'
                w=window.open("", "Test", "width=650,height=800,scrollbars=1,resizable=1"); 
                w.document.writeln(preview_data);