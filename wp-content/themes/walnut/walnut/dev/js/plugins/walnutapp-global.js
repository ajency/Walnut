	//Global declarations for Synapse app
	//TODO: store the school domain as AJAX url.

	//Synapse AJAXURL $ SITEURL
	var AJAXURL = "";
	
	var SITEURL = "";

	//'videos' is initialized globally as 'html5Video' plugin loses scope of 
	// video source incase of more than 1 video.
	var videos = {};

	//CLASS_LABEL
	var CLASS_LABEL = [];
	for(var i =1; i<=15; i++){
		if(i===1)
			CLASS_LABEL[i] = "Nursery";

		else if(i===2)
			CLASS_LABEL[i] = "Junior KG";

		else if(i===3)
			CLASS_LABEL[i] = "Senior KG";

		else CLASS_LABEL[i] = 'Class '+(i-3);
	}

	//CHORUS_OPTIONS
	var CHORUS_OPTIONS = {
		'few' : 'Very Few',
		'one-fourth' : '1/4th of the Class',
		'half' : 'Half the Class',
		'three-fourth' : '3/4 the Class',
		'full' : 'Full Class'
	};