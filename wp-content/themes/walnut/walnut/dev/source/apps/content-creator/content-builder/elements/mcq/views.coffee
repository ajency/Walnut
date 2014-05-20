define ['app'], (App)->
  App.module "ContentCreator.ContentBuilder.Element.Mcq.Views",
  (Views, App, Backbone, Marionette, $, _)->
    class Views.McqView extends Marionette.ItemView

      className: 'mcq'


      onShow: ->
        @$el.attr 'id', 'mcq-container'

        @$el.parent().parent().off 'click', @_showProperties

        # set event handler for click of mcq and stop propogation of the event
        @$el.parent().parent().on 'click', @_showProperties

        @trigger "create:row:structure",
          container: @$el

        @$el.find('.aj-imp-drag-handle').remove()
        @$el.find('.aj-imp-delete-btn').remove()
        @$el.find('.aj-imp-settings-btn').remove()

      _showProperties: (evt)=>
        @trigger "show:this:mcq:properties"
        evt.stopPropagation()

      onPreTickAnswers: ->
        console.log @model.get('correct_answer')
        _.each @model.get('correct_answer'), _.bind @_tickToggleOption, @, true


      _tickToggleOption: (checked, optionNo)->
        @$el.find('input:checkbox[id=option-' + optionNo + ']').attr 'checked', checked
        if checked
          @$el.find('input:checkbox[id=option-' + optionNo + ']').parent().css('background-position', '0px -26px')
        else
          @$el.find('input:checkbox[id=option-' + optionNo + ']').parent().css('background-position', '0px 0px')


      onUpdateTick: ->
        correctOption = @model.get('correct_answer')
        totalOptions = @model.get 'optioncount'
        unselectedOptions = _.difference _.range(1, totalOptions + 1), correctOption

        _.each unselectedOptions, _.bind @_tickToggleOption, @, false




    class Views.McqOptionView extends Marionette.ItemView

      className: 'mcq-option'

      tagName: 'div'

      template: '<span class="optionNo">{{optionNo}}</span><input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no">

            						<p class="mcq-option-text"></p>'

      # avoid and anchor tag click events
      # listen to blur event for the text element so that we can save the new edited markup
      # to server. The element will triggger a text:element:blur event on blur and pass the
      # current markupup as argument
      events:
        'click a': (e)->
          e.preventDefault()
        'blur p': '_onBlur'
        'change input:checkbox': '_onClickOfCheckbox'


      # initialize the CKEditor for the text element on show
      # used setData instead of showing in template. this works well
      # using template to load content add the html tags in content
      # hold the editor instance as the element property so that
      # we can destroy it on close of element
      onShow: ->
        @$el.attr 'id', 'mcq-option-' + @model.get 'optionNo'
        @$el.find('p').attr('contenteditable', 'true').attr 'id', _.uniqueId 'text-'
        @editor = CKEDITOR.inline document.getElementById @$el.find('p').attr 'id'
        @editor.setData _.stripslashes @model.get 'text'

        # wait for CKEditor to be loaded
        _.delay =>
          $('#cke_' + @editor.name).on 'click', (evt)->
            evt.stopPropagation()

        , 500

        # custom checkbox
        @$el.find('input:checkbox').screwDefaultButtons
          image: 'url("../wp-content/themes/walnut/images/csscheckbox-correct.png")'
          width: 32
          height: 26

        @$el.parent().on "class:changed", =>
          @model.set 'class', parseInt @$el.parent().attr('data-class')

        # disable the sortable for mcq option column
        @$el.parent().sortable 'disable'

      _onBlur: ->
        @model.set 'text', @$el.find('p').html()

      _onClickOfCheckbox: (evt)->
        if $(evt.target).prop 'checked'
          console.log 'checked'
          @trigger 'option:checked', @model
        else
          console.log 'unchecked'
          @trigger 'option:unchecked', @model


      onClickCheckbox: ()->
        @$el.find('input:checkbox').attr 'checked', true
        @$el.find('input:checkbox').parent().css('background-position', '0px -26px')




      # destroy the Ckeditor instance to avoiid memory leaks on close of element
      # this.editor will hold the reference to the editor instance
      # Ckeditor has a destroy method to remove a editor instance
      onClose: ->
        @editor.destroy()

