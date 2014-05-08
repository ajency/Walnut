define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotPropertyBox.Views",
		(Views,App,Backbone,Marionette,$,_)->

			class Views.PropertyView extends Marionette.ItemView

				template : '<div class="tile-more-content no-padding">
								<div class="tiles green">
									<div class="tile-footer drag">
										MCQ <i class="fa fa-chevron-right"></i> <span class="semi-bold">Hotspot Question Properties</span>
									</div>
									<div class="docket-body">

										<div class="m-b-10">
											Marks
											<input id="marks" type="text" value="{{marks}}" class="form-control" >
										</div>


									</div>
								</div>
							</div>' 

				events : 
					'blur input#marks' : '_changeMarks'

				onShow:->
					console.log 'ss'

				# function for changing model on change of marks dropbox
				_changeMarks:(evt)->
					if not isNaN $(evt.target).val()
						@model.set 'marks', parseInt $(evt.target).val()
	
