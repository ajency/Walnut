	//Global declarations for walnut app
	//TODO: store the school domain as AJAX url.
	var AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php";

	//var SITEURL = "http://www.walmiki.com/"
	var SITEURL = "";

	//CLASS_LABEL
	var CLASS_LABEL = [];
	for(var i =1; i<=13; i++){
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


