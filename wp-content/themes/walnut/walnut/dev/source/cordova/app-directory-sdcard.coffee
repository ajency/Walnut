define ['underscore'], ( _) ->


	#Check if directory 'SynapseAssets' exists on SD Card
    _.checkSynapseAssetsDirectory = ->

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
            ,(fileSystem)->
                fileSystem.root.getDirectory("SynapseAssets", {create: false, exclusive:false} 
                    ,(fileEntry)->
                        $('#directory').text('Synapse Assets directory exists on SD Card')
                        _.setSynapseAssetsDirectoryPath(fileEntry.toURL()+'/SynapseImages/')
                        console.log 'Full path: '+_.getSynapseAssetsDirectoryPath()
                    
                    ,(error)->
                        $('#directory').text('Synapse Assets directory not found on SD Card')
                    )

            ,_.fileSystemErrorHandler)