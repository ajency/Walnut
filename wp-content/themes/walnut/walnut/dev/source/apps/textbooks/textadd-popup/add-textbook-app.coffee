define ['app'
        'controllers/region-controller'
        'apps/textbooks/textbook-single/textbookcontroller'
],(App,RegionController)->
    App.module 'AddTextbookPopup', (AddTextbookPopup,App)->

        class AddTextbookPopup.Controller extends RegionController

            initialize : (options)->
                #console.log options.collection

                @view = @_addTextbookView options.collection 

                @show @view

                @listenTo @view, 'close:popup:dialog',(collection)->
                    @region.reloadCollection(collection)
                    @region.closeDialog()     

                ###@listenTo @view, 'reload:collection', (collection)->
                    chaptersListView= new Single.Views.ChapterListView
                        collection: collection###
                                

                @listenTo @view, 'save:textbook:data', (data)->
                    #console.log AJAXURL
                    #console.log data
                    url = AJAXURL + '?action=add-textbook'
                    data = $.ajax({
                                type : 'POST',
                                url : url,
                                data : data,
                                dataType: 'json',
                                async: true,
                                success:(response) =>
                                    return response
                                ,

                        });
                    #console.log data

                    



            _addTextbookView :(collection)=>
                new AddTextbookView
                    collection        : collection
                    #model        : @model
        class AddTextbookView extends Marionette.ItemView

            template: '<form id="addTerm">
                        <div class="row">
                            <div class="col-md-12">
                                Name:<br>
                                <input id="textname" name="textname" type="text" placeholder="Name" class="input-small span12">
                                <input id="parent" name="parent" type="hidden" value="{{parent}}" class="input-small span12">
                            </div><br>
                            {{#noClasses}}
                            <div class="col-md-12 class_check">
                                Classes suitable for:<br/>
                                {{#class_data}}
                                <input style="width:20px" type="checkbox" name="textClass" value="{{id}}" class="class_checkbox">{{name}}<br>
                                {{/class_data}}
                            </div><br>
                            {{/noClasses}}
                            <div class="col-md-12">
                                Description:<br>
                                <textarea id="textdesc" name="textdesc" type="text" class="input-small span12"></textarea>
                            </div><br>
                            <!--div class="col-md-12">
                                Textbook Image Url<br>
                                <input id="texturl" name="texturl" type="file" class="input-small span12"><br>
                                <div id="progress" class="progress none">
                                     <img src="<?= site_url() ?>/wp-content/themes/walnut/images/loader.gif">
                                </div>
                                <img id="textImage" src="" height="200" alt="Image preview...">
                            </div><br-->
                            {{#noClasses}}
                            <div class="col-md-12">
                                Author Name:<br>
                                <input id="authname" name="authname" type="text" placeholder="Author Name" class="input-small span12">
                            </div><br>
                            {{/noClasses}}
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" class="clear btn btn-success m-t-20 pull-left m-l-15" >&nbsp;&nbsp;{{AddButton}}</button>
                                    <button type="button" class="clear btn btn-default m-t-20 m-l-20 pull-left" data-dismiss="modal" aria-hidden="true" class="close">Cancel</button>
                                    <div class=" p-l-10 p-t-30 pull-left success-msg p-r-10"></div>
                                </div>
                            </div>
                        </div>
                    </form>'

            regions:
                addTerm : "#addTerm"

            events:
                'click .btn-success'    : 'addTextbook'
                'change #texturl' : 'showImage'

            initialize:->
                #toAdd = 
                #console.log @collection
                if @collection.toAddText

                    if @collection.chapter_id &&  @collection.textbook_id
                        @dialogOptions = 
                            modal_title : 'Add Sub Section'
                            modal_size  : 'small'

                    else if @collection.textbook_id
                        @dialogOptions = 
                        modal_title : 'Add Section'
                        modal_size  : 'small'

                    else
                        @dialogOptions = 
                            modal_title : 'Add Chapter'
                            modal_size  : 'small'

                else
                    @dialogOptions = 
                        modal_title : 'Add Textbook'
                        modal_size  : 'small'

            serializeData: ->
                #console.log @collection
                if @collection.toAddText == 'true'
                    data = super()
                    @model = @collection.models
                    parent = @collection.parent
                    if parent == null || parent == '' || parent == undefined
                        parent = @model[0].get 'parent'

                    #console.log parent

                    data.parent = parent

                    if @collection.chapter_id &&  @collection.textbook_id
                            data.AddButton = 'Add Sub Section'


                    else if @collection.textbook_id
                        data.AddButton = 'Add Section'

                    else
                        data.AddButton = 'Add Chapter'
                    data
                else
                    data = super()
                    #console.log 'collection'
                    #console.log @collection.class_ids
                    classes = @collection.class_ids

                    
                    data.class_data = classes.map (item, i)->
                                            classes_data=[]
                                            classes_data.id = item
                                            if item == '1'
                                                classes_data.name = 'Nursery'
                                            else if item == '2'
                                                classes_data.name = 'Junior KG'
                                            else if item == '3'
                                                classes_data.name = 'Senior KG'
                                            else
                                                val = item-3
                                                classes_data.name ='Class '+val

                                            classes_data
                    #console.log class_data

                    @model = @collection.models
                    collection_classes = @collection.pluck 'classes'
                    #console.log collection_classes

                    ###data.classes=   _.chain collection_classes
                                    .flatten()
                                    .union()
                                    .compact()
                                    .sortBy (num)-> parseInt num
                                    .map (m)->
                                        classes=[]
                                        classes.slug = _.slugify CLASS_LABEL[m]
                                        classes.label = CLASS_LABEL[m]
                                        classes.id = m
                                        classes
                                    .value()
                    console.log data.classes###
                    data.noClasses = true
                    data.parent = '-1'
                    data.AddButton = 'Add Textbook'
                    #console.log data
                    data              


            onShow: ->
                console.log 'onshow'

            showImage:->
                defer = $.Deferred()
                #console.log 'image urlchnaged'
                textUrl = $('#texturl').val()
                #console.log textUrl

                picture = $('input[name="texturl"]')[0].files[0]
                #data = new FormData()
                #data.append('file', picture)
                #console.log picture
                data = picture['name']
                #console.log data
                url = AJAXURL + '?action=upload-text-image'
                #console.log url
                $.ajax({
                        type : 'POST',
                        url : url,
                        data : data,
                        dataType: 'json',
                        async: true,
                        success :(response, textStatus, jqXHR)=>
                            console.log response


                });
                #console.log picture

                image =  document.getElementById("textImage")                
                image.src = textUrl
                ###if textUrl.files[0]
                    console.log 'inside'
                    reader = new FileReader();
                    reader.onload = imageIsLoaded;
                    reader.readAsDataURL(textUrl.files[0]);###



            addTextbook: (e)=>
                #console.log @collection
                models = @collection.models
                class_ids=[]
                textbookName = $('#textname').val()
                checkedBoxes = @$el.find('input:checked');

                if @collection.toAddText == 'true'
                    if textbookName.trim() != ''
                        name = $('#textname').val()
                        slug = $('#textname').val()
                        parent = $('#parent').val()
                        #console.log parent
                        #textUrl = $('#texturl').val()
                        #class_ids = $('.class_checkbox').val()
                        #checkboxes = document.getElementsByName('textClass');
                        checkedBoxes = @$el.find('input:checked');
                        class_ids = _.chain checkedBoxes
                                        .flatten(true)
                                        .pluck('value')
                                        .value();

                        desc = $('#textdesc').val()
                        authname = $('#authname').val()

                        data = 
                            action : 'add-tag'
                            taxonomy : 'textbook'
                            post_type : 'content-piece'
                            'tag-name' : name
                            slug : slug
                            parent : parent
                            description : desc
                            term_meta : 
                                author : authname
                            classes : class_ids                    

                        @trigger "save:textbook:data", data

                        @$el.find '.success-msg'
                        .html ''
                        .removeClass 'text-success, text-error'

                        @$el.find '.success-msg'
                        .html 'Saved Successfully'
                        .addClass 'text-success'

                        #console.log @collection
    
                        setTimeout =>
                            @trigger 'close:popup:dialog', @collection
                        ,600
                                         
                    else
                        @$el.find '#textname'
                        .addClass 'error'     
                        #console.log scheduleTo
                else
                    @$el.find '.class-error'
                        .html ''
                        .removeClass 'error'

                    @$el.find '#textname'
                        .html ''
                        .removeClass 'error'

                    class_ids = _.chain checkedBoxes
                                .flatten(true)
                                .pluck('value')
                                .value();
                    #console.log class_ids
                    if textbookName.trim() != '' && class_ids.length > 0
                        name = $('#textname').val()
                        slug = $('#textname').val()
                        parent = $('#parent').val()
                        #console.log parent
                        #textUrl = $('#texturl').val()
                        #class_ids = $('.class_checkbox').val()
                        #checkboxes = document.getElementsByName('textClass');
                        checkedBoxes = @$el.find('input:checked');
                        class_ids = _.chain checkedBoxes
                                        .flatten(true)
                                        .pluck('value')
                                        .value();

                        desc = $('#textdesc').val()
                        authname = $('#authname').val()

                        data = 
                            action : 'add-tag'
                            taxonomy : 'textbook'
                            post_type : 'content-piece'
                            'tag-name' : name
                            slug : slug
                            parent : parent
                            description : desc
                            term_meta : 
                                author : authname
                            classes : class_ids                    

                        @trigger "save:textbook:data", data

                        @$el.find '.success-msg'
                        .html ''
                        .removeClass 'text-success, text-error'

                        @$el.find '.success-msg'
                        .html 'Saved Successfully'
                        .addClass 'text-success'

                        #console.log @collection
    
                        setTimeout =>
                            @trigger 'close:popup:dialog', @collection
                        ,600
                                         
                    else
                        if textbookName.trim() == ''
                            @$el.find '#textname'
                            .addClass 'error'
                        if class_ids.length <= 0
                            @$el.find '.class_check'
                            .after '<p class="class-error error m-l-20 m-t-10">Please select classes</p>'


                

        App.commands.setHandler 'add:textbook:popup',(options)->
            new AddTextbookPopup.Controller options
