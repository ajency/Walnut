define ['app'],(App)->

		App.module "ContentPreview.Views" , (Views,App,Backbone,Marionette,$,_)->

			class Views.Layout extends Marionette.Layout 

				className : ''

				template : '<div class="page-title"> 
								<h3><span class="semi-bold">Preview Question</span></h3>
							</div>
							<div class="preview">
								
								<div class="" id="content-board"></div>
								<div class="" id="side-panel"></div>
							</div>
							'

				regions : 
					contentBoardRegion : '#content-board' 
					sidePanelRegion : '#side-panel'