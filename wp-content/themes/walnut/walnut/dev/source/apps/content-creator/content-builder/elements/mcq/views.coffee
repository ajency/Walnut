define ['app'], (App)->
    App.module "ContentCreator.ContentBuilder.Element.Mcq.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class Views.McqView extends Marionette.ItemView

            className : 'mcq'


            onShow : ->
                @$el.attr 'id', 'mcq-container'

                @$el.closest('.element-wrapper').off 'click', @_showProperties

                # set event handler for click of mcq and stop propogation of the event
                @$el.closest('.element-wrapper').on 'click', @_showProperties

                @trigger "create:row:structure",
                    container : @$el

                @$el.find('.row').closest('.element-wrapper').children('.element-controls')
                .find('.aj-imp-drag-handle, .aj-imp-delete-btn, .aj-imp-delete-btn, .aj-imp-settings-btn').remove()

                @$el.children('.element-wrapper').children('.element-markup').children('.row')
                .children('.column').sortable 'disable'

            _showProperties : (evt)=>
                @trigger "show:this:mcq:properties"
                evt.stopPropagation()

            onPreTickAnswers: ->
                console.log @model.get('correct_answer')
                _.each @model.get('correct_answer'), _.bind @_tickToggleOption, @, true


            _tickToggleOption: (checked, optionNo)->
                @$el.find('input:checkbox[id=option-' + optionNo + ']').attr 'checked', checked
#                if checked
#                    @$el.find('input:checkbox[id=option-' + optionNo + ']').parent().trigger 'click'
                if checked
                    @$el.find('input:checkbox[id=option-' + optionNo + ']').parent().css('background-position',
                      '0px -26px')
                else
                    @$el.find('input:checkbox[id=option-' + optionNo + ']').parent().css('background-position',
                      '0px 0px')

            onUpdateTick: ->
                correctOption = @model.get('correct_answer')
                totalOptions = @model.get 'optioncount'
                unselectedOptions = _.difference _.range(1, totalOptions + 1), correctOption

                _.each unselectedOptions, _.bind @_tickToggleOption, @, false



            onGetAllOptionElements : ->
                elements = @$el.children('.element-wrapper').children('.element-markup').children('.row')
                .children('.column').find('.row').find('.element-wrapper')
                elementsArray = new Array()
                console.log elementsArray
                _.each elements, (element,index)->
                    optionNo = parseInt $(element).closest('.column[data-option]').attr 'data-option'
                    console.log elementsArray[optionNo-1]
                    elementsArray[optionNo-1] = if elementsArray[optionNo-1]? then elementsArray[optionNo-1] else new Array()
                    console.log elementsArray[optionNo-1]
                    elementsArray[optionNo-1].push
                        element : $(element).find('form input[name="element"]').val()
                        meta_id : parseInt $(element).find('form input[name="meta_id"]').val()
#                console.log JSON.stringify elementsArray
                @model.set 'elements',elementsArray
                console.log JSON.stringify @model.get 'elements'
#                console.log(elements)





        class Views.McqOptionView extends Marionette.ItemView

            className : 'mcq-option'

            tagName : 'div'

            template : '<span class="optionNo">{{optionNo}}</span>
                                <input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no">'

            events :
                'change input:checkbox': '_onClickOfCheckbox'

            onShow :->
                @$el.find('input:checkbox').screwDefaultButtons
                    image: 'url("../wp-content/themes/walnut/images/csscheckbox-correct.png")'
                    width: 32
                    height: 26

                @$el.closest('.row').closest('.column').on "class:changed", =>
                    @model.set 'class', parseInt @$el.closest('.row').closest('.column').attr('data-class')
                    console.log @model.get 'class'

            _onClickOfCheckbox: (evt)->
                if $(evt.target).prop 'checked'
                    console.log 'checked'
                    @trigger 'option:checked', @model
                else
                    console.log 'unchecked'
                    @trigger 'option:unchecked', @model
