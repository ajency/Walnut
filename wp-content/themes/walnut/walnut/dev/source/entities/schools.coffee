define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Schools", (Schools, App, Backbone, Marionette, $, _)->

			# School model
			class Schools.SchoolModel extends Backbone.Model

				name: 'schools'

				defaults : ->
					school_name 		: ''
					school_logo	 		: ''

			school = new Schools.SchoolModel
			
			# schools collection class
			class Schools.SchoolCollection extends Backbone.Collection
				model : Schools.SchoolModel
				comparator : 'id'
				name : 'schools'
				
				url :->
					 AJAXURL + '?action=get-schools'

			schoolCollection = new Schools.SchoolCollection

			# API 
			API = 
				# get all schools
				getSchools:(param = {})->
					schoolCollection.fetch
										reset : true
										data  : param
					schoolCollection



				getCurrentSchool:->
					school = new Schools.SchoolModel
					school.fetch()
					school

			# request handler to get all schools
			App.reqres.setHandler "get:all:schools", ->
				API.getSchools()

			# request handler to current school
			App.reqres.setHandler "get:current:school", ->
				API.getCurrentSchool()


			# request handler to current school
			App.reqres.setHandler "get:school:logo", ->
				API.getCurrentSchool()

		App.Entities.Schools