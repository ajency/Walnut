define ['app'
        'controllers/region-controller'
        'text!apps/content-group/edit-group/group-details/templates/collection-details.html'], (App, RegionController, collectionDetailsTpl)->
    App.module "CollecionDetailsApp.Controller", (Controller, App)->
        class Controller.EditCollecionDetailsController extends RegionController

            initialize: (opts)->
                {@model}= opts

                @textbooksCollection = App.request "get:textbooks"

                App.execute "when:fetched", [@textbooksCollection], @showView

            showView: =>
                @view = view = @_getCollectionDetailsView @model

                @show view, (loading: true, entities: [@textbooksCollection])

                @listenTo @view, "fetch:chapters": (term_id) =>
                    chaptersCollection = App.request "get:chapters", ('parent': term_id)
                    App.execute "when:fetched", chaptersCollection, =>
                        @view.triggerMethod 'fetch:chapters:complete', chaptersCollection

                @listenTo @view, "fetch:sections:subsections": (term_id) ->
                    allSectionsCollection = App.request "get:subsections:by:chapter:id", ('child_of': term_id)
                    App.execute "when:fetched", allSectionsCollection, =>
                        #make list of sections directly belonging to chapter ie. parent=term_id
                        sectionsList = allSectionsCollection.where 'parent': term_id

                        #all the other sections are listed as subsections
                        subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
                        allSections =
                            'sections': sectionsList, 'subsections': subsectionsList

                        @view.triggerMethod 'fetch:subsections:complete', allSections


                @listenTo @view, "save:content:collection:details": (data) =>

                    App.navigate "edit-module"

                    @model.set 'changed': 'module_details'
                    @model.save(data, {wait: true, success: @successFn, error: @errorFn})


            successFn: (model)=>
                @view.triggerMethod 'saved:content:group', model

            errorFn: ->
                console.log 'error'


            _getCollectionDetailsView: (model)->
                new CollectionDetailsView
                    model: model
                    templateHelpers:
                        textbooksFilter: =>
                            textbooks = []
                            _.each(@textbooksCollection.models, (el, ind)->
                                textbooks.push('name': el.get('name'), 'id': el.get('term_id'))
                            )
                            textbooks


        class CollectionDetailsView extends Marionette.ItemView

            template: collectionDetailsTpl

            className: 'tiles white grid simple vertical green animated slideInRight'

            events:
                'change #textbooks': (e)->
                    @$el.find '#secs, #subsecs'
                        .select2 'data', null

                    @$el.find '#chapters, #secs, #subsecs'
                        .html ''

                    @trigger "fetch:chapters", $(e.target).val()

                'change #chapters': (e)->
                    @trigger "fetch:sections:subsections", $(e.target).val()

                'click #save-content-collection': 'save_content'

            mixinTemplateHelpers : (data)->

                data = super data

                # add status values
                data.statusOptions = [
                    (
                        name : 'Under Review'
                        value : 'underreview'
                    )
                    (
                        name : 'Published'
                        value : 'publish'
                    )
                    (
                        name : 'Archived'
                        value : 'archive'
                    )
                ]

                data.textBookSelected = ->
                    return 'selected' if parseInt(@id) is parseInt(data.term_ids['textbook'])

                data.statusSelected = ->
                    return 'selected' if @value is data.status

                console.log data

                data


            onShow: ->
                $("#textbooks, #chapters, #minshours, select").select2()

                #Multi Select
                $("#secs,#subsecs").val([]).select2()

                if not @model.isNew()
                    @prepolateDropDowns()

            prepolateDropDowns : ->
                @$el.find('#textbooks').trigger 'change'

            onFetchChaptersComplete: (chapters)->
                if _.size(chapters) > 0
                    @$el.find('#chapters').html('');
                    _.each chapters.models, (chap, index)=>
                        @$el.find '#chapters'
                        .append '<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>'

                    @setChapterValue()
                else
                    @$el.find '#chapters'
                    .html '<option value="">No Chapters available</option>'

            setChapterValue : ->
                if @model.get('term_ids')['chapter']
                    @$el.find('#chapters').val @model.get('term_ids')['chapter']
                    @$el.find('#chapters').select2()
                    @$el.find('#chapters').trigger 'change'

            onFetchSubsectionsComplete: (allsections)->
                if _.size(allsections) > 0
                    if _.size(allsections.sections) > 0
                        @$el.find('#secs').html('');
                        _.each allsections.sections, (section, index)=>
                            @$el.find('#secs')
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'
                    else
                        @$el.find('#secs').html('<option value="">No Sections available</option>');

                    if _.size(allsections.subsections) > 0
                        @$el.find('#subsecs').html('');
                        _.each allsections.subsections, (section, index)=>
                            @$el.find '#subsecs'
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'
                    else
                        @$el.find('#subsecs').html '<option>No Sub Sections available</option>'
                else
                    @$el.find('#secs').html('<option value="">No Sections available</option>');
                    @$el.find('#subsecs').html('<option value="">No Sub Sections available</option>');


            save_content: (e)->
                e.preventDefault()

                $('#s2id_textbooks .select2-choice')
                .removeClass 'error'

                if @$el.find('#textbooks').val() is ''
                    $('#s2id_textbooks .select2-choice')
                    .addClass 'error'

                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    #data.term_ids= _.compact(data.term_ids)

                    @trigger "save:content:collection:details", data


            onSavedContentGroup: (model) ->
                @$el.find('#saved-success').remove();

                @$el.find '.grid-title'
                .prepend '<div id="saved-success">Saved Successfully. Click here to <a href="#view-group/' + model.get('id') + '">view your module</a><hr></div>'

        # set handlers
        App.commands.setHandler "show:editgroup:content:group:detailsapp", (opt = {})->
            new Controller.EditCollecionDetailsController opt

