define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class GridRow extends Marionette.ItemView

			className: 'row'

			template : '<div class="col-sm-4"><label>{{optionNo}}</label></div>
						<div class="col-sm-8">
							<input data-id="{{optionNo}}" type="text" value="{{marks}}" class="form-control">
						</div>						
						'
						

			events : 
				'blur input': (evt)-> @model.set 'marks',$(evt.target).val()


		class Views.MarksView extends Marionette.CompositeView

			template : '<div class="row">
							<div class="col-sm-4"><div class="text-right">Option</div></div>
							<div class="col-sm-8"><div>Marks</div></div>	
						</div>	
						<div class="items">
						</div>'

			itemView : GridRow

			itemViewContainer : 'div.items'

			initialize:(options)->
				@mcqModel = options.mcq_model

			onRender:->
				console.log @collection

			onShow:->
				# totalMarks = @mcqModel.get('marks') 
				# totalMarks = 0
				_.each @mcqModel.get('correct_answer') ,(option)=>
					@$el.find('input[data-id="'+option+'"]').prop 'disabled',false
					# totalMarks = totalMarks + parseInt @mcqModel.get('elements').get(option).get('marks')
				_.each _.difference(_.range(1,@mcqModel.get('optioncount')+1),@mcqModel.get('correct_answer')),(option)=>
					@$el.find('input[data-id="'+option+'"]').val(0).prop 'disabled',true
				# console.log totalMarks




		



			