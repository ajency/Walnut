define ['app'], (App)->
    App.module "SingleQuestionStudentsListApp.Views", (Views, App)->
        class StudentsItemView extends Marionette.ItemView

            className: 'col-sm-3 m-b-20'

            template: '<div class="row single tiles white no-margin" data-id="{{ID}}">
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

            template: '<div class="row no-margin">
            			                <div class="col-md-12 no-padding">
            			                  <div class="text-center">
            			                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">No Students in Class</h4>
            			                    <div class="clearfix"></div>
            			                  </div>
            			                </div>
            			            </div>'


        class Views.StudentsList extends Marionette.CompositeView

            className: 'studentList m-t-10'

            template: '{{#class_mode}}
                        <div id="select-an-item" class="studentActions p-t-10 p-b-10">
                            <h3 class="no-margin semi-bold muted">Select a student to grade</h3>
                        </div>
                       <div style="display:none" class="studentActions p-t-10 p-b-10">
             							<button type="button" class="btn btn-info btn-xs btn-sm m-r-10" id="right-answer">
            								<i class="fa fa-check-circle"></i> Right Answer
            							</button>
            							<button type="button" class="btn btn-white btn-xs btn-sm" id="wrong-answer">
            								<i class="fa fa-minus-circle"></i> Unselect Answer
            							</button>
            						</div>
            						{{/class_mode}}
            						<div class="clearfix"></div>
            						<div class="row students m-l-0 m-r-0 m-t-20" id="students-list">

                        </div>'

            itemViewContainer: '#students-list'

            itemView: StudentsItemView

            emptyView: StudentsEmptyView

            events:
                'click .tiles.single.selectable': 'selectStudent'
                'click #right-answer': 'addToCorrectList'
                'click #wrong-answer': 'removeFromCorrectList'

            serializeData: ->
                data = super()
                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    data.class_mode = true

                data

            onShow: ->

                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    $(ele).addClass 'selectable' for ele in @$el.find '.tiles.single'

                else
                    @$el.find '#select-an-item'
                    .hide()

                if not Marionette.getOption(@, 'nextItemID')
                    @$el.find "#question-done"
                    .html '<i class="fa fa-forward"></i> Finish Module'

                @$el.find ".students"
                .listnav
                #filterSelector: '.last-name'
                    includeNums: false
                #removeDisabled: true


                @$el.find '.listNav a'
                .removeAttr 'href'
                .css 'cursor', 'pointer'

                @correctAnswers = Marionette.getOption @, 'correctAnswers'
                @correctAnswers = _.compact @correctAnswers

                for ele in @$el.find '.tiles.single'
                    eleValue = parseInt($(ele).attr('data-id'))
                    if _.contains(@correctAnswers, eleValue)
                        @markAsCorrectAnswer ele

            selectStudent: (e)->

                @$el.find '#select-an-item'
                .remove()

                @$el.find '.studentActions'
                .show()

                $(e.target).closest('.tiles.single').toggleClass "selected"

            addToCorrectList: =>
                selectedStudents = @$el.find '.tiles.single.selected'

                for student in selectedStudents
                    @correctAnswers = _.union @correctAnswers, parseInt $(student).attr 'data-id'
                    @markAsCorrectAnswer student

                @correctAnswers = _.uniq @correctAnswers
                @trigger "save:question:response", @correctAnswers

            markAsCorrectAnswer: (student)->
                $(student).removeClass 'selected'
                .find '.unselected'
                    .removeClass 'unselected'
                        .addClass 'blue'
                            .find 'i'
                                .removeClass 'fa-minus-circle'
                                    .addClass 'fa-check-circle'

            removeFromCorrectList: ->
                selectedStudents = @$el.find '.tiles.single.selected'

                for student in selectedStudents
                    @correctAnswers = _.without @correctAnswers, parseInt $(student).attr 'data-id'
                    $(student).removeClass 'selected'
                    .find '.blue'
                        .removeClass 'blue'
                            .addClass 'unselected'
                                .find 'i'
                                    .removeClass 'fa-check-circle'
                                        .addClass 'fa-minus-circle'

                @trigger "save:question:response", @correctAnswers


