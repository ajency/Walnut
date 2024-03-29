/**
 * This is the main javascript file for the CSV Import plugin's main administration view.
 *
 * This includes the header, options, and other information that should provide
 * The User Interface to the end administrator.
 *
 * @package   csv-import
 * @author    Team Ajency <talktous@ajency.in>
 * @license   GPL-2.0+
 * @link      http://ajency.in
 * @copyright 7-24-2014 Ajency.in
 */

(function ($) {
	"use strict";

	$(function () {
		// Place your administration-specific JavaScript here
        jQuery('#textbook_list').on('change', function(){
            var id_text = jQuery(this).val();
            jQuery('#hiddenTextId').val(id_text);
        });

        /*jQuery('#template_export').click(function(){
            //alert("clicked");
            var id_text = jQuery('#hiddenTextId').val();
            if(id_text == '-1'){
              jQuery("#invalidText").html('Please select a textbook to export');     
            }else{
              jQuery("#invalidText").html('');
            jQuery.post(ajaxurl, 
              {
                action : 'generate-excel',
                data : id_text,
              }, function(result){
               name = result['name'];
                window.location.href='question_upload.xls';
              });
            }
          });*/


          jQuery('#template_export').click(function(){
            //alert("clicked");
            var id_text = jQuery('#hiddenTextId').val();
            if(id_text == '-1'){
              jQuery("#invalidText").html('Please select a textbook to export');     
            }else{
              window.open(jQuery(location).attr('href')+'&import_id='+id_text);
            }
          });



            jQuery("#import-csv-start").on('click',function(){
                 jQuery(this).prop('disabled', true); 
                 jQuery("#log_view").html('Please Wait Import in progress..'); 
                 var csv_id = jQuery('#csv-master-id').val();
                 var _this = jQuery(this);
                 var check_csv_import_progress = setInterval(function()
                              {
                                jQuery.post( ajaxurl,
                                {
                                  action    : 'ajci_csv_check_progress',
                                  csv_id    : csv_id
                                },
                                function(data) { 
                                  if(data.code ==='ERROR'){
                                      jQuery(_this).prop('disabled', false);
                                      jQuery("#log_view").html('Error CSV file already imported!!');                                      
                                      clearInterval(check_csv_import_progress);
                                  }else{
                                        if(data.totalparts == data.totalcompleted){ 
                                            jQuery(_this).prop('disabled', false);
                                            var logstable = '<table>';
                                            if(data.log_paths.success != ''){
                                                logstable = logstable+'<tr><td>Successfull Import</td><td><a href="'+data.log_paths.success+'" target="_blank">View Log</a></td></tr>';
                                            }
                                            if(data.log_paths.error != ''){
                                                logstable = logstable+'<tr><td>Failed Import</td><td><a href="'+data.log_paths.error+'" target="_blank">View Log</a></td></tr>';
                                            }
                                            logstable = logstable+'</table>';
                                            jQuery("#log_view").html(data.totalcompleted+' parts out of '+data.totalparts+' completed'+logstable); 
                                            clearInterval(check_csv_import_progress);
                                        }else{
                                            jQuery("#log_view").html(data.totalcompleted+' parts out of '+data.totalparts+' completed'); 
                                        } 
                                    }
                                },'json');  

                              }, 5000);                         

            });
                

	});
}(jQuery));