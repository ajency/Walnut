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
						<div id="question-property" class="docket"></div>
						<div id="question-elements" class="docket"></div>'

			events :
				'click  #save-question' : 'saveQuestion'

			saveQuestion:->
				App.execute "save:question"

			regions : 
				questPropertyRegion	: '#question-property'
				questElementRegion	: '#question-elements'