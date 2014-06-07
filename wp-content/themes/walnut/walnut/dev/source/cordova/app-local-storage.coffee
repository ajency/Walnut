define ['underscore'], ( _)->

	# Cordova local storage functions

    # save/get logged in user ID
    _.setUserID = (id)->
        window.localStorage.setItem("user_id", id)

    _.getUserID =->
        window.localStorage.getItem("user_id")


    # save/get logged in username
    _.setUserName = (name)->
        window.localStorage.setItem("user_name", name)

    _.getUserName = ->
        window.localStorage.getItem("user_name")    


    # save/get blog id
    _.setBlogID = (id)->
        window.localStorage.setItem("blog_id", id)

    _.getBlogID =->
        window.localStorage.getItem("blog_id")


    # save/get blog name
    _.setBlogName = (name)->
        window.localStorage.setItem("blog_name", name)

    _.getBlogName =->
        window.localStorage.getItem("blog_name")


    # save/get school logo image source
    _.setSchoolLogoSrc = (src)->
        window.localStorage.setItem("school_logo_src", src)

    _.getSchoolLogoSrc =->
        window.localStorage.getItem("school_logo_src")


    # save/get Synapse assets directory path on SD Card
    _.setSynapseAssetsDirectoryPath = (path)->
        window.localStorage.setItem("synapse_directory_path", path)

    _.getSynapseAssetsDirectoryPath = ->
        window.localStorage.getItem("synapse_directory_path")


    # save/get generated zip file path
    _.setGeneratedZipFilePath = (path)->
        window.localStorage.setItem("gererated_zip_file_path", path)

    _.getGeneratedZipFilePath =->
        window.localStorage.getItem("gererated_zip_file_path")


    # save/get downloaded zip file path
    _.setDownloadedZipFilePath = (path)->
        window.localStorage.setItem("downloaded_zip_file_path", path)

    _.getDownloadedZipFilePath =->
        window.localStorage.getItem("downloaded_zip_file_path")




    _.setFilePath =(path)->
        window.localStorage.setItem("filepath", ""+path)

    _.getFilePath =->
        window.localStorage.getItem("filepath")