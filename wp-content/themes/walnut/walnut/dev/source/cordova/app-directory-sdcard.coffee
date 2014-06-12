define ['underscore'], ( _) ->


    _.mixin

    	#Check if directory 'SynapseAssets' exists on SD Card
        checkSynapseAssetsDirectory : ->

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                ,(fileSystem)->
                    fileSystem.root.getDirectory("SynapseAssets", {create: false, exclusive:false} 
                        ,(fileEntry)->
                            _.setSynapseAssetsDirectoryPath(fileEntry.toURL()+'/SynapseImages/')
                            console.log 'Full path: '+_.getSynapseAssetsDirectoryPath()
                        
                        ,(error)->
                            console.log 'ERROR: '+error.code
                        )

                ,_.fileSystemErrorHandler)



        #Create 'SynapseAssets' directory
        createSynapseAssetsDirectory : ->

            runFunc = ->
                $.Deferred (d)->
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                        ,(fileSystem)->
                            fileSystem.root.getDirectory("SynapseAssets",{create: true, exclusive:false} 
                                
                                ,(fileEntry)->
                                    console.log 'SynapseAssets directory path: '+fileEntry.toURL()
                                    d.resolve fileEntry
                                
                                ,(error)->
                                    console.log 'ERROR: '+error.code
                                )

                        ,_.fileSystemErrorHandler)

            $.when(runFunc()).done ->
                console.log 'createSynapseAssetsDirectory done'
            .fail _.failureHandler



        #Create 'SynapseImages' directory inside 'SynapseAssets'
        createSynapseImagesDirectory : ->

            runFunc = ->
                $.Deferred (d)->
                    synapseAssetsDirectory = _.createSynapseAssetsDirectory()
                    synapseAssetsDirectory.done ->

                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                            ,(fileSystem)->
                                fileSystem.root.getDirectory("SynapseAssets/SynapseImages"
                                    ,{create: true, exclusive:false} 
                                    
                                    ,(fileEntry)->
                                        console.log 'SynapseImages directory path: '+fileEntry.toURL()
                                        d.resolve fileEntry
                                    
                                    ,(error)->
                                        console.log 'ERROR: '+error.code
                                    )

                            ,_.fileSystemErrorHandler)


            $.when(runFunc()).done ->
                console.log 'createSynapseImagesDirectory done'
            .fail _.failureHandler


        
        #Create 'SynapseData' directory inside 'SynapseAssets' for file sync operations
        createSynapseDataDirectory : ->

            runFunc = ->
                $.Deferred (d)->
                    synapseAssetsDirectory = _.createSynapseAssetsDirectory()
                    synapseAssetsDirectory.done ->

                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                            ,(fileSystem)->
                                fileSystem.root.getDirectory("SynapseAssets/SynapseData"
                                    ,{create: true, exclusive:false} 
                                    
                                    ,(fileEntry)->
                                        console.log 'SynapseData directory path: '+fileEntry.toURL()
                                        d.resolve fileEntry
                                    
                                    ,(error)->
                                        console.log 'ERROR: '+error.code
                                    )

                            ,_.fileSystemErrorHandler)

            $.when(runFunc()).done ->
                console.log 'createSynapseDataDirectory done'
            .fail _.failureHandler



        
        #Create directory structure inside 'SynapseImages' for media sync
        createDirectoryStructure : (path)->

            runFunc = ->
                $.Deferred (d)->

                    directoryPath = "SynapseAssets/SynapseImages"

                    synapseImagesDirectory = _.createSynapseImagesDirectory()
                    synapseImagesDirectory.done ->

                        directories = path.split('/')
                        directories.pop()

                        _.each directories, (directory, key)->

                            do(directory)->

                                directoryPath = directoryPath + '/' + directory 

                                createDirectory = _.createDirectoryBasedOnDirectoryPath directoryPath
                                createDirectory.done ->
                                    console.log 'Created directory: '+directory

                        d.resolve directories

            $.when(runFunc()).done ->
                console.log 'createDirectoryStructure done'
            .fail _.failureHandler



        createDirectoryBasedOnDirectoryPath : (directoryPath)->

            runFunc = ->
                $.Deferred (d)->
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                        ,(fileSystem)->
                            fileSystem.root.getDirectory(directoryPath ,{create: true, exclusive:false} 
                                
                                ,(fileEntry)->
                                    console.log 'Directory path: '+fileEntry.toURL()
                                    d.resolve fileEntry
                                
                                ,(error)->
                                    console.log 'ERROR: '+error.code
                                )

                        ,_.fileSystemErrorHandler)


            $.when(runFunc()).done ->
                console.log 'createDirectoryBasedOnDirectoryPath done'
            .fail _.failureHandler