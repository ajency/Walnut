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
                class_ids = @model.get 'classes'
                if class_ids
                    item_classes = _.sortBy(class_ids, (num)->
                        num)
                    class_string = ''
                    for class_id in item_classes
                        class_string += CLASS_LABEL[class_id]
                        class_string += ', ' if _.last(item_classes) != class_id

                    data.class_string = class_string;


                subjects = @model.get 'subjects'
                if subjects
                    item_subjects = _.sortBy subjects, (subject)->subject
                    subject_string = ''
                    for subject in item_subjects
                        subject_string += subject
                        subject_string += ', ' if _.last(item_subjects) != subject

                    data.subject_string = subject_string;

                data


        class EmptyView extends Marionette.ItemView

            template: notextbooksTpl

        class Views.ListView extends Marionette.CompositeView

            template: textbooksListTpl

            className: ''

            itemView: ListItemView

            emptyView: EmptyView

            itemViewContainer: 'ul.textbooks_list'

            serializeData: ->
                data = super()
                console.log @collection
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

                collection_subjects = @collection.pluck 'subjects'
                data_subjects = _.union _.flatten collection_subjects
                data.subjects = _.compact (_.sortBy(data_subjects, (num)->
                    num))

                data

            events:
                'click #Filters li': 'filterBooks' #(e)->  @trigger "filter:textbooks:class", $(e.target).closest('li').attr('data-filter')


            sortTable: (e)->
                options = {}
                data_sort = $(e.target).attr 'data-sort';
                sort_by = data_sort.split '-'
                options.orderby = sort_by[1]
                options.order = $(e.target).attr 'data-order';

                @trigger "sort:textbooks", options


            onShow: ->
                console.log 'onShow'
                @dimensions =
                    region: 'all'
                    recreation: 'all'
            #console.log @dimensions


            filterBooks: (e)=>
                console.log '@dimensions'
                console.log @dimensions
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
                        re = new RegExp('(\\s|^)' + filter);
                        filterString = filterString.replace(re, '');

                @dimensions[dimension] = filterString;

                console.info('dimension 1: ' + @dimensions.region);
                console.info('dimension 2: ' + @dimensions.recreation);
                $('#textbooks').mixitup('filter', [@dimensions.region, @dimensions.recreation])

