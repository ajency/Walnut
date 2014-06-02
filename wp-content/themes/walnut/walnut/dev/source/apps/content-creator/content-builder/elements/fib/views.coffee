define ['app'], (App)->
    App.module "ContentCreator.ContentBuilder.Element.Fib.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class Views.FibView extends Marionette.ItemView

            className: 'fib-text'

            # listen to the model events
            modelEvents:
                'change:font': (model, font)->
                    @_changeFont font
                'change:font_size': (model, fontSize)->
                    @_changeFontSize fontSize
                'change:color': (model, color)->
                    @_changeColor color
                'change:bg_color': (model, bg_color)->
                    @_changeBGColor model
                'change:bg_opacity': (model, bg_opacity)->
                    @_changeBGColor model
                'change:style': (model, style)->
                    @_changeFibStyle style
                'change:numberOfBlanks': '_changeNumberOfBlanks'

            # avoid and anchor tag click events
            # listen to blur event for the text element so that we can save the new edited markup
            # to server. The element will triggger a text:element:blur event on blur and pass the
            # current markupup as argument
            events:
                'click a': (e)->
                    e.preventDefault()
                'blur .fib-text': 'onSaveText'


            onShow: ->

                # setting of on click handler for showing of the property box for fib element
                @$el.parent().parent().on 'click', (evt)=>
                    @trigger "show:this:fib:properties"
                    @trigger "close:question:element:properties"
                    # stop propogation of click event
                    evt.stopPropagation()

                # initialize ckeditor
                @$el.attr('contenteditable', 'true').attr 'id', _.uniqueId 'text-'
                @editor = CKEDITOR.inline document.getElementById @$el.attr 'id'
                @editor.setData _.stripslashes @model.get 'text'

                # wait for CKEditor to be loaded
                _.delay @_afterCKEditorInitialization, 500

            # after initialization of ckeditor
            # add a p tag at the end to fix align issues
            #there are no blanks then add a new blank
            # otherwise format the existing blanks in proper format
            _afterCKEditorInitialization:=>
                $("#cke_#{@editor.name}").on 'click', (evt)->
                    evt.stopPropagation()

                @$el.append('<p class=\"hidden-align-fix\" contenteditable=\"false\"
                                                style=\"display:none;\"></p>')

                if not parseInt @model.get 'numberOfBlanks'
                    @model.set 'numberOfBlanks', 1

                else
                    @$el.find('input').wrap('<span contenteditable="false"></span>')
                    @$el.find('input').before('<span class="fibno"></span>')
                    @$el.find("input").on 'click', @_onClickOfBlank
                    @model.get('blanksArray').each @_initializeEachBlank

                # enable the event to check if a blank was
                # added or removed
                console.log "now checking dom tree"
                @$el.on 'DOMSubtreeModified', @_updateInputProperties
                @_updateInputProperties()

            # do an initialization for a blank
            # set the handler for change answer and change size
            _initializeEachBlank:(blanksModel)=>
                @_changeBlankSize blanksModel,blanksModel.get 'blank_size'
                @_changeCorrectAnswers blanksModel,blanksModel.get 'correct_answers'
                @listenTo blanksModel, 'change:correct_answers', @_changeCorrectAnswers
                @listenTo blanksModel, 'change:blank_size', @_changeBlankSize

            #on change of the number of blanks from the dropdown
            _changeNumberOfBlanks: (model, numberOfBlanks)->
                if @$el.find('input').length isnt numberOfBlanks

                    if numberOfBlanks > model.previous 'numberOfBlanks'
                        noOfBlanksToAdd = numberOfBlanks - model.previous 'numberOfBlanks'
                        @_addBlanks noOfBlanksToAdd
                        console.log noOfBlanksToAdd
                    else if numberOfBlanks < model.previous 'numberOfBlanks'
                        noOfBlanksToRemove = model.previous('numberOfBlanks') - numberOfBlanks
                        console.log noOfBlanksToRemove
                        @_removeBlanks noOfBlanksToRemove

            # remove n number of blanks from the end
            _removeBlanks: (noOfBlanksToRemove)->
                until noOfBlanksToRemove is 0
                    @$el.find('input').last().parent().remove()
                    noOfBlanksToRemove--

            # add n number of blanks at the end
            _addBlanks: (noOfBlanksToAdd)->
                until noOfBlanksToAdd is 0
                    inputId = _.uniqueId 'input-'
                    inputNumber = @model.get('blanksArray').size() + 1
                    @trigger "create:new:fib:element", inputId

                    @$el.find('p').first().append "<span contenteditable='false'>
                        <span class='fibno'>#{inputNumber}</span><input type='text'
                        data-id='#{inputId}' data-cke-editable='1' style=' height :100%'
                        contenteditable='false' disabled></span>&nbsp;&nbsp;"

                    blanksModel = @model.get('blanksArray').get(inputId)

                    @_initializeEachBlank blanksModel

                    @$el.find("input").on 'click', @_onClickOfBlank

                    noOfBlanksToAdd--

            #when a blank is clicked show the propertiers for that blank
            _onClickOfBlank:(e)=>
                inputId = $(e.target).attr 'data-id'
                blanksModel = @model.get('blanksArray').get(inputId)
                App.execute "show:fib:element:properties",
                    model: blanksModel
                    fibModel: @model
                @trigger "show:this:fib:properties"
                e.stopPropagation()


            # on change of font property
            _changeFont: (font)->
                @$el.find('input').css 'font-family', font


            # on change of font_size property
            _changeFontSize: (fontSize)->
                @$el.find('input').css 'font-size', "#{fontSize}px"

            # on change of color property
            _changeColor: (color)->
                @$el.find('input').css 'color', color

            # on change of bg_color property
            _changeBGColor: (model)->
                @$el.find('input').css 'background-color', _.convertHex @model.get('bg_color'), @model.get('bg_opacity')

            # on change of style property
            _changeFibStyle: (style)->
                # if underline
                if style is 'uline'
                    @$el.find('input').removeClass("border").addClass "underline"
                    # if box
                else if style is 'box'
                    @$el.find('input').removeClass("underline").addClass "border"
                    # if blank
                else
                    @$el.find('input').removeClass "underline border"

            # when correct answers array changed fill the first correct answer in d blank
            _changeCorrectAnswers: (model, answerArray)->
                if answerArray.length
                    @$el.find("input[data-id=#{model.id}]").val answerArray[0]

            # on change of the blank_size attr change the blank width
            _changeBlankSize: (model, blankSize)->
                @$el.find("input[data-id=#{model.id}]").attr 'size', blankSize


            # save the text field on blur
            onSaveText: ->
                formatedText = @$el.find('p').first().clone()
                $(formatedText).find('input').attr 'value', ''
                $(formatedText).find('input').unwrap()
                $(formatedText).find('input').prev().remove()
                @model.set 'text', formatedText.html()
                console.log formatedText.html()

                console.log @model

            # on modification of dom structure modification of p
            _updateInputProperties: =>
                # iterate thru all input tags in current view
                _.each @$el.find('input'), (blank, index)=>

                    _.delay =>
                        blanksModel = @model.get('blanksArray').get $(blank).attr 'data-id'
                        # console.log _.indexOf(@blanksCollection.toArray(), blanksModel)+1
                        if blanksModel isnt undefined
                            blanksModel.set 'blank_index', index + 1
                        if parseInt($(blank).prev().text()) isnt index + 1
                            $(blank).prev().text index + 1


                    , 20


                # delay for .1 sec for everything to get initialized
                # loop thru the array, if 'input not found for it remove it from the array'
                _.delay =>
                    if @model.get('blanksArray').size() > 0

                        @model.get('blanksArray').each (blank)=>
                            # console.log blank
                            blankFound = _.find @$el.find('input'), (blankUI)=>
                                blank.get('id') is $(blankUI).attr 'data-id'

                            if _.isUndefined blankFound
                                console.log ' in remove'

                                # @$el.find("span##{blank.id}").remove()
                                @model.get('blanksArray').remove blank
                                @trigger 'close:question:element:properties'
                                if @model.get('blanksArray').size() < @model.get('numberOfBlanks')
                                    @model.set 'numberOfBlanks', @model.get('numberOfBlanks') - 1
                , 500

                # add style for the blanks
                @_changeFont @model.get 'font'
                @_changeFontSize @model.get 'font_size'
                @_changeColor @model.get 'color'
                @_changeBGColor @model
                @_changeFibStyle @model.get 'style'

            # destroy the Ckeditor instance to avoiid memory leaks on close of element
            # this.editor will hold the reference to the editor instance
            # Ckeditor has a destroy method to remove a editor instance
            onClose: ->
                @editor.destroy()