define ['app'],(App)->

	App.module "ContentCreator.ElementBox.Views",(Views, App)->


		class Views.ElementBoxView extends Marionette.ItemView

			template :
						'<div class="tiles green"> 
							<div class="tiles-head"> 
								<h4 class="text-white"> 
									<span class="semi-bold">Tool</span>box 
								</h4> 
							</div> 
						</div> 
						<h5 class="semi-bold text-center b-b b-grey p-b-10">Components</h5> 
						<div class="tools"> 
							<ul> 
								<li data-element="Row"> 
									<a href="#" class="drag builder-element" > 
										<i class="bicon icon-uniF160"></i> 
										<div class="aj-imp-builder-title">Row</div> 
									</a> 
								</li> 
								<div class="clearfix"></div> 
							</ul> 
						</div> 
						<h5 class="semi-bold text-center b-b b-grey p-b-10">Questions</h5> 
						<div class="qstns"> 
							<ul class="elements"> 
								<li data-element="Hotspot" > 
									<a href="#" class="drag builder-element" > 
										<div class="aj-imp-builder-title">
											<i class="fa fa-bullseye"></i> Hotspot
										</div> 
									</a>
								</li> 
								<li data-element="Mcq" > 
									<a href="#" class="drag builder-element" > 
										<div class="aj-imp-builder-title">
											<i class="fa fa-list-ol"></i> MCQ
										</div> 
									</a> 
								</li>
								<li data-element="Fib" > 
									<a href="#" class="drag builder-element" > 
										<div class="aj-imp-builder-title">
											<i class="bicon icon-uniF148"></i> Fill in the Blanks
										</div> 
									</a> 
								</li>  
								<li data-element="BigAnswer" > 
									<a href="#" class="drag builder-element" > 
										<div class="aj-imp-builder-title">
											<i class="bicon icon-uniF15E"></i> Big Answer
										</div> 
									</a> 
								</li>  
								<li data-element="Sort" > 
									<a href="#" class="drag builder-element" > 
										<div class="aj-imp-builder-title">
											<i class="bicon icon-uniF153"></i><i class="bicon icon-uniF154"></i> Sort
										</div> 
									</a> 
								</li>  
							</ul> 
							<div class="clearfix"></div> 
						</div> 
						<h5 class="semi-bold text-center b-b b-grey p-b-10">Elements</h5> 
						<div class="tools">
							<ul> 
								<li data-element="Image" class="hotspotable"> 
									<a href="#" class="drag builder-element" > 
										<i class="bicon icon-uniF10E"></i> 
										<div class="aj-imp-builder-title">Image</div> 
									</a> 
								</li> 
								<li data-element="Text" class="hotspotable"> 
									<a href="#" class="drag builder-element" > 
										<i class="bicon icon-uniF11C"></i> 
										<div class="aj-imp-builder-title">Text</div> 
									</a> 
								</li> 
								<li data-element="ImageWithText" class="hotspotable"> 
									<a href="#" class="drag builder-element" > 
										<i class="bicon icon-uniF112"></i> 
										<div class="aj-imp-builder-title">Image With Text</div> 
									</a> 
								</li> 
								<div class="clearfix"></div> 
							</ul> 
						</div>'


			onShow:->
				
				@$el.find('*[data-element]').draggable
								connectToSortable	: '.droppable-column'
								helper 				: 'clone'
								delay 				: 5
								addClasses			: false
								distance 			: 5
								revert 				: 'invalid'


				@on "question:dropped",=>
					@$el.find('.qstns').find('*[data-element]').draggable 'disable'

				@on "question:removed",=>
					@$el.find('.qstns').find('*[data-element]').draggable 'enable'




		# class ElementView extends Marionette.ItemView

		# 	tagName : 'li'

		# 	template : '<a href="#" class="drag builder-element" >
							
		# 					<div class="aj-imp-builder-title">{{element}}</div>
		# 				</a>'

		# 	onRender :->
		# 		console.log @model.toJSON()
		# 		@$el.attr 'data-element', @model.get 'element'


		# class Views.ElementBoxView extends Marionette.CompositeView

		# 	# template : '<h4 class="text-white b-b b-grey p-b-10">
		# 	# 				<span class="semi-bold">Tool</span>box
		# 	# 			</h4>
		# 	# 			<div class>
		# 	# 				<ul class="elements">

		# 	# 				</ul>
		# 	# 				<div class="clearfix"></div>
		# 	# 			</div>'

		# 	template : '<div class="tiles green">
		# 					<div class="tiles-head">
		# 						<h4 class="text-white"><span class="semi-bold">Tool</span>box</h4>
		# 					</div>
		# 				</div>
		# 				<h5 class="semi-bold text-center b-b b-grey p-b-10">Questions</h5>
		# 				<div class="qstns">
		# 					<ul class="elements"></ul>
		# 					<div class="clearfix"></div>
		# 				</div>
		# 				'

		# 	itemView : ElementView

		# 	itemViewContainer : 'ul.elements'

		# 	onShow:->
				
		# 		@$el.find('*[data-element]').draggable
		# 										connectToSortable	: '.droppable-column'
		# 										helper 				: 'clone'
		# 										delay 				: 5
		# 										addClasses			: false
		# 										distance 			: 5
		# 										revert 				: 'invalid'
			
				
 
