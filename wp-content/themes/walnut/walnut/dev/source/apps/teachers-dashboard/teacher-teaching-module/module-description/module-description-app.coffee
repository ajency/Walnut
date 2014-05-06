define ['app'
		'controllers/region-controller'
		'text!apps/teachers-dashboard/teacher-teaching-module/module-description/templates/module-description-template.html'], (App, RegionController,moduleDescriptionTemplate)->

	App.module "TeacherTeachingApp.ModuleDescription", (ModuleDescription, App)->

		class ModuleDescriptionController extends RegionController

			initialize : (opts)->
				{model,@textbookNames, @classID, @division} = opts
				
				@divisionModel= App.request "get:division:by:id", @division if @division?
				
				@view= view = @_showModuleDescriptionView model

				@show view, (loading:true, entities:[@textbookNames])

				@listenTo @view, "goto:previous:route", => @region.trigger "goto:previous:route"


			_showModuleDescriptionView :(model) =>

				terms= model.get 'term_ids'

				new ModuleDescriptionView
					model 			: model

					templateHelpers:

						getClassOrDivision:=>
							if @divisionModel
								@divisionModel.get 'division'
							else 
								CLASS_LABEL[@classID]

						getTextbookName:=>
							textbook= @textbookNames.get terms.textbook
							texbookName = textbook.get 'name' if textbook?

						getChapterName:=>
							chapter= @textbookNames.get terms.chapter
							chapterName = chapter.get 'name' if chapter?

						getSectionsNames:=>
							sections= _.flatten terms.sections
							sectionString = ''
							sectionNames=[]

							if sections
								for section in sections
									term= @textbookNames.get section
									sectionName= term.get 'name' if term?
									sectionNames.push sectionName

								sectionString = sectionNames.join()

						getSubSectionsNames:=>
							subsections= _.flatten terms.subsections
							subSectionString = ''
							subsectionNames=[]

							if subsections
								for sub in subsections
									subsection= @textbookNames.get sub
									subsectionNames.push subsection.get 'name' if subsection?

								subSectionString= subsectionNames.join()
								
	
		class ModuleDescriptionView extends Marionette.ItemView

			className: 'pieceWrapper'

			template : moduleDescriptionTemplate

			events : 
				'click #back-to-module':-> @trigger "goto:previous:route"
			
			onShow:->
				clock = setInterval @updateTime, 500		

			updateTime :=>
				if _.size($('#timekeeper')) >0
					@$el.find '.timedisplay'
					.html '<i class="fa fa-clock-o"></i> '+ $('#timekeeper').html()



		# set handlers
		App.commands.setHandler "show:teacher:teaching:module:description", (opt = {})->
			new ModuleDescriptionController opt	