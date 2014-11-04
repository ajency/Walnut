define ['app'], (App)->
    App.module 'ContentCreator.ContentBuilder.AutoSave', (AutoSave, App, Backbone, Marionette, $, _)->

        # Controller class for showing header resion
        class AutoSave.Controller extends Marionette.Controller

            # initialize the controller. Get all required entities and show the view
            initialize : (opt = {})->

                # autoSave
            autoSave : (contentPieceModel)->
                siteRegion = App.mainContentRegion.$el

                _json = @_getPageJson siteRegion

                if not _.isObject _json
                    throw new Error "invalid json..."

                #localStorage.setItem 'layout',JSON.stringify _json

                data = contentPieceModel.toJSON()
                delete data.layout
                data.action = 'save-content-piece-json'
                data.json = _json

                options =
                    type : 'POST'
                    url : AJAXURL
                    data : data

                valid_content = true

                if data.content_type is 'student_question'
                    if @_questionExists() and @_checkIfMarksEntered()
                        valid_content = true
                    else
                        valid_content = false


                if valid_content
                    $.ajax(options).done (response)->
                        contentPieceModel.set 'ID' : response.ID

                        $('#save-failure').remove()
                        $('#saved-successfully').remove()

                        $ ".page-title"
                        .before '<div id="saved-successfully" style="text-align:center;" class="alert alert-success">Content Piece Saved Successfully</div>'

                    .fail (resp)->
                            console.log 'error'

            _questionExists:->
                elements = App.mainContentRegion.$el.find('#myCanvas').find 'form input[name="element"]'

                question_exists = false

                _.each elements, (element,index)->
                    if $(element).val() in ['Fib','Mcq','Sort','Hotspot','BigAnswer']
                        question_exists = true

                if not question_exists
                    @_showNoQuestionExistsError()
                    return false

                else
                    return true

            _checkIfMarksEntered :->

                elements = App.mainContentRegion.$el.find('#myCanvas').find '.element-wrapper'
                
                _.every elements, (element)->
                    if $(element).find('form input[name="element"]').val() in ['Fib','Mcq','Sort','Hotspot','BigAnswer'] and $(element).find('form input[name="complete"]').val() is 'false'
                        $('#saved-successfully').remove()
                        $('#save-failure').remove()
                        $(".page-title").before '<div id="save-failure" style="text-align:center;"
                            class="alert alert-failure">Ensure you have set the marks and added valid answers to save the question</div>'
                        return false
                    else
                        return true

            _showNoQuestionExistsError:->

                $('#saved-successfully,#save-failure').remove()
                $(".page-title").before '<div id="save-failure" style="text-align:center;"
                    class="alert alert-failure">To save, at least 1 question element must be included in the question area</div>'
                        

            # get the json
            _getPageJson : ($site)->
                json =
                # header 	: @_getJson $site.find '#site-header-region'
                    @_getJson $site.find '#myCanvas'
                # footer 	: @_getJson $site.find '#site-footer-region'

                json

            # generate the JSON for the layout
            # loops through rows and nested columns and elements inside it
            _getJson : ($element, arr = [])->

                # find all elements inside $element container
                elements = $element.children '.element-wrapper'

                _.each elements, (element, index)=>
                    ele =
                        element : $(element).find('form input[name="element"]').val()
                        meta_id : parseInt $(element).find('form input[name="meta_id"]').val()

                    if ele.element is 'Row'
                        ele.draggable = $(element).children('form').find('input[name="draggable"]').val() is "true"
                        ele.style = $(element).children('form').find('input[name="style"]').val()
                        delete ele.meta_id
                        ele.elements = []
                        _.each $(element).children('.element-markup').children('.row').children('.column'), (column, index)=>
                            className = $(column).attr 'data-class'
                            col =
                                position : index + 1
                                element : 'Column'
                                className : className
                                elements : @_getJson $(column)

                            ele.elements.push col
                            return

                    if ele.element is 'TeacherQuestion'
                        # ele.draggable = $(element).children('form').find('input[name="draggable"]').val() is "true"
                        # ele.style = $(element).children('form').find('input[name="style"]').val()
                        delete ele.meta_id
                        ele.elements = []
                        _.each $(element).children('.element-markup').children('.teacher-question').children('.teacher-question-row'), (column, index)=>
                            col =
                                position : index + 1
                                element : 'TeacherQuestRow'
                                elements : @_getJson $(column)

                            ele.elements.push col

                    if ele.element is 'Mcq'

                        elements = $(element).find('.mcq').children('.element-wrapper').children('.element-markup').children('.row')
                        .children('.column').find('.row').find('.element-wrapper')
                        elementsArray = new Array()
                        console.log elementsArray
                        _.each elements, (element, index)->
                            optionNo = parseInt $(element).closest('.column[data-option]').attr 'data-option'
                            console.log elementsArray[optionNo - 1]
                            elementsArray[optionNo - 1] = if elementsArray[optionNo - 1]? then elementsArray[optionNo - 1] else new Array()
                            console.log elementsArray[optionNo - 1]
                            elementsArray[optionNo - 1].push
                                element : $(element).find('form input[name="element"]').val()
                                meta_id : parseInt $(element).find('form input[name="meta_id"]').val()
                        console.log JSON.stringify elementsArray
                        ele.elements = elementsArray


                    arr.push ele

                arr


        App.reqres.setHandler "autosave:question:layout", ->
            new AutoSave.Controller

