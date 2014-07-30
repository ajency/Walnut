define ['app'
        'controllers/region-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->

                class SingleQuestion.SingleQuestionLayout extends Marionette.Layout

                    template:  '<div id="content-board" class="quizContent no-margin"></div>

                                <div class="well m-b-10 p-t-10 p-b-10 h-center quizActions"> 
                                    <button type="button" id="previous-question" class="btn btn-info pull-left"> 
                                        <i class="fa fa-backward"></i> Previous 
                                    </button> 
                                    <button type="button" id="submit-question" class="btn btn-success pull-right"> 
                                        Submit <i class="fa fa-forward"></i> 
                                    </button> 
                                    <button type="button" style="display:none" id="next-question" class="btn btn-info pull-right"> 
                                        Next <i class="fa fa-forward"></i> 
                                    </button> 
                                    <button type="button" id="skip-question" class="btn btn-default btn-sm btn-small h-center block"> 
                                        <i class="fa fa-refresh"></i> Skip 
                                    </button> 
                                    <div class="clearfix"></div>
                                </div>                                

                                <div class="tiles grey text-grey b-grey b-b m-t-30 qstnInfo">
                                    <div class="grid simple m-b-0 transparent"> 
                                        <div class="grid-title no-border"> 
                                            <p class="small-text bold inline text-grey"><span class="fa fa-question"></span> Question Info </p>
                                        </div>
                                        <div class="grid-body no-border"> 
                                            <p class="bold inline text-grey">{{&instructions}}</p>
                                        </div> 
                                        <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20"> 
                                            <p class=""></p> 
                                        </div> 
                                    </div>
                                </div>'

                    regions:
                        contentBoardRegion: '#content-board'

                    events:
                        'click #submit-question'    : 'submitQuestion'

                        'click #previous-question'  :-> @trigger "goto:previous:question"

                        'click #skip-question'      :-> @trigger "skip:question"

                        'click #next-question'      :-> @trigger "goto:next:question"


                    submitQuestion:->

                        @trigger "submit:question"

                        if @model.get 'comment_enable'
                            @trigger 'show:comment:dialog',
                                comment : @model.get 'comment'

                        @$el.find "#submit-question"
                        .hide()

                        @$el.find "#next-question"
                        .show()

                        @$el.find "#skip-question"
                        .hide()
