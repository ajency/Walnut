define ['underscore', 'jquery'], (_, $)->

	# Cordova local storage functions

    # save/get logged in user ID
    _.setUserID =(id)->
        window.localStorage.setItem("user_id", ""+id)

    _.getUserID =->
        window.localStorage.getItem("user_id")


    # save/get blog id
    _.setBlogID =(id)->
        window.localStorage.setItem("blog_id", ""+id)

    _.getBlogID =->
        window.localStorage.getItem("blog_id")


    # save/get blog name
    _.setBlogName =(name)->
        window.localStorage.setItem("blog_name", ""+name)

    _.getBlogName =->
        window.localStorage.getItem("blog_name")


    # save/get school logo image source
    _.setSchoolLogoSrc =(src)->
        window.localStorage.setItem("school_logo_src", ""+src)

    _.getSchoolLogoSrc =->
        window.localStorage.getItem("school_logo_src")


    # save/get Synapse assets directory path on SD Card
    _.setSynapseAssetsDirectoryPath =(path)->
        window.localStorage.setItem("synapse_directory_path", ""+path)

    _.getSynapseAssetsDirectoryPath =->
        window.localStorage.getItem("synapse_directory_path")


    # save/get initial app sync flag
    _.setInitialSyncFlag =(flag)->
        window.localStorage.setItem("initial_sync_flag", ""+flag)

    _.getInitialSyncFlag =->
        window.localStorage.getItem("initial_sync_flag")   


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


    #save/get App sync dwnld time stamp
    _.setTotalRecords =(total)->
        window.localStorage.setItem("total_records", ""+total)

    _.getTotalRecords =->
        window.localStorage.getItem("total_records")   

