define ['app'], (App)->
    App.module "ContentCreator.PropertyDock.HotspotPropertyBox.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class Views.PropertyView extends Marionette.ItemView

            template: '<div class="tile-more-content no-padding">
            								<div class="tiles green">
            									<div class="tile-footer drag">
            										Hotspot <i class="fa fa-chevron-right"></i> <span class="semi-bold">Hotspot Question Properties</span>
            									</div>
            									<div class="docket-body">

            										<div class="checkbox check-success">
            											<input id="check-individual-marks" type="checkbox" name="check-individual-marks">
            											<label for="check-individual-marks">Set marks for each hotspot</label>
            										</div>

            										<div class="m-b-10">
            											Marks
            											<input id="marks" type="text" value="{{marks}}" class="form-control" >
            										</div>

            										<div id="transparency" class="checkbox check-success">
            											<input id="transparency-checkbox" type="checkbox" value="1">
            											<label for="transparency-checkbox">Set Transparent</label>
            										</div>


            									</div>
            								</div>
            							</div>'

            events:
                'blur input#marks': '_changeMarks'
                'change @ui.individualMarksCheckbox': '_toggleIndividualMarks'
                'change @ui.transparencyCheckbox': '_toggleTransparency'

            ui:
                marksTextbox: 'input#marks'
                individualMarksCheckbox: 'input#check-individual-marks'
                transparencyCheckbox: 'input#transparency-checkbox'

            onShow: ->
                console.log @model.get('optionCollection')
                if @model.get 'enableIndividualMarks'
                    @ui.individualMarksCheckbox.prop 'checked', true
                    @ui.marksTextbox.prop 'disabled', true
                    @_enableCalculateMarks()

                # TRANSPARENCY
                # check model for Transparency and initialize checkbox
                if @model.get 'transparent'

                    @$el.find('#transparency-checkbox').prop('checked', true)




            # function for changing model on change of marks dropbox
            _changeMarks: (evt)->
                if not isNaN $(evt.target).val()
                    @model.set 'marks', parseInt $(evt.target).val()

            _enableCalculateMarks: ->
                @_updateMarks()
                @$el.closest('#property-dock').on 'change',
                    '#question-elements-property #individual-marks', (evt)=>
                        @_updateMarks()

                @listenTo @model.get('optionCollection'), 'add', @_updateMarks
                @listenTo @model.get('optionCollection'), 'remove', @_updateMarks

            _disableCalculateMarks: ->
                @$el.closest('#property-dock').off 'change',
                    '#question-elements-property #individual-marks'
                @stopListening @model.get('optionCollection')

            _updateMarks: =>
                # console.log 'change'
                _.delay @_delayUpdateTillMarksChange, 50

            _delayUpdateTillMarksChange: =>
                totalMarks = 0
                console.log @model.get('optionCollection')
                @model.get('optionCollection').each (option)=>
                    # console.log option
                    totalMarks = totalMarks + parseInt option.get('marks')
                @model.set 'marks', totalMarks
                $(@ui.marksTextbox).val totalMarks


            # function for changing model on change of
            # Enable individual marks checkbox
            _toggleIndividualMarks: (evt)->
                if $(evt.target).prop 'checked'
                    @model.set 'enableIndividualMarks', true
                    @ui.marksTextbox.prop 'disabled', true
                    @_enableCalculateMarks()

                else
                    @model.set 'enableIndividualMarks', false
                    @ui.marksTextbox.prop 'disabled', false
                    @_disableCalculateMarks()

            _toggleTransparency: ->
                #on click of checkbox set model transparent to true
                if @ui.transparencyCheckbox.prop 'checked'
                    @model.set 'transparent', true
                else
                    @model.set 'transparent', false

            onClose: ->
                @_disableCalculateMarks()


