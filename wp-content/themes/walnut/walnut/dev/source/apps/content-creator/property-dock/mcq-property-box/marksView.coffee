define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class GridRow extends Marionette.ItemView

			className: 'row'

			template : '<div class="col-sm-4"><label>{{optionNo}}</label></div>
						<div class="col-sm-8">
							<input type="text" value="{{marks}}" class="form-control">
						</div>'
						

			events : 
				'blur input': (evt)-> @model.set 'marks',$(evt.target).val()


		class Views.MarksView extends Marionette.CompositeView

			template : '<div class="row">
							<div class="col-sm-4"><h5>Option</h5></div>
							<div class="col-sm-8"><h5>Marks</h5></div>	
						</div>	
						<div class="items">
						</div>'

			itemView : GridRow

			itemViewContainer : 'div.items'

			onRender:->
				console.log @collection



		



			