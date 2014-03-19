define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.Views",(Views,App)->

		class Views.Layout extends Marionette.Layout

			template : '<div class="tiles green">
							<div class="tiles-head">
								<h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4>
							</div>
						</div>
						<div id="question-property" class="docket"></div>
						<div id="question-elements" class="docket"></div>'

			regions : 
				questPropertyRegion	: '#question-property'
				questElementRegion	: '#question-elements'
