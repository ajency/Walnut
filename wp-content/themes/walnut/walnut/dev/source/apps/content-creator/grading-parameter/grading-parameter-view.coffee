define ['app'],(App)->
    App.module 'ContentCreator.GradingParameter.Views',(Views,App)->

        class GradingParamsItemView extends Marionette.ItemView
            className : 'singleParam'

            template : '<div class="row m-b-10">
                            <div class="col-sm-4">
                                <textarea style="overflow:hidden" id="parameter" placeholder="Parameter name" class="w100">{{parameter}}</textarea>
                            </div><div class="saved" style="color: dodgerblue;display: none">Updated</div><div class="changed" style="color: #ff0000;
                            display: none">Changed</div>
                        </div>
                        <div class="row p-b-15">
                            {{#attributes}}
                            <div class="col-sm-3">
                                <textarea style="overflow:hidden" placeholder="Attribute" class="w100 attribute">{{.}}</textarea>
                            </div>
                            {{/attributes}}
                        </div>
                        <div class="row b-grey b-b p-b-15 m-b-15">
                            <div class="col-sm-12">
                                <button id="btn-delete" class="btn btn-default btn-sm btn-small pull-right">Delete</button>
                                <button id="btn-save" class="btn btn-success btn-sm btn-small pull-right m-r-10">Save</button>
                            </div>
                        </div>'

            mixinTemplateHelpers:(data)->
                data = super data
                data.attributes.push '' while data.attributes.length < 4
                data

            events :
                'click #btn-save'   : '_saveGradingParameter'
                'click #btn-delete' : '_deleteGradingParameter'
                'change textarea'   : '_inputChanged'
                'keyup textarea'    : 'autoGrowTextArea'

            onShow:->
                _.each @$el.find('textarea'), (ele,index)=>
                    $(ele).css 'height' : $(ele).prop('scrollHeight') + "px";

            autoGrowTextArea:(e)->

                ele=e.target

                if $(ele).prop('clientHeight') < $(ele).prop('scrollHeight')
                    $(ele).css 'height' : $(ele).prop('scrollHeight') + "px";

                if $(ele).prop('clientHeight') < $(ele).prop('scrollHeight')
                    $(ele).css 'height' : ($(ele).prop('scrollHeight') * 2 - $(ele).prop('clientHeight')) + "px"

            _saveGradingParameter : ->
                if @$el.find('textarea#parameter').val() is ''
                    return

                attributes = new Array()

                _.each @$el.find('textarea.attribute') ,(attributeInput)->
                    if $(attributeInput).val() isnt ''
                        attributes.push $(attributeInput).val()
                if not attributes.length
                    return
                @model.set 'parameter',@$el.find('textarea#parameter').val()
                @model.set 'attributes',attributes
                @trigger 'save:grading:parameter'
                @$el.find('.saved').show()
                @$el.find('.changed').hide()

            _deleteGradingParameter : ->
                @trigger 'delete:grading:parameter'

            _inputChanged : ->
                @$el.find('.saved').hide()
                @$el.find('.changed').show()





        class Views.GradingParamsView extends Marionette.CompositeView

            className : 'createParameters'

            template : '<h4 class="semi-bold">Grading Parameters</h4>
                            <div id="grading-params-table">
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <button id="add-parameter" class="btn btn-info btn-block btn-small h-center block addParam">Add Parameter</button>
                                </div>
                            </div>'

            itemViewContainer : '#grading-params-table'

            itemView : GradingParamsItemView

            events :
                'click button#add-parameter' : '_addParameter'

            _addParameter : ->
                @trigger 'add:new:grading:parameter'