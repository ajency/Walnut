define ['app'
        'text!apps/content-creator/element-box/templates/toolbox.html'], (App, Template)->
    App.module "ContentCreator.ElementBox.Views", (Views, App)->
        class Views.ElementBoxView extends Marionette.ItemView

            template: Template


            onShow: ->
                @$el.find('*[data-element]').draggable
                    connectToSortable: '.droppable-column'
                    helper: 'clone'
                    delay: 5
                    addClasses: false
                    distance: 5
                    revert: 'invalid'

                contentType = Marionette.getOption @, 'contentType'

                if contentType is 'teacher_question'
                    elementSet = ['Row', 'TeacherQuestion', 'Image', 'Text', 'ImageWithText', 'Video', 'Audio']
                else
                    elementSet = ['Row', 'Hotspot', 'Mcq', 'Fib', 'BigAnswer', 'Sort', 'Image', 'Text', 'ImageWithText',
                                  'Video', 'Audio']


                _.each @$el.find('li'), (el, ind)->
                    elementName = $(el).attr 'data-element'
                    if not _.contains elementSet, elementName
                        $(el).hide()

