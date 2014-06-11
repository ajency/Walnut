define ['app'
        'controllers/region-controller'
], (App, RegionController)->
    App.module "ContentCreator.Controller", (Controller, App)->
        class Controller.ChooseContentType extends RegionController

            initialize: ->
                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript:;'},
                        {'label': 'Choose Content Type', 'link': 'javascript:;', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items


                @view = view = @_getChooseContentTypeView()

                @show view, (loading: true)


            _getChooseContentTypeView: =>
                new ChooseContentTypeView


        class ChooseContentTypeView extends Marionette.ItemView

            template: '<div class="col-sm-4">
            					<div class="tiles white text-center">
            	                	<a class="heading p-t-40 p-b-40" href="#create-content/teacher_question"> Teacher Question </a>
            	           	 	</div>
            	        	</div>
            				<div class="col-sm-4">
            					<div class="tiles white text-center">
            	                	<a class="heading p-t-40 p-b-40" href="#create-content/student_question"> Student Question </a>
            	           	 	</div>
            	           	</div>
            				<div class="col-sm-4">
            					<div class="tiles white text-center">
            	                	<a class="heading p-t-40 p-b-40" href="#create-content/content_piece"> Content </a>
            	           	 	</div>
            	           	</div>
            			</div>'

            className: 'row creator'


