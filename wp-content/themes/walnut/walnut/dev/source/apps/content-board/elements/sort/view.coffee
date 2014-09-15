define ['app'], (App)->
    App.module "ContentPreview.ContentBoard.Element.Sort.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class OptionView extends Marionette.ItemView
            className : 'sort-option'

            template : '<input type="hidden" id="optionNo" value="{{optionNo}}">
                        							<p class="sort-option-text"></p>'






            onShow : ->
                @$el.find('p').html _.stripslashes @model.get 'text'


        class Views.SortView extends Marionette.CompositeView


            template : '<div class="sort"></div>
                        <div class="alert alert-success text-center fibRightAns" style="display: none;">
                            <div class="btn-group">
                                <input type="button" class="btn btn-default btn-primary" value=" My Answer" data-sort-value="myAnswer">
                                <input type="button" class="btn btn-default " value=" Correct Answer" data-sort-value="correctAnswer">
                            </div>
                        </div>'

#            <div class="btn-group " data-toggle="buttons" id="toggleView">
#            <label class="btn btn-default">
#            #                                    <input type="radio" name="sort" id="myAnswer" data-sort-value="myAnswer"> My Answer
#            </label>
#                                <label class="btn btn-primary">
#                                    <input type="radio" name="sort" id="rightAnswer" data-sort-value="correctAnswer"> Correct Answer
#                                </label>
#            </div>

            itemView : OptionView

            itemViewContainer : 'div.sort'

            initialize : (options)->
                @sort_model = options.sort_model

            onShow : ->

                # change the bg color on initial show
                @_changeBGColor()


                # enable sorting
                @_enableSorting()

                @_changeHeight @sort_model, @sort_model.get 'height'

                displayAnswer = true

                if Marionette.getOption(@, 'displayAnswer') is false
                    displayAnswer = false

                @$el.closest('.preview').find('#submit-answer-button').on 'click', =>
                    @trigger "submit:answer" if displayAnswer



            # on change of bg_color property
            _changeBGColor : (model, bgColor)=>
                @$el.find('.sort-option').css 'background-color', _.convertHex @sort_model.get('bg_color'), @sort_model.get('bg_opacity')

            # on change of height property
            _changeHeight : (model, height)=>
                @$el.find('.sort-option').css 'min-height', height + 'px'


            _enableSorting : ->
                # on mouse down on the text area remove sortable so as to enable typing

                # on mousedown of th option make it sortable if not already is
                if not @$el.find('.sort').hasClass 'ui-sortable'
                    @$el.find('.sort').sortable
                        cursor : "move"

            onDestroySortable:->
                @$el.find('.sort').sortable('destroy') if @$el.find('.sort').hasClass 'ui-sortable'


            onShowFeedback : ->
                @$el.find('.fibRightAns').show()
                @$el.find('input#optionNo').each (index, element)=>
                    $(element).before("<span class='myAnswer' style='display:none;'>#{index + 1}</span>")
                    $(element).before("<span class='correctAnswer' style='display:none;'>#{@collection.get($(element).val()).get('index')}</span>")

                @onDestroySortable()

                $container = @$el.find('.sort')


                $container.isotope
                # // options
                    itemSelector : '.sort-option'
                    layoutMode : 'vertical'
                    getSortData :
                        correctAnswer : '.correctAnswer parseInt'
                        myAnswer : '.myAnswer parseInt'

                @$el.find('.sort-option').css 'min-width', '100%'


                @$el.find('.fibRightAns input').on 'click', (evt)=>
                    # _.delay =>
                    evt.stopPropagation()
                    @$el.find('.fibRightAns input').removeClass('btn-primary')
                    $(evt.target).addClass 'btn-primary'
                    sortValue = $(evt.target).attr('data-sort-value')
                    console.log sortValue
                    console.log $(evt.target)
                    @$el.find('.sort').isotope
                        sortBy : sortValue
            # ,200



            # on close drestroy the sortable
            onClose : ->
                @$el.find('.sort').sortable('destroy') if @$el.find('.sort').hasClass 'ui-sortable'
			





