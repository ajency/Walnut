define ['underscore'], ( _) ->


	#Check if directory 'SynapseAssets' exists on SD Card
    _.checkSynapseAssetsDirectory = ->

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
            ,(fileSystem)->
                fileSystem.root.getDirectory("SynapseAssets", {create: true, exclusive:false} 
                    ,(fileEntry)->
                        _.setSynapseAssetsDirectoryPath(fileEntry.toURL()+'/SynapseImages/')
                        console.log 'Full path: '+_.getSynapseAssetsDirectoryPath()
                    
                    ,(error)->
                        console.log 'ERROR: '+error
                    )

            ,_.fileSystemErrorHandler)