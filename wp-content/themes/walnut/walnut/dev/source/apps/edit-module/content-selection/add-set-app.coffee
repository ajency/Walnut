define ['app'
        'controllers/region-controller'
],(App,RegionController)->
    App.module 'ContentSelectionApp.AddSet',(AddSet,App)->

        class AddSet.Controller extends RegionController
            initialize : (options)->
                {@contentPiecesCollection,@contentGroupCollection,@selectedFilterParamsObject} = options

                @view = @_getView()

                @listenTo @region, "update:collection", =>
                    filters = @selectedFilterParamsObject.request 'get:selected:parameters'
                    @view.triggerMethod 'set:level:count'

                @listenTo @view,'get:textbook:filter',->
                    filters = @selectedFilterParamsObject.request 'get:selected:parameters'
                    @view.triggerMethod 'add:set',filters

                @listenTo @view, 'add:new:set', @_addNewSet

                @show @view

            _getView : ->
                new SetView
                    collection : @contentPiecesCollection

            _addNewSet : (data)=>
                data.id = @_getNewSetId()

                newSetModel = new Backbone.Model data

                @contentGroupCollection.add newSetModel


            _getNewSetId : ->
                modelsArray = @contentGroupCollection.where post_type : 'content_set'
                idArray = _.map _.pluck(modelsArray, 'id'), (id)->
                    parseInt _.ltrim id, 'set '
                if _.isEmpty idArray
                    id = 1
                else
                    id = _.max(idArray) + 1
                return "set #{id}"


        class SetView extends Marionette.ItemView
            template : ' <div class="row">
                                    <div class="col-md-12">
                                        <table class="table table-bordered table-flip-scroll cf">
                                            <thead class="cf">
                                            <tr>
                                                <th>Total Questions</th>
                                                <th>Level 1</th>
                                                <th>Level 2</th>
                                                <th>Level 3</th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> <input type="text" id="total-questions" class="disabled" size="1"  disabled="disabled" value="0">
                                                </td>
                                                <td class="level-selection" id="lvl1"><span></span> <input type="text"  /></td>
                                                <td class="level-selection" id="lvl2"><span></span> <input type="text"  /></td>
                                                <td class="level-selection" id="lvl3"><span></span> <input type="text" /></td>

                                            </tr>
                                            </tbody>
                                        </table>
                                        <div class="checkbox check-info">
                                            <input id="selectAll" type="checkbox" value="1">
                                            <label for="selectAll" class="text-grey">Select All</label>
                                        </div>
                                        <div class="pull-right">
                                            <button type="button" class="btn btn-success btn-cons2" id="add-set-button"><i class="fa fa-plus"></i> Add</button>
                                        </div>
                                    </div>
                                </div>'

            events :
                # 'click input' : ->
                #     @trigger 'get:textbook:filter'

                'change .level-selection input' : '_onSpinEditValueChanged'
                'click #add-set-button' : ->
                    if @$el.find('#total-questions').val() not in [0,'0']
                        @trigger 'get:textbook:filter'
                'change #selectAll' : '_selectAllForSet'

            className : 'row'

            onShow:->
                @listenTo @collection, 'add remove',=>
                    @onSetLevelCount()

                @onSetLevelCount()

            onSetLevelCount : ->
                levelCount = @collection.countBy 'difficulty_level'
                @$el.find('#selectAll').prop 'checked',false

                for i in [ 1..3 ]
                    count = levelCount["#{i}"] ? 0
                    @$el.find("#lvl#{i}").find(" input, .spinedit").remove()
                    @$el.find("#lvl#{i}").append "<input type='text'  />"
                    @$el.find("#lvl#{i} input").spinedit
                        minimum : 0
                        maximum : count
                        value : 0
                    @$el.find("#lvl#{i} span").text count

            _onSpinEditValueChanged : =>
                total = 0
                _.each @$el.find(".level-selection input.spinedit"), (num)->
                    total += parseInt $(num).val()
                @$el.find('#total-questions').val total

            _selectAllForSet : (e)->
                if $(e.target).is(':checked')
                    levelCount = @collection.countBy 'difficulty_level'
                    @$el.find("#lvl1 input").val(levelCount["1"] ? 0)
                    @$el.find("#lvl2 input").val(levelCount["2"] ? 0)
                    @$el.find("#lvl3 input").val(levelCount["3"] ? 0)
                    @_onSpinEditValueChanged()
                else
                    @$el.find("#lvl1 input").val( 0)
                    @$el.find("#lvl2 input").val( 0)
                    @$el.find("#lvl3 input").val( 0)
                    @_onSpinEditValueChanged()

            onAddSet : (filters)->
                _.each filters, (term,index)->
                    if not term? or term.id is ''
                        newTerm =
                            id : ''
                            text : 'ALL'
                        filters[index] = newTerm


                terms_id =
                    textbook : filters[0].id
                    chapter : filters[1].id
                    section : filters[2].id
                    subsection : filters[3].id

                setAvgs = @getSetAvgs()

                data =
                    terms_id : terms_id
                    textbook : filters[0].text
                    chapter : filters[1].text
                    section : filters[2].text
                    'sub-section' : filters[2].text
                    lvl1 : @$el.find("#lvl1 input").val()
                    lvl2 : @$el.find("#lvl2 input").val()
                    lvl3 : @$el.find("#lvl3 input").val()
                    post_type : 'content_set'
                    avg_marks     : setAvgs.marks
                    avg_duration  : setAvgs.time

#                _.each ['textbook','chapter','section','sub-section'],(attr)->
#
#                    x= _.slugify data[attr]
#                    if not data[attr]? or data[attr] is '' or _.slugify(data[attr]) is _.slugify("All #{attr}s")
#                        data[attr] = "ALL"

                @trigger "add:new:set",data

                @$el.find("input[type='text']").val 0
                @$el.find('#selectAll').prop 'checked',false

            #get average time & marks based on level and number of questions selected per level
            getSetAvgs:->

                avgMarks=avgTime=0

                for lev in [1..3]

                    marks =time= 0

                    models= @collection.where 'difficulty_level': lev

                    _.each models, (m,ele)-> 
                        marks+=parseInt(m.get('marks')) if m.get('marks')
                        time +=parseInt m.get 'duration'

                    numQuestions = parseInt @$el.find("#lvl#{lev} input").val() 
                    
                    avgMarks += numQuestions*marks/models.length if numQuestions
                    avgTime += numQuestions*time/models.length if numQuestions

                setAvgs = 
                    'marks':avgMarks
                    'time' :avgTime             


        App.commands.setHandler 'show:add:set:app',(opt ={})->
            new AddSet.Controller opt