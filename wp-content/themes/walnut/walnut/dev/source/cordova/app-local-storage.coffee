define ['underscore'], ( _)->

	# Cordova local storage functions

    # save/get logged in user ID
    _.setUserID = (id)->
        window.localStorage.setItem("user_id", id)

    _.getUserID = ->
        window.localStorage.getItem("user_id")


    # save/get logged in username
    _.setUserName = (name)->
        window.localStorage.setItem("user_name", name)

    _.getUserName = ->
        window.localStorage.getItem("user_name")    


    # save/get blog id
    _.setBlogID = (id)->
        window.localStorage.setItem("blog_id", id)

    _.getBlogID = ->
        window.localStorage.getItem("blog_id")


    # save/get blog name
    _.setBlogName = (name)->
        window.localStorage.setItem("blog_name", name)

    _.getBlogName = ->
        window.localStorage.getItem("blog_name")


    # save/get school logo image source
    _.setSchoolLogoSrc = (src)->
        window.localStorage.setItem("school_logo_src", src)

    _.getSchoolLogoSrc = ->
        window.localStorage.getItem("school_logo_src")


    # save/get generated zip file path
    _.setGeneratedZipFilePath = (path)->
        window.localStorage.setItem("gererated_zip_file_path", path)

    _.getGeneratedZipFilePath = ->
        window.localStorage.getItem("gererated_zip_file_path")


    # save/get 'SynapseMedia' directory path
    _.setSynapseMediaDirectoryPath = (path)->
        window.localStorage.setItem("synapse_media_directory_path", path)

    _.getSynapseMediaDirectoryPath = ->
        window.localStorage.getItem("synapse_media_directory_path")


    # save/get sync request id
    _.setSyncRequestId = (id)->
        window.localStorage.setItem("sync_request_id", id)

    _.getSyncRequestId = ->
        window.localStorage.getItem("sync_request_id")



    _.setFilePath =(path)->
        window.localStorage.setItem("filepath", ""+path)

    _.getFilePath = ->
        window.localStorage.getItem("filepath")