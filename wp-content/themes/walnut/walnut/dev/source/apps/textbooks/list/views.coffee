define ['app'
        'text!apps/textbooks/templates/textbooks-list.html'
        'text!apps/textbooks/list/templates/list_item.html'
        'text!apps/textbooks/templates/no_textbooks.html'
], (App, textbooksListTpl, listitemTpl, notextbooksTpl)->
    App.module "TextbooksApp.List.Views", (Views, App)->
        class ListItemView extends Marionette.ItemView

            tagName: 'li'
            className: 'mix mix_all'
            template: listitemTpl

            onShow: ->
                #console.log 'global collection'
                #console.log collection
                @$el.attr 'data-name', @model.get 'name'
                class_ids = @model.get 'classes'
                if class_ids
                    @$el.addClass _.slugify(CLASS_LABEL[class_id]) for class_id in class_ids

                subjects = @model.get 'subjects'
                if subjects
                    @$el.addClass subject for subject in subjects


                $('#textbooks').mixitup
                    layoutMode: 'list', # Start in list mode (display: block) by default
                    listClass: 'list', # Container class for when in list mode
                    gridClass: 'grid', # Container class for when in grid mode
                    effects: ['fade', 'blur'], # List of effects
                    listEffects: ['fade', 'rotateX'] # List of effects ONLY for list mode


            serializeData: ->
                data = super()
                #console.log 'model'
                #console.log @model
                class_ids = @model.get 'classes'
                if class_ids
                    item_classes = _.sortBy(class_ids, (num)->
                        num)
                    class_string = ''
                    for class_id in item_classes
                        class_string += CLASS_LABEL[class_id]
                        classString = class_string
                        class_string += ', ' if _.last(item_classes) != class_id
                    data.class_string = class_string;

                data


        class EmptyView extends Marionette.ItemView

            template: notextbooksTpl

            tagName: 'div'

            className: 'visible-msg'

        class Views.ListView extends Marionette.CompositeView

            template: textbooksListTpl


           # className: 'visible-msg'

            itemView: ListItemView

            emptyView: EmptyView

            itemViewContainer: 'ul.textbooks_list'

            serializeData: ->
                data = super()
                #console.log @collection
                ###defer = $.Deferred()
                url     = AJAXURL + '?action=get-admin-capability'
                datas = 'data'
                    $.post url, 
                        datas, (response) =>
                            #console.log 'ADMIN'
                            console.log response
                            #current_blog_id = response
                            #response = response.toString
                            if response
                                data.isAdmin = response
                                console.log isAdmin
                            defer.resolve response
                        'json'

                    defer.promise()###

                
                
                collection_classes = @collection.pluck 'classes'

                data.classes=   _.chain collection_classes
                                    .flatten()
                                    .union()
                                    .compact()
                                    .sortBy (num)-> parseInt num
                                    .map (m)->
                                        classes=[]
                                        classes.slug = _.slugify CLASS_LABEL[m]
                                        classes.label = CLASS_LABEL[m]
                                        classes
                                .value()
                data.isAdmin = @collection.models[0].get 'isAdmin'
                collection_subjects = @collection.pluck 'subjects'
                data_subjects = _.union _.flatten collection_subjects
                data.subjects = _.compact (_.sortBy(data_subjects, (num)->
                    num))
                #console.log data
                data

            events:
                'click #Filters li': 'filterBooks'
                'click #search-btn' : 'searchTextbooks'
                'keypress .search-box' :(e)-> @searchTextbooks() if e.which is 13
                'click .add-textbook' : 'addTextbook'

            addTextbook:=>
                    defer = $.Deferred()
                    url     = AJAXURL + '?action=get-all-classes'
                    datas = 'data'
                    $.post url, 
                        datas, (response) =>
                            classids = response
                            #console.log classids
                            defer.resolve response
                            @collection.class_ids = classids
                            @trigger 'show:add:textbook:popup', @collection
                        'json'

                    defer.promise()
                


            sortTable: (e)->
                options = {}
                data_sort = $(e.target).attr 'data-sort';
                sort_by = data_sort.split '-'
                options.orderby = sort_by[1]
                options.order = $(e.target).attr 'data-order';

                @trigger "sort:textbooks", options


            onShow: ->
                @dimensions =
                    region: 'all'
                    recreation: 'all'
            #console.log @dimensions

            searchTextbooks: (e)=>
                    @$el.find '.anim250'
                    .removeClass 'visible-msg'
                    id =[]
                    searchStr = $('.search-box').val()
                    console.log searchStr
                #if searchStr
                    #@trigger 'before:search:textbook'
                    #console.log @collectionAll
                    @$el.find "#error-div"
                    .hide()
                    @$el.find '.progress-spinner'
                    .show()
                    #console.log 'original'
                    #console.log window.textbooksCollectionOrigninal
                    #console.log @collection
                    ###@dimensions.region = searchStr
                    #console.log @dimensions
                    $('#textbooks').mixitup('filter', [@dimensions.region, @dimensions.recreation])###
                    models = textbooksCollectionOrigninal.filter (model) ->
                        #console.log 'entered'
                        _.any model.attributes, (val, attr) ->
                            name = model.get('name')
                            nameL = model.get('name').toLowerCase()
                            n = name.search(searchStr)
                            m = nameL.search(searchStr)
                            #console.log n
                            #console.log m
                            n = n.toString()
                            m = m.toString()
                            if n != '-1' || m != '-1'
                                #console.log 'not -1'
                                id = model.get('term_id')
                                #console.log id
                                model.pick(id)
                            else
                                console.log "none found"
                    if models.length == 0
                        @$el.find '.anim250'
                        .addClass 'visible-msg'
                    @collection.reset(models)
                    #console.log @collection
                    @trigger 'search:textbooks', @collection
                    
                            #search = model.values().contains searchStr
                            #console.log search
                            #val.indexOf(search)
                    ###@collection.filter((model) ->
                        _.some _.values(model.pick('name')), (value) ->
                            console.log value.toLowerCase().indexOf(searchStr)
                    )###


                    @$el.find '.progress-spinner'
                    .hide()
                ###else
                    @$el.find "#error-div"
                    .show()###

            filterBooks: (e)=>
                #console.log '@dimensions'
                #console.log @dimensions
                $t = $(e.target).closest('li')
                dimension = $t.attr('data-dimension')
                filter = $t.attr('data-filter')
                filterString = @dimensions[dimension];


                if(filter == 'all')
                    if not $t.hasClass 'active'
                        $t.addClass('active').siblings().removeClass('active');
                        filterString = 'all';
                    else
                        $t.removeClass('active');
                        filterString = '';

                else
                    $t.siblings('[data-filter="all"]').removeClass('active');
                    filterString = filterString.replace('all', '');

                    if(!$t.hasClass('active'))
                        $t.addClass('active');
                        if filterString == ''
                            filterString = filter
                        else
                            filterString = filterString + ' ' + filter
                    else
                        $t.removeClass('active');
                        #console.log filter
                        #console.log filterString
                        re = new RegExp('(\\s|^)' + filter);
                        filterString = filterString.replace(re, '');

                @dimensions[dimension] = filterString;
                #@dimensions['region'] = 'Concepts-KG'
                #console.log @dimensions
                #console.info('dimension 1: ' + @dimensions.region);
                #console.info('dimension 2: ' + @dimensions.recreation);
                $('#textbooks').mixitup('filter', [@dimensions.region, @dimensions.recreation])

