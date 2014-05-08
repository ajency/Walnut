define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.Views",(Views,App)->

		class Views.Layout extends Marionette.Layout

			template : '<div class="builder_actions">
          					<button type="button" class="btn btn-success btn-cons2" id="save-question">
          					<i class="fa fa-check"></i> Save</button>
          					<button type="button" class="btn btn-success btn-cons2">
          					<i class="fa fa-eye"></i> Preview</button>
          				</div>
						<div class="tiles green">
							<div class="tiles-head">
								<h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4>
							</div>
						</div>
						<div id="question-elements-property" class="docket"></div>
						<div id="question-property" class="docket"></div>
						<div id="question-elements" class="docket"></div>'

			events :
				'click  #save-question' : 'saveQuestion'

			saveQuestion:->
				App.execute "save:question"

			regions : 
				questElementPropRegion: '#question-elements-property'
				questPropertyRegion	: '#question-property'
				questElementRegion	: '#question-elements'

			onShow:->

					# $('#question-property').on 'mouseover mouseenter',->
					# 	App.ContentCreator.closequestioneproperty = false

					# $('#question-property').parent().parent().on 'mouseleave',->
					# 	App.ContentCreator.closequestioneproperty = true

					@$el.find('#question-property, #question-elements-property, #question-elements').on 'click',(evt)->
						evt.stopPropagation()


					$('html').on 'click',=>
						@questPropertyRegion.close()

					$('html').on 'click',=>
						@questElementPropRegion.close()

					$('html').on 'click',=>
						@questElementRegion.close()

					
