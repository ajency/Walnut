define ['app'
        'controllers/region-controller'
],(App,RegionController)->
    App.module 'AddTextbookPopup', (AddTextbookPopup,App)->

        class AddTextbookPopup.Controller extends RegionController

            initialize : (options)->
                #console.log options

                @view = @_addTextbookView options.collection 

                @show @view

                @listenTo @view, 'close:popup:dialog',->
                    @region.closeDialog()     

                @listenTo @view, 'save:textbook:data', (data)->
                    console.log AJAXURL
                    console.log data
                    url = AJAXURL + '?action=add-textbook'
                    $.ajax({
                        type : 'POST',
                        url : url,
                        data : data,
                        dataType: 'json',
                        async: true,
                        success :(response, textStatus, jqXHR)=>
                            console.log response


                });

                    



            _addTextbookView :(collection)=>
                new AddTextbookView
                    collection        : collection
                    #model        : @model
        class AddTextbookView extends Marionette.ItemView

            template: '<form>
                        <div class="row">
                            <div class="col-md-12">
                                Name:<br>
                                <input id="textname" name="textname" type="text" placeholder="Name" class="input-small span12">
                            </div><br>
                            <div class="col-md-12">
                                Classes suitable for:<br/>
                                {{#classes}}
                                <input style="width:20px" type="checkbox" name="textClass" value="{{id}}" class="class_checkbox">{{label}}<br>
                                {{/classes}}
                            </div><br>
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
                            <div class="col-md-12">
                                Author Name:<br>
                                <input id="authname" name="authname" type="text" placeholder="Author Name" class="input-small span12">
                            </div><br>
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" class="clear btn btn-success m-t-20 pull-left">Add Textbook</button>
                                    <div class=" p-l-10 p-t-30 pull-left success-msg"></div>
                                </div>
                            </div>
                        </div>
                    </form>'

            events:
                'click .btn-success'    : 'addTextbook'
                'change #texturl' : 'showImage'

            initialize:->
                @dialogOptions = 
                    modal_title : 'Add Textbook'
                    modal_size  : 'small'

            serializeData: ->
                data = super()
                #console.log data
                @model = @collection.models
                collection_classes = @collection.pluck 'classes'
                #console.log collection_classes

                data.classes=   _.chain collection_classes
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

                #console.log data
                data

            onShow: ->
                console.log 'onshow'

            showImage:->
                defer = $.Deferred()
                console.log 'image urlchnaged'
                textUrl = $('#texturl').val()
                console.log textUrl

                picture = $('input[name="texturl"]')[0].files[0]
                #data = new FormData()
                #data.append('file', picture)
                #console.log picture
                data = picture['name']
                console.log data
                url = AJAXURL + '?action=upload-text-image'
                console.log url
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
                #console.log @model
                class_ids=[]
                textbookName = $('#textname').val()
                if textbookName.trim() != ''
                    name = $('#textname').val()
                    slug = $('#textname').val()
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
                        parent : '-1'
                        description : desc
                        term_meta : 
                            author : authname
                        classes : class_ids                    

                    @trigger "save:textbook:data", data
                    #onAddTextbook

                else
                    @$el.find '#textname'
                    .addClass 'error'     
                    #console.log scheduleTo

            onAddTextbook:(response)->
                @$el.find '.success-msg'
                .html ''
                .removeClass 'text-success, text-error'

                if response.code is 'ERROR'
                    @$el.find '.success-msg'
                    .html 'Failed to save schedule'
                    .addClass 'text-error'

                else
                    @$el.find '.success-msg'
                    .html 'Saved Successfully'
                    .addClass 'text-success'

                    setTimeout =>
                        @trigger 'close:popup:dialog'
                    ,500

        App.commands.setHandler 'add:textbook:popup',(options)->
            new AddTextbookPopup.Controller options
