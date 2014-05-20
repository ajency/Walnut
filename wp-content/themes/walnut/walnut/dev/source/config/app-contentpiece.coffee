define ['underscore', 'unserialize'], ( _) ->

    #Code specific to loading of content-pieces in walnut app

    _.mixin

        #Get author name
        getPostAuthorName : (post_author_id) ->

            postAuthorName = ''
            
            runQuery = ->
                $.Deferred (d)->
                    _.db.transaction (tx)->
                        tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?" 
                            , [post_author_id], success(d), _.deferredErrorHandler(d))

            success = (d)->
                (tx, data)->
                    if data.rows.length isnt 0
                        postAuthorName = data.rows.item(0)['display_name']

                    d.resolve postAuthorName
                    
            $.when(runQuery()).done ->
                console.log 'getPostAuthorName transaction completed'
            .fail _.failureHandler




        getRowElements : (element)->

            console.log 'element'
            console.log element



                


        getJsonToClone : (layout_json)->

            for key in layout_json
                if key.element is 'Text'
                    key['columncount'] = layout_json.length
                    d2 = _.getRowElements layout_json




        callFunc : (layout_json)->
            _.getJsonToClone(layout_json)