define ['underscore'], (_)->

	#Cordova File System API 
    
    _.downloadSchoolLogo =(logo_url)->

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
            ,(fileSystem)->
                fileSystem.root.getFile("logo.jpg", {create: true, exclusive:false} 
                    ,(fileEntry)->
                        filePath = fileEntry.toURL().replace("logo.jpg", "")
                        fileEntry.remove()
                        uri = encodeURI(logo_url)

                        fileTransfer = new FileTransfer()
                        fileTransfer.download(uri, filePath+"logo.jpg" 
                            ,(file)->
                                console.log 'School logo download successful'
                                console.log 'Logo file source: '+file.toURL()
                                _.setSchoolLogoSrc(file.toURL())

                            ,_.fileTransferErrorHandler, true)
                    
                    ,_.fileErrorHandler)

            ,_.fileSystemErrorHandler)