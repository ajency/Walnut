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

            template : '<div class="row">
                            <div class="col-md-4">
                                Division: {{division}}
                            </div>
                            <div class="col-md-8">
                                Quiz Name: {{name}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                Total Marks: {{marks}}
                            </div>
                            <div class="col-md-2">
                                Duration: {{duration}} min
                            </div>
                            <div class="col-md-2">
                                Textbook: {{textbookName}}
                            </div>
                            <div class="col-md-2">
                                Chapter: {{chapterName}}
                            </div>
                            <div class="col-md-2">
                                Section: {{sectionNames}}
                            </div>
                            <div class="col-md-2">
                                Subsection: {{subSectionNames}}
                            </div>
                        </div>'

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

