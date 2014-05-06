var AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php"
//var AJAXURL = "http://www.walmiki.com/wp-admin/admin-ajax.php"

//var SITEURL = "http://www.walmiki.com/"
var SITEURL = ""

	//CLASS_LABEL
	CLASS_LABEL = []
	for(var i =1; i<=12; i++){
		if(i===1)
			CLASS_LABEL[i] = "Junior KG"

		else if(i===2)
			CLASS_LABEL[i] = "Senior KG"

		else CLASS_LABEL[i] = 'Class '+(i-2)
	}