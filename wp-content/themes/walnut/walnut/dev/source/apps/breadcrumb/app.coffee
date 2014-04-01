define ['app'
		'controllers/region-controller'], (App, RegionController)->

	App.module "BreadcrumbApp.Controller", (Controller, App)->

		class Controller.BreadcrumbController extends RegionController

			initialize : ->
				breadcrumbItems= App.request "get:breadcrumb:model"

				@listenTo breadcrumbItems, "change:items", @renderbreadcrumb

				@renderbreadcrumb()

			renderbreadcrumb:=>
				breadcrumbItems= App.request "get:breadcrumb:model"
				@view= view = @_getBreadcrumbView breadcrumbItems
				@show view

			_getBreadcrumbView : (items)->
				console.log 'new breadcrumb view'
				new BreadcrumbView
					model: items

		class BreadcrumbView extends Marionette.ItemView
			template 	: '{{#items}}<li><a href="{{link}}" class="{{active}}">{{label}}</a></li>{{/items}}'
			tagName	 : 'ul'
			className: 'breadcrumb'

		# set handlers
		App.commands.setHandler "show:breadcrumbapp", (opt = {})->
			new Controller.BreadcrumbController opt
