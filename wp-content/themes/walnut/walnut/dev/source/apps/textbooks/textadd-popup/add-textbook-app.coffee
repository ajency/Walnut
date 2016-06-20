define ['app'
        'controllers/region-controller'
],(App,RegionController)->
    App.module 'AddTextbookPopup', (AddTextbookPopup,App)->

        class AddTextbookPopup.Controller extends RegionController

            initialize : (options)->
                #collection = options.collection

                @view = @_addTextbookView options.collection

                @show @view

                @listenTo @view, 'close:popup:dialog',->
                    @region.closeDialog()     

                @listenTo @view, 'save:quiz:schedule', (from,to)->

                    @quizModel.set
                        'schedule':
                            'from' : from
                            'to'   : to

                    data = 
                        quiz_id     : @quizModel.id
                        division    : @division
                        schedule    :
                            from    : from
                            to      : to

                    schedule = App.request "save:quiz:schedule", data

                    schedule.done (response)=>
                        @view.triggerMethod "schedule:saved", response



            _addTextbookView :(collection)=>
                new AddTextbookView
                    collection        : collection
                    #model        : @quizModel
        class AddTextbookView extends Marionette.ItemView

            template: '<form>
                        <div class="row">
                            <div class="col-md-12">
                                Name:<br>
                                          <input id="textname" name="textname" type="text" placeholder="Name" class="input-small span12">
                            </div><br>
                            <div class="col-md-12">
                                Classes suitable for:<br/>
                                {{#classes}}
                                <input style="width:20px" type="checkbox" name="textClass" value="{{label}}">{{label}}<br>
                                {{/classes}}
                            </div><br>
                            <div class="col-md-12">
                                Description:<br>
                                          <textarea id="textdesc" name="textdesc" type="text" class="input-small span12"></textarea>
                            </div><br>
                            <div class="col-md-12">
                                Textbook Image Url<br>
                                          <input id="texturl" name="texturl" type="file" class="input-small span12">
                            </div><br>
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" class="clear btn btn-success m-t-20 pull-left">Add Textbook</button>
                                    <div class=" p-l-10 p-t-30 pull-left success-msg"></div>
                                </div>
                            </div>
                        </div>
                    </form>'

            events:
                'click .btn-success'    : 'addTextbook'

            initialize:->
                @dialogOptions = 
                    modal_title : 'Add Textbook'
                    modal_size  : 'small'

            serializeData: ->
                data = super()
                #console.log @collection
                collection_classes = @collection.pluck 'classes'

                data.classes=   _.chain collection_classes
                                    .flatten()
                                    .union()
                                    .compact()
                                    .sortBy (num)-> parseInt num
                                    .map (m)->
                                        classes=[]
                                        classes.slug = _.slugify CLASS_LABEL[m]
                                        classes.label = CLASS_LABEL[m]
                                        classes
                                .value()

                class_ids = @collection.get 'classes'
                console.log class_ids
                if class_ids
                    item_classes = _.sortBy(class_ids, (num)->
                        num)
                    class_string = ''
                    for class_id in item_classes
                        class_string += CLASS_LABEL[class_id]
                        class_string += ', ' if _.last(item_classes) != class_id
                        console.log class_id+" "+class_string
                        #console.log class_string

                    data.class_string = class_string;
                data

            onShow: ->
                console.log 'onshow'


            addTextbook: (e)=>
                console.log @model
                if @$el.find('form').valid()
                    name = $('#textname').val()
                    #class_ids = 
                else     
                    #console.log scheduleTo
                    @trigger "save:quiz:schedule", data
                    onAddTextbook

            onAddTextbook:(response)->
                @$el.find '.success-msg'
                .html ''
                .removeClass 'text-success, text-error'

                if response.code is 'ERROR'
                    @$el.find '.success-msg'
                    .html 'Failed to save schedule'
                    .addClass 'text-error'

                else
                    @$el.find '.success-msg'
                    .html 'Saved Successfully'
                    .addClass 'text-success'

                    setTimeout =>
                        @trigger 'close:popup:dialog'
                    ,500

        App.commands.setHandler 'add:textbook:popup',(options)->
            new AddTextbookPopup.Controller options
