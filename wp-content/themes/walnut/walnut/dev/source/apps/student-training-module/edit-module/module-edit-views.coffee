define ['app'],(App)->
    App.module 'StudentTrainingApp.Edit.Views',(Views,App)->

        class Views.EditLayout extends Marionette.Layout

            template : '<div class="teacher-app" id="teacher-app">
                                                  <div id="collection-details-region"></div>
                                                  <div id="content-selection-region"></div>
                                                </div>
                                                <div id="content-display-region"></div>'

            className : ''

            regions :
                collectionDetailsRegion : '#collection-details-region'
                contentSelectionRegion : '#content-selection-region'
                contentDisplayRegion : '#content-display-region'


        class NotEditView extends Marionette.ItemView

            template : '<div class="teacher-app">
                                                    <div id="collection-details-region">
                                                        <div class="tiles white grid simple vertical green animated fadeIn">
                                                            <div class="grid-title no-border">
                                                                <h3>This module is not editable</h3>
                                                                <p>Current Status: {{currentStatus}}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>'

            mixinTemplateHelpers : (data)->
                status = Marionette.getOption @, 'status'
                switch status
                    when 'publish'
                        data.currentStatus = 'Published'
                    when 'archive'
                        data.currentStatus = 'Archived'
                    else
                        data.currentStatus = 'Not specified!'
                data