define ['app'],(App)->

		App.module "ContentPreview.Views" , (Views,App,Backbone,Marionette,$,_)->

			class Views.Layout extends Marionette.Layout 

				className : ''

				template : '<div class="page-title"> 
								<h3><span class="semi-bold">Preview Question</span></h3>
							</div>
							<div class="preview">
								<div class="" id="top-panel"></div>
								
								<div class="" id="content-board"></div>
							
								<div class="" id="bottom-panel">
									<div>
								
										<div class="m-t-10  pull-right m-b-10 p-t-10 p-b-10"><button id="submit-answer-button" type="button" class="btn btn-primary"><i class="fa fa-check"></i> Submit</button></div>

										<div class="m-t-10 pull-right m-b-10 p-t-10 p-b-10 m-r-20"> <button id="skip-button" type="button" class="btn btn-danger"><i class="fa fa-forward"></i> Skip</button></div>

										<div class="clearfix"></div>
															
									</div>
								</div>
								
							</div>
							'

				regions : 
					contentBoardRegion : '#content-board' 
					sidePanelRegion : '#side-panel'
					topPanelRegion : '#top-panel'
					bottomPanelRegion : '#bottom-panel'

				ui : 
					skipButton : '#skip-button'

				events :
					'click @ui.skipButton' : '_reloadPreview'


				_reloadPreview:->				
					App.execute "show:content:preview", 
						region : App.mainContentRegion