jQuery(document).ready(function() {
   jQuery('#add-division').on('click',function(){
        var divisioncount = jQuery('#division_count').val();
        divisioncount++;
        var classselectlist= get_class_dropdown(divisioncount); 
        var divisionrow ="<tr><td>"+classselectlist+"</td><td><input type='text' \n\
                        class='regular-text code' name='divisionlabel_"+divisioncount+"' \n\
                        id='divisionlabel_"+divisioncount+"' value=''/><input type='hidden' \n\
                        name='divisionid_"+divisioncount+"' id='divisionid_"+divisioncount+"' \n\
                        value=''/></td></tr>";
        jQuery("#blog-division-table").append(divisionrow);
        jQuery('#division_count').val(divisioncount);
        
   });
   
   jQuery('.delete_division').on('click',function(){
      var divsionid = jQuery(this).attr('id').split('_');
      var r = confirm("Are you sure you want to delete?.");
        if (r == false)
            return;
        
        jQuery(this).text('Deleting..');
        
        var self = jQuery(this);
        jQuery.post( ajaxurl,
        {
            action    : 'delete_school_division',
            division_id   : divsionid[2],      
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                       jQuery('#message').hide(); 
                       jQuery('.info').html(data.message);  
                        jQuery('.info').delay(800).show(0, function () {
                                jQuery('html, body').animate({scrollTop:jQuery('.info').offset().top - 2000}, 'slow');   
                                setTimeout(function () {
                                    jQuery('.info').hide();
                                }, 2000);
                        }); 
                       jQuery(self).closest("tr").remove();
                  
                   } else if(data.code === 'ERROR') {
                      jQuery('#message').hide(); 
                      jQuery('.info').html(data.message);  
                        jQuery('.info').delay(800).show(0, function () {
                                jQuery('html, body').animate({scrollTop:jQuery('.info').offset().top - 2000}, 'slow');   
                                setTimeout(function () {
                                    jQuery('.info').hide();
                                }, 2000);
                        }); 
                      jQuery(self).text('Delete');
                   }          
        },'json');    
   });
   
   function get_class_dropdown(i){
       var selectlist = "<select name='divisionclass_"+i+"' id='divisionclass_"+i+"'>";
       selectlist = selectlist+"<option value=''></option>";
       jQuery.each( CLASS_LABEL, function( key, value ) {
            selectlist = selectlist+"<option value='"+key+"'>"+value+"</option>";
        });
       selectlist = selectlist+"</select>";
       return selectlist;
   }
});