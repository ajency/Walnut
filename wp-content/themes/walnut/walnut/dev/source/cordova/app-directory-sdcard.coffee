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

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                ,(fileSystem)->
                    fileSystem.root.getDirectory("SynapseAssets",{create: true, exclusive:false} 
                        
                        ,(fileEntry)->
                            console.log 'SynapseAssets directory path: '+fileEntry.toURL()
                        
                        ,(error)->
                            console.log 'ERROR: '+error.code
                        )

                ,_.fileSystemErrorHandler)


        
        #Create 'SynapseData' directory inside 'SynapseAssets' for file sync operations
        createSynapseDataDirectory : ->

            _.createSynapseAssetsDirectory()

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
                ,(fileSystem)->
                    fileSystem.root.getDirectory("SynapseAssets/SynapseData"
                        ,{create: true, exclusive:false} 
                        
                        ,(fileEntry)->
                            console.log 'SynapseData directory path: '+fileEntry.toURL()
                        
                        ,(error)->
                            console.log 'ERROR: '+error.code
                        )

                ,_.fileSystemErrorHandler)