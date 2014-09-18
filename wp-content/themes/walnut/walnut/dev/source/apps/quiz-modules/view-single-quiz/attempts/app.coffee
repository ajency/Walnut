define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "QuizModuleApp.AttemptsController", (AttemptsController, App)->
        class AttemptsController.Controller extends RegionController

            initialize : (opts)->

                {@model,@quizResponseSummaryCollection}= opts

                @view = view = @_getAttemptsView @model,@quizResponseSummaryCollection

                @show view

                @listenTo @view, 'view:summary', (summary_id)-> @region.trigger 'view:summary', summary_id

            _getAttemptsView :(quizModel,collection) ->

                new QuizAttemptsView
                    model : quizModel
                    collection: collection

        class AttemptsItemView extends Marionette.ItemView

            template : '<div class="col-md-3">
                            <h5 class="bold">{{taken_on}}</h5>
                        </div>
                        <div class="col-md-3">
                            <h5 class="bold">{{total_marks_scored}}</h5>
                        </div>
                        <div class="col-md-3">
                            <h5 class="bold">{{time_taken}}</h5>
                        </div>
                        <div class="col-md-3">
                            <button data-id={{summary_id}} type="button" class="view-summary btn btn-info btn-small">view &nbsp; <i></i></button>
                        </div>'

            className : 'row b-t b-grey'

            mixinTemplateHelpers:(data)->
                data.taken_on       = moment(data.taken_on).format("Do MMM YYYY")
                data.time_taken     = $.timeMinSecs data.total_time_taken
                data

        class QuizAttemptsView extends Marionette.CompositeView

            template : '<div class="tiles white grid simple vertical blue">
                            <div class="grid-title no-border"> 
                                <h4 class="grid-body-toggle pointer">List of <span class="semi-bold">Attempts</span></h4> 
                                <div class="tools"> <a href="javascript:;" class="expand"></a> </div> 
                            </div>
                            <div class="none grid-body no-border contentSelect">
                                <div class="row">
                                    <div class="col-md-3">
                                        <h5 class="bold">Attempted On </h5>
                                    </div>
                                    <div class="col-md-3">
                                        <h5 class="bold">Marks Scored (out of {{marks}}) </h5>
                                    </div>
                                    <div class="col-md-3">
                                        <h5 class="bold">Time Taken (out of {{total_minutes}}m) </h5>
                                    </div>
                                </div>
                                <div id="attempts_list">
                                </div>
                            </div>
                        </div>'

            itemView : AttemptsItemView

            itemViewContainer: '#attempts_list'

            events: 
                'click .view-summary':(e)-> 
                    $(e.target).find('i').addClass 'fa fa-spinner fa-spin'
                    @trigger 'view:summary', $(e.target).attr 'data-id'


        # set handlers
        App.commands.setHandler "show:quiz:attempts:app", (opt = {})->
            new AttemptsController.Controller opt

