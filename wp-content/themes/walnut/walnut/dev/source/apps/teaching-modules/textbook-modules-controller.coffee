define ['app'
        'controllers/region-controller'
        'apps/teaching-modules/textbook-modules-views'
], (App, RegionController)->
    App.module "TeachersDashboardApp.View", (View, App)->

        #List of textbooks available to a teacher for training or to take a class
        class View.textbookModulesController extends RegionController
            initialize: (opts) ->
                {textbookID,@classID,@division,@mode} = opts

                #in teaching/ training mode take-an-item the header & left nav are removed
                #so on browser back, on reaching this page we need to call them again.
                #hence the following two lines

                App.execute "show:headerapp", region : App.headerRegion
                App.execute "show:leftnavapp", region : App.leftNavRegion

                @textbook = App.request "get:textbook:by:id", textbookID

                if @mode is 'training'
                    @contentGroupsCollection = App.request "get:content:groups",
                        'textbook': textbookID
                        'division': @division

                else if @mode is 'take-class'
                    @contentGroupsCollection = App.request "get:content:groups",
                        'textbook': textbookID
                        'division': @division

                else if @mode is 'take-quiz'
                    @contentGroupsCollection = App.request "get:quizes",
                        'textbook': textbookID
                        'user_id': App.request "get:user:data", "ID"

                @chaptersCollection= App.request "get:chapters", ('parent' : textbookID)

                App.execute "when:fetched", [@chaptersCollection,@contentGroupsCollection,@textbook], =>

                    @view = view = @_getContentGroupsListingView @contentGroupsCollection

                    @show @view, loading: true

                    @listenTo @view, "schedule:training": (id)=>
                        @singleModule = @contentGroupsCollection.get id
                        modalview = @_showScheduleModal @singleModule
                        @show modalview, region: App.popupRegion

                        @listenTo modalview, "save:scheduled:date", @_saveSchedule

                    @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                        chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                        App.execute "when:fetched", chaptersOrSections, =>
                            @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType


            _saveSchedule: (id, date)=>

                singleModule = @contentGroupsCollection.get id

                first_content_piece = _.first singleModule.get 'content_pieces'

                data=
                    collection_id   : id
                    content_piece_id: first_content_piece
                    start_date      : date
                    division        : @division
                    status          : 'scheduled'

                App.request "schedule:content:group",data

                @view.triggerMethod 'scheduled:module', id,date

            _getContentGroupsListingView: (collection)=>
                new View.TakeClassTextbookModules.ContentGroupsView
                    collection          : collection
                    mode                : @mode
                    chaptersCollection  : @chaptersCollection
                    fullCollection      : collection.clone()

                    templateHelpers:
                        showTextbookName: =>
                            @textbook.get 'name'

                        showModulesHeading:=>

                            headingString='<span class="semi-bold">All</span> Modules'

                            if @mode is 'training'
                                headingString='<span class="semi-bold">Practice</span> Modules'

                            headingString

            _showScheduleModal: (model)=>
                new ScheduleModalView
                    model: model

        class ScheduleModalView extends Marionette.ItemView

            template: '<div class="modal fade" id="schedule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        					<div class="modal-dialog">
                        					  <div class="modal-content">
                        						<div class="modal-header">
                        						  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        						  <h4 class="modal-title" id="myModalLabel">Schedule Module</h4>
                        						</div>
                        						<div class="modal-body">
                        						  <div data-date-format="yyyy-mm-dd" class="input-append success date">
                        										  <input id="scheduled-date" type="text" value="{{training_date}}" placeholder="Select Date" class="span12">
                        										  <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span>
                        								  </div>
                        								  <button type="button" class="btn btn-success" data-dismiss="modal">Save</button>
                        						</div>
                        					  </div>
                        					</div>
                        				</div>'

            events:
                'click .btn-success': 'saveScheduledDate'

            onShow: ->
                nowDate = new Date();
                today= new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

                $('.input-append.date').datepicker
                    autoclose: true
                    todayHighlight: true
                    startDate: today


            serializeData: ->
                data = super()

                training_date = @model.get 'training_date'

                if training_date isnt ''
                    data.training_date = moment(training_date).format("YYYY-MM-DD")

                data

            saveScheduledDate: (e)=>
                dataID = @model.get 'id'
                scheduledDate = @$el.find '#scheduled-date'
                .val()

                if scheduledDate isnt ''
                    @trigger "save:scheduled:date", dataID, scheduledDate



        # set handlers
        App.commands.setHandler "show:teaching:modules:app", (opt = {})->
            new View.textbookModulesController opt