define ['app'
        'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], (App, contentListTpl, listitemTpl, notextbooksTpl)->
    App.module "ContentPiecesApp.ContentList.Views", (Views, App)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td>{{post_excerpt}}</td>
                        <td>{{post_author_name}}</td>
                        <td>{{modified_date}}</td>
                        <td><a target="_blank" href="{{view_url}}">View</a> |
                            <a target="_blank" href="{{edit_url}}">Edit</a></td>'

            serializeData:->
                data= super()
                data.modified_date= moment(@model.get('post_modified')).format("Do MMM YYYY")
                data.view_url = SITEURL + '/#content-piece/'+@model.get 'ID'
                data.edit_url = SITEURL + '/content-creator/#edit-content/'+@model.get 'ID'
                data

        class EmptyView extends Marionette.ItemView

            template: 'No content pieces available'

        class Views.ListView extends Marionette.CompositeView

            template: contentListTpl

            className: 'tiles white grid simple vertical green'

            itemView: ListItemView

            emptyView: EmptyView

            itemViewContainer: '#list-content-pieces'

            events:
                'change .filters': 'filterTableData'
                'change #textbooks-filter': 'changeTextbooks'
                'change #chapters-filter': (e)->
                    @trigger "fetch:sections:subsections", $(e.target).val()

            onShow:->
                $ "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter"
                .select2();

                $('#content-pieces-table').tablesorter();

                pagerOptions =
                    container: $(".pager"),
                    output: '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions


            changeTextbooks: (e)=>

                @$el.find '#chapters-filter, #sections-filter, #subsections-filter'
                .select2 'data', ''

                @trigger "fetch:chapters", $(e.target).val()

            onFetchChaptersComplete: (chapters)->

                if _.size(chapters) > 0

                    $ '#chapters-filter'
                    .select2 'data', {'text':'Select Chapter'}

                    _.each chapters.models, (chap, index)=>
                        @$el.find '#chapters-filter'
                        .append '<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>'

                else
                    @$el.find '#chapters-filter,#sections-filter,#subsections-filter'
                    .html ''

                    @$el.find '#chapters-filter'
                    .select2 'data', 'text': 'No chapters'

                    @$el.find '#sections-filter'
                    .select2 'data', 'text': 'No Sections'

                    @$el.find '#subsections-filter'
                    .select2 'data', 'text': 'No Subsections'

            onFetchSubsectionsComplete: (allsections)->
                if _.size(allsections) > 0

                    if _.size(allsections.sections) > 0

                        $ '#sections-filter'
                        .select2 'data', {'text':'Select Section'}

                        _.each allsections.sections, (section, index)=>

                            @$el.find '#sections-filter'
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'

                    else
                        $ '#sections-filter'
                        .select2 'data', 'text': 'No Sections'
                        .html ''

                    if _.size(allsections.subsections) > 0

                        $ '#subsections-filter'
                        .select2 'data', {'text':'Select SubSection'}

                        _.each allsections.subsections, (section, index)=>
                            @$el.find '#subsections-filter'
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'

                    else
                        $ '#subsections-filter'
                        .select2 'data', 'text': 'No Subsections'
                        .html ''

                else
                    $('#sections-filter,#subsections-filter')
                    .html ''

                    $ '#sections-filter'
                    .select2 'data', 'text': 'No Sections'

                    $ '#subsections-filter'
                    .select2 'data', 'text': 'No Subsections'



            filterTableData: (e)=>

                filter_ids=_.map @$el.find('select.textbook-filter'), (ele,index)->
                    item = ''
                    if not isNaN ele.value
                        item= ele.value
                    item
                filter_ids= _.compact filter_ids

                content_type = @$el.find('#content-type-filter').val()

                fullCollection= Marionette.getOption @,'fullCollection'

                filtered_data= fullCollection.models

                if content_type isnt ''
                    filtered_data = fullCollection.where 'content_type': content_type

                if _.size(filter_ids)>0
                    filtered_data = _.filter filtered_data, (item)=>
                        filtered_item=''
                        term_ids= _.flatten item.get 'term_ids'
                        if _.size(_.intersection(term_ids, filter_ids)) == _.size(filter_ids)
                            filtered_item=item
                        filtered_item




                @collection.set filtered_data
                console.log @collection


                $("#content-pieces-table").trigger "updateCache"
                pagerOptions =
                    container: $(".pager"),
                    output: '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions

