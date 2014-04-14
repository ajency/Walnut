define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class GridRow extends Marionette.ItemView

			tagName : 'tr'

			template : '<td>{{optionNo}}</td>
						<td><input type="text" value="{{marks}}"></td>'

			events : 
				'blur input': (evt)-> @model.set 'marks',$(evt.target).val()


		class Views.MarksView extends Marionette.CompositeView

			tagName : 'table'

			template : '<thead>
							<tr>
								<th>Option</th>
								<th>Marks</th>
							</tr>
						</thead>
						<tbody>
						</tbody>'

			itemView : GridRow

			itemViewContainer : 'tbody'

			onRender:->
				console.log @collection



		



			