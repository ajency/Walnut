define ['underscore'], ( _) ->

	#Media sync 

	_.mixin


		getListOfMediaFilesFromLocalDirectory : ->

			setTimeout(=>

				_.downloadMediaFiles()
	
			,3000)


		downloadMediaFiles : ->

			$('#syncMediaSuccess').css("display","block").text("Contacting server...")

