define ['app'],(App)->

	App.module "ContentCreator.ElementBox.Views",(Views, App)->

		class ElementView extends Marionette.ItemView

			tagName : 'li'

			template : '<a href="#" class="drag builder-element" >
							
							<div class="aj-imp-builder-title">{{element}}</div>
						</a>'

			onRender :->
				console.log @model.toJSON()
				@$el.attr 'data-element', @model.get 'element'


		class Views.ElementBoxView extends Marionette.CompositeView

			# template : '<h4 class="text-white b-b b-grey p-b-10">
			# 				<span class="semi-bold">Tool</span>box
			# 			</h4>
			# 			<div class>
			# 				<ul class="elements">

			# 				</ul>
			# 				<div class="clearfix"></div>
			# 			</div>'

			template : '<div class="tiles green">
							<div class="tiles-head">
								<h4 class="text-white"><span class="semi-bold">Tool</span>box</h4>
							</div>
						</div>
						<h5 class="semi-bold text-center b-b b-grey p-b-10">Questions</h5>
						<div class="qstns">
							<ul class="elements"></ul>
							<div class="clearfix"></div>
						</div>
						'

			itemView : ElementView

			itemViewContainer : 'ul.elements'

			onShow:->
				
				@$el.find('*[data-element]').draggable
												connectToSortable	: '.droppable-column'
												helper 				: 'clone'
												delay 				: 5
												addClasses			: false
												distance 			: 5
												revert 				: 'invalid'
			
				
 
