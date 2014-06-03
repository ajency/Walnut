define ['underscore', 'jquery'], (_, $)->

	# Cordova local storage functions

    # save/get logged in user ID
    _.setUserID =(id)->
        window.localStorage.setItem("user_id", id)

    _.getUserID =->
        window.localStorage.getItem("user_id")


    # save/get logged in username
    _.setUserName =(name)->
        window.localStorage.setItem("user_name", name)

    _.getUserName =->
        window.localStorage.getItem("user_name")    


    # save/get blog id
    _.setBlogID =(id)->
        window.localStorage.setItem("blog_id", id)

    _.getBlogID =->
        window.localStorage.getItem("blog_id")


    # save/get blog name
    _.setBlogName =(name)->
        window.localStorage.setItem("blog_name", name)

    _.getBlogName =->
        window.localStorage.getItem("blog_name")


    # save/get school logo image source
    _.setSchoolLogoSrc =(src)->
        window.localStorage.setItem("school_logo_src", src)

    _.getSchoolLogoSrc =->
        window.localStorage.getItem("school_logo_src")


    # save/get Synapse assets directory path on SD Card
    _.setSynapseAssetsDirectoryPath =(path)->
        window.localStorage.setItem("synapse_directory_path", path)

    _.getSynapseAssetsDirectoryPath =->
        window.localStorage.getItem("synapse_directory_path")


    # save/get delete data from tables flag
    _.setDeleteDataFromTablesFlag = (flag)->
        window.localStorage.setItem("delete_tables_flag", flag)

    _.getDeleteDataFromTablesFlag = ->
        window.localStorage.getItem("delete_tables_flag")

        

    _.setFilePath =(path)->
        window.localStorage.setItem("filepath", ""+path)

    _.getFilePath =->
        window.localStorage.getItem("filepath")


    #save/get App sync dwnld time stamp
    _.setDwnldTimeStamp =(TimeStampValue)->
        window.localStorage.setItem("dwnld_time_stamp", ""+TimeStampValue)

    _.getDwnldTimeStamp =->
        window.localStorage.getItem("dwnld_time_stamp")   


    #save/get uri to dwnld from
    _.setDwnlduri =(uriValue)->
        window.localStorage.setItem("dwnldUri", ""+uriValue)

    _.getDwnlduri =->
        window.localStorage.getItem("dwnldUri")   

    #save/get uri to upload from
    _.setUploaduri =(uriValue)->
        window.localStorage.setItem("uploadUri", ""+uriValue)

    _.getUploaduri =->
        window.localStorage.getItem("uploadUridwnldUri")   


    #save/get total records
    _.setTotalRecords =(total)->
        window.localStorage.setItem("total_records", ""+total)

    _.getTotalRecords =->
        window.localStorage.getItem("total_records")   

    _.setFirstLogin =(valuesAll)->
        window.localStorage.setItem("loginValue", ""+valuesAll)

    _.getFirstLogin =->
         window.localStorage.getItem("loginValue") 

