define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->

	
	_.errorHandler =(error)->
		console.log("Error: "+error)

	_.createTables = (db) ->
		db.transaction( (transaction)->
			alert "create database"
			transaction.executeSql('CREATE TABLE IF NOT EXISTS newdata(id INTEGER PRIMARY KEY, division_id INTEGER ,collection_id INTEGER,teacher_id INTEGER, date VARCHAR, status TEXT)')

		,errorHandler
		,(data)->
			alert "Success"
			console.log 'Success create'
		)
		
		
	_.initDatabase =() -> 
		alert "initDatabase"
		DEMODB = window.openDatabase("DEMODB", "1.0", "DEMO Database", 500000)
		window.db = DEMODB
		createTables(window.db)

	_.prePopulate =(results1)->
		if results1.length==1
			allData = results1[0]
			console.log allData[0]
			id1=allData[0]
			divisionId=allData[1]
			collectionId=allData[2]
			teacherId=allData[3]
			date1=allData[4]
			status1=allData[5]
			

			window.db.transaction( (transaction)->
			 alert "insert"
			 transaction.executeSql("INSERT INTO newdata(id, division_id, collection_id, teacher_id, date, status) VALUES ('"+id1+"','"+divisionId+"','"+collectionId+"','"+teacherId+"','"+date1+"','"+status1+"')")
			 console.log  "INSERT INTO newdata(id, division_id, collection_id, teacher_id, date, status) VALUES ('"+id1+"','"+divisionId+"','"+collectionId+"','"+teacherId+"','"+date1+"','"+status1+"')"
			,errorHandler
			,(data)->
				console.log 'Success insert'

			)
			
			readValues();
			
			

	_.readValues=()->
		window.db.transaction( (transaction)->
			alert "SELECT"
			transaction.executeSql("SELECT * FROM newdata ", [], (transaction, results)->
				valuesAll = results.rows.length;
				console.log valuesAll
				if valuesAll == 0 
					console.log "No user found"
					#return;
				
				else
					
					i= 0
					while i < valuesAll
						row = results.rows.item(i)
						data = row.id
						data1 =results.rows.item(i).division_id
						data2 =results.rows.item(i).collection_id
						data3 =results.rows.item(i).teacher_id 
						data4 =results.rows.item(i).date
						data5 =results.rows.item(i).status
						console.log data
						console.log data1
						console.log data2
						console.log data3
						console.log data4
						console.log data5
						console.log i
						i++
						

										
			,errorHandler
				
			)
		)


			
		# window.db.transaction( (transaction)->
		# 	
		# 	                    size=0
		# 	                    for key in results
		# 	                     if results1.hasOwnProperty(key)
		# 	                      size++
		# 			    console.log "size is" +size
		# 			    return size
		# 	len = Object.length;
		# 	console.log "length is "+len
		# 	result = Object.length(results1)
		# 	console.log "Object valeuss"+result
		# 	alert Object.keys(results1)
		# 	### transaction.executeSql("INSERT INTO newdata(id, division_id, collection_id, teacher_id, date, status) VALUES (?,?,?,?,?,?)", [, ,, ]);###
		# 	###re = results.split(',')
		# 	console.log("remo"+re)		###		
		# )


	_.PageLoading =->
		alert "hello "
		window.requestFileSystem LocalFileSystem.PERSISTENT, 0, gotFS, fail
		initDatabase();



	_.fail =(error)->
		alert "error" 
		console.log "error"+error.code



	_.gotFS = (fileSystem)->
		alert "gotFS"
		fileSystem.root.getFile("StudentsLogs.txt", {create: true, exclusive: false}, gotFileEntry, fail);

	_.gotFileEntry = (fileEntry)->
		fileTransfer = new FileTransfer();
		uri = encodeURI "http://synapsedu.info/wp_35_training_logs.csv"
		filePath=fileEntry.toURL()
		#alert "filePath is" +filePath
		
		fileTransfer.download(
		    uri,
		    filePath,
		    (entry)->  
		    	alert "Downloaded"
		    	fileEntry.file(gotFile, fail)
		    	console.log "download complete: " + entry.fullPath
		    ,
		    (error)->
			    console.log "download error source " + error.source 
			    console.log "download error target " + error.target
			    console.log "upload error code" + error.code
			,true 
		   
		);

	_.gotFile =(file)->
		readAsText(file)

	_.readAsText = (file)-> 

	 reader = new FileReader();
	 reader.onloadend = (evt) ->
	  csvString = evt.target.result
	  results = $.parse(csvString, {
	  	
	  	header: false
	  	dynamicTyping: false
	  	step : (data, file, inputElem)->
	  		results1=data.results
	  		prePopulate(results1)
	  })
	 
	 reader.readAsText(file)


		
	 
		   



