define ['app'], (App)->
    App.module "SingleQuestionMultipleEvaluationApp.EvaluationApp.Views", (Views, App)->
        class EvaluationItemView extends Marionette.ItemView

            className : 'row m-l-0 m-r-0 m-t-10 b-grey b-b'

            template : '<div class="col-sm-4"><h4 class="semi-bold m-t-5 p-b-5">{{param}}</h4></div>
                                                    {{#attr}}
                                                       <div class="col-sm-2"><button id="{{.}}" type="button" class="btn btn-white btn-sm btn-small h-center block">{{.}}</button></div>
                                                    {{/attr}}'

            events :
                'click button' : '_buttonClicked'

            initialize : (options)->
                @responseObj = options.responseObj

            onShow : ->
                if @responseObj[@model.get('param')]?
                    @$el.find("##{@responseObj[@model.get('param')]}").removeClass('btn-white').addClass('btn-primary')

            _buttonClicked : (e)->
                if $(e.target).closest('button').hasClass('btn-primary')
                    return
                else
                    @$el.find('button.btn-primary').removeClass('btn-primary').addClass('btn-white')
                    $(e.target).closest('button').removeClass('btn-white').addClass('btn-primary')
                    @responseObj[@model.get('param')] = $(e.target).attr('id')
                    console.log @responseObj


        class Views.EvaluationView extends Marionette.CompositeView

            className : 'parameters animated fadeIn'

            template : '<div class="tiles grey p-t-10 p-b-10 m-b-10">
                                                    <div class="row m-l-0 m-r-0">
                                                        <div class="pull-right">
                                                            <span id="close-parameters" class="fa fa-times text-grey p-r-15 p-l-15 p-t-15
                                                             p-b-15 closeEval"></span>
                                                        </div>
                                                        <h3 class="text-center text-grey semi-bold">Evaluation for {{studentName}}</h3>
                                                    </div>
                                                    <div id="evaluation-collection">
                                                    </div>
                                                    <div class="row m-r-0 m-l-0 p-t-10">
                                                        <button class="btn btn-info h-center block" id="saveEval">Save</button>
                                                    </div>
                                                </div>'

            itemView : EvaluationItemView

            itemViewContainer : '#evaluation-collection'

            itemViewOptions : ->
                responseObj : @responseObj

            mixinTemplateHelpers : (data)->
                data = super data
                data.studentName = @studentModel.get 'display_name'
                data

            events :
                'click #saveEval' : '_saveEvalParameters'

            initialize : (options)->
                @studentModel = Marionette.getOption @, 'studentModel'
                @responseObj = Marionette.getOption @, 'responseObj'

            _saveEvalParameters : ->
                @trigger "save:eval:parameters"




