define ['app'],(App)->

	App.module 'ContentPreview.ContentBoard.Views',(Views,App,Backbone,Marionette,$,_)->

		class Views.ContentBoardView extends Marionette.ItemView

			onRender:->
				@$el.attr 'id','myCanvas'

