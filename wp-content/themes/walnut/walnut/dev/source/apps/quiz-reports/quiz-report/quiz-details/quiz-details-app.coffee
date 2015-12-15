define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "QuizReportApp.QuizDetails", (QuizDetails, App)->
        class QuizDetails.Controller extends RegionController

            initialize : (opts)->

                {@model,@textbookNames,@divisionModel}= opts

                @view = view = @_getQuizDescriptionView()

                @show view

            _getQuizDescriptionView : ->

                terms = @model.get 'term_ids'

                new QuizDetailsView
                    model           : @model
                    divisionModel   : @divisionModel
                    textbookNames   : @textbookNames


        class QuizDetailsView extends Marionette.ItemView

            template : '<div class="row m-b-10 p-t-10 b-grey b-t">
                            <div class="col-md-3">
                                Quiz Name: {{name}}
                            </div>
                            <div class="col-md-3">
                                Division: {{division}}
                            </div>
                            <div class="col-md-3">
                                Duration: {{duration}} min
                            </div>
                            <div class="col-md-3">
                                Total Marks: {{marks}}
                            </div>
                        </div>
                        <div class="row m-b-10 p-b-10 b-grey b-b">
                            <div class="col-md-3">
                                Textbook: {{textbookName}}
                            </div>
                            <div class="col-md-3">
                                Chapter: {{chapterName}}
                            </div>
                            <div class="col-md-3">
                                Section: {{sectionNames}}
                            </div>
                            <div class="col-md-3">
                                Subsection: {{subSectionNames}}
                            </div>
                        </div>'

            className: 'small'

            mixinTemplateHelpers:(data)->

                textbookNames = Marionette.getOption @, 'textbookNames'
                divisionModel = Marionette.getOption @, 'divisionModel'

                terms= data.term_ids

                data.textbookName       = textbookNames.getTextbookName terms
                data.chapterName        = textbookNames.getChapterName terms
                data.sectionNames       = textbookNames.getSectionsNames terms
                data.subSectionNames    = textbookNames.getSubSectionsNames terms
                data.division           = divisionModel.get 'division' 

                data

