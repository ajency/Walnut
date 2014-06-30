define ['app'], (App)->
    App.module "SingleQuestionMultipleEvaluationApp.StudentList.Views", (Views, App)->
        class StudentsItemView extends Marionette.ItemView

            className : 'col-sm-3 m-b-20'

            template : '<div class="row single tiles white no-margin" data-id="{{ID}}">
                                                    <div class="col-md-8 col-xs-8 no-padding">
                                                      <div class="text-center">
                                                        <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">{{display_name}}</span> </h4>
                                                        <div class="clearfix"></div>
                                                      </div>
                                                    </div>
                                                     <div class="col-md-4 col-xs-4 no-padding">
                                                      <div class="tiles unselected active">
                                                        <div class="user-profile-pic text-left m-t-0 p-t-10">
                                                        <img data-src-retina="{{profile_pic}}" data-src="{{profile_pic}}" src="{{profile_pic}}" alt="">
                                                      </div>
                                                        <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div>
                                                      </div>
                                                    </div>
                                                </div>'


        class StudentsEmptyView extends Marionette.ItemView

            template : '<div class="row no-margin">
                                                    <div class="col-md-12 no-padding">
                                                      <div class="text-center">
                                                        <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">No Students in Class</h4>
                                                        <div class="clearfix"></div>
                                                      </div>
                                                    </div>
                                                </div>'


        class Views.StudentsListView extends Marionette.CollectionView

            className : 'row students m-l-0 m-r-0 m-t-20'

            itemView : StudentsItemView

            emptyView : StudentsEmptyView

            events :
                'click .tiles.single.selectable' : 'selectStudent'

            onShow : ->
#                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                $(ele).addClass 'selectable' for ele in @$el.find '.tiles.single'

                $ ".students"
                .listnav
                #filterSelector: '.last-name'
                    includeNums : false
                #removeDisabled: true


                @correctAnswers = Marionette.getOption @, 'correctAnswers'
                console.log @correctAnswers
                @correctAnswers = _.pluck @correctAnswers, 'id'

                console.log @correctAnswers

                for ele in @$el.find '.tiles.single'
                    eleValue = parseInt($(ele).attr('data-id'))
                    if _.contains(@correctAnswers, eleValue)
                        @markAsCorrectAnswer ele

            markAsCorrectAnswer: (student)->
                $(student).removeClass 'selected'
                .find '.unselected'
                    .removeClass 'unselected'
                        .addClass 'blue'
                            .find 'i'
                                .removeClass 'fa-minus-circle'
                                    .addClass 'fa-check-circle'

            selectStudent : (e)->
                @$el.find('.tiles.single').removeClass 'selected'
                $(e.target).closest('.tiles.single').addClass "selected"
                @trigger 'student:selected', $(e.target).closest('.tiles.single').attr 'data-id'

            onStudentAnswerSaved : (id)->
                @$el.find(".tiles.single[data-id='#{id}']").find('.unselected')
                .removeClass 'unselected'
                    .addClass 'blue'
                        .find 'i'
                            .removeClass 'fa-minus-circle'
                                .addClass 'fa-check-circle'
