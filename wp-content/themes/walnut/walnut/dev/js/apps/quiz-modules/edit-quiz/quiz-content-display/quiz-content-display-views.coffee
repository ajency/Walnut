define ['app'
        'text!apps/quiz-modules/edit-quiz/quiz-content-display/templates/quiz-content-display.html'
], (App, contentDisplayItemTpl)->
    App.module 'QuizModuleApp.EditQuiz.QuizContentDisplay.Views', (Views, App)->
        class ContentItemView extends Marionette.ItemView

            template : contentDisplayItemTpl

            tagName : 'li'

            className : 'sortable'

            mixinTemplateHelpers : (data)->
                data = super data
                data.isContentPiece = true if data.post_type is 'content-piece'
                if data.post_type is 'content_set'
                    data.isSet = true
                    data.contentLevels = new Array()
                    for i in [ 1..3 ]
                        lvl = parseInt data["lvl#{i}"]
                        while lvl > 0
                            data.contentLevels.push "Level #{i}"
                            lvl--

                data

            onShow : ->
                if @model.get('post_type')is 'content_set'
                    @$el.attr 'id', @model.get 'id'
                else
                    @$el.attr 'id', @model.get 'ID'

        class Views.ContentDisplayView extends Marionette.CompositeView

            template : '<ul class="cbp_tmtimeline"></ul>'

            itemView : ContentItemView

            itemViewContainer : 'ul.cbp_tmtimeline'

            className : 'col-md-10'

            id : 'myCanvas-miki'

            events :
                'click .remove' : 'removeItem'

            modelEvents :
                'change:post_status' : 'statusChanged'

            statusChanged : (model, post_status)->
                if post_status in ['publish', 'archive']
                    @$el.find('.remove').hide()
                    @$el.find(".cbp_tmtimeline").sortable('disable')
                else
                    @$el.find('.remove').show()
#                    @triggerMethod 'show'


            onShow : ->
                @$el.find(".cbp_tmtimeline").sortable

                    stop : (event, ui)=>
                        sorted_order = @$el.find(".cbp_tmtimeline")
                        .sortable "toArray"
                        console.log sorted_order
                        @trigger "changed:order", sorted_order

                @statusChanged @model, @model.get('post_status')


            removeItem : (e)=>
                id = $(e.target)
                .closest '.contentPiece'
                    .attr 'data-id'

                @trigger 'remove:model:from:quiz',id

#                @collection.remove parseInt id