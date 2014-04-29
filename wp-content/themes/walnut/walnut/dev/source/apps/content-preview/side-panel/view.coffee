define ['app'],(App)->

	App.module "ContentPreview.SidePanel.Views",(Views,App,Backbone,Marionette,$,_)->

		class Views.SidePanelView extends Marionette.ItemView

			template : '<div id="Result">Result : </div>'