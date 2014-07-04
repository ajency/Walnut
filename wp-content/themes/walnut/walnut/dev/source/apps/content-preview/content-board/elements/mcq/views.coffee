define ['app'], (App)->
    App.module "ContentPreview.ContentBoard.Element.Mcq.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class Views.McqView extends Marionette.ItemView

            className : 'mcq'



            onShow : ->
                @$el.attr 'id', 'mcq-container'

                @trigger "create:row:structure",
                    container : @$el


                @$el.closest('.preview').find('#submit-answer-button').on 'click', =>
                    @trigger "submit:answer"

            onAddOptionClasses : (answer)->
                totalOptions = @model.get 'optioncount'
                correctOption = @model.get 'correct_answer'
                wrongOption = _.difference answer, correctOption
                remainingOption = _.difference _.range(1, totalOptions + 1), correctOption, wrongOption


                _.each correctOption, (option)=>
                    @_addClass(option, 'ansRight')

                _.each wrongOption, (option)=>
                    @_addClass(option, 'ansWrong')

                _.each remainingOption, (option)=>
                    @_addClass(option, 'ansFalse')

            _addClass : (option, className)->
                @$el.find("#mcq-option-#{option}").addClass(className)


        class Views.McqOptionView extends Marionette.ItemView

            className : 'mcq-option'

            tagName : 'div'

            template : '<input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no">
            						'


            events :
                'change input:checkbox' : '_onClickOfCheckbox'
            # @trigger "text:element:blur"




            onShow : ->
                @$el.attr 'id', 'mcq-option-' + @model.get 'optionNo'


                # custom checkbox
                @$el.find('input:checkbox').screwDefaultButtons
                    image : 'url("' + SITEURL + '/wp-content/themes/walnut/images/csscheckbox-correct.png")'
                    width : 32
                    height : 26

            # @$el.parent().on "class:changed",=>
            # 	@model.set 'class', @$el.parent().attr('data-class')
            # if e.originalEvent.attrName is 'data-class'
            # 	console.log @$el.parent().attr('data-class')





            _onClickOfCheckbox : (evt)->
                if $(evt.target).prop 'checked'
                    console.log 'checked'
                    @trigger 'option:checked', @model
                else
                    console.log 'unchecked'
                    @trigger 'option:unchecked', @model


# onClickCheckbox:()->

# 	@$el.find('input:checkbox').attr 'checked',true
# 	@$el.find('input:checkbox').parent().css('background-position','0px -26px')
					

