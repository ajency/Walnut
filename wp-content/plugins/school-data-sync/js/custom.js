

jQuery(document).ready(function() {
    

    jQuery("#validate-blog-sync-user").on('click',function(){

        data ={}
        data['txt_blog_id'] = jQuery.trim(jQuery('#validate_sync_school_user #validate_blog_id').val())
        data['txtpassword'] = jQuery('#validate_sync_school_user #validate_pwd').val()

        if(data['txtpassword']==''){
          jQuery('#validate_sync_school_user .error_msg').html('Invalid password');
          return false
        }


        formData= {}
        formData['data'] = data

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl+'?action=sds-auth-sync-user',
            data: formData,
            success: function(data, textStatus, XMLHttpRequest){
                data = jQuery.parseJSON(data);
              if(! data.status){
                jQuery('#validate_sync_school_user .error_msg').html('Invalid password');
              }
              else{
                insert_sync_cookies_in_options_table(data);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

            }
        });

    });

    jQuery("#reset-passwrd-button").on('click',function(){
    
        data ={}
        data['txt_blog_id'] = jQuery.trim(jQuery('#sync-data').attr('data-blog-id'))
        data['txtpassword'] = jQuery('#reset-sync-password').val()

        if(data['txtpassword']==''){
          jQuery('#reset-passwrd-block .status-msg').html('Invalid password');
          return false
        }


        formData= {}
        formData['data'] = data

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl+'?action=sds-auth-sync-user',
            data: formData,
            success: function(data, textStatus, XMLHttpRequest){
                data = jQuery.parseJSON(data);
              if(! data.status){
                jQuery('#reset-passwrd-block .status-msg').html('Invalid password');
              }
              else{
                jQuery('#reset-passwrd-block .status-msg').html('Password Validated');
                insert_sync_cookies_in_options_table(data);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

            }
        });

    });
    
    jQuery("#sync-data").on('click',function(){
        var lastsync = jQuery(this).attr('data-lastsync');
        var lastsync_id = jQuery(this).attr('data-lastsync-id');
        var syncstatus = jQuery(this).attr('data-syncstatus');
        var filepath = jQuery(this).attr('data-file-path');
        var blog_id = jQuery(this).attr('data-blog-id');
        var syncreference = jQuery(this);
	//alert(SERVER_AJAXURL);
        if(syncstatus == ''){
            init_school_data_sync(syncreference,lastsync_id,syncstatus,blog_id);
        }
        else{
            resync_school_data_sync(syncreference,lastsync,syncstatus,filepath,lastsync_id,blog_id);
        }
 
    });
    

    function insert_sync_cookies_in_options_table(response_data){

      jQuery.post( ajaxurl,
        {
            action          : 'save_standalone_school_sync_cookies',
            cookie_name     : response_data.logged_in_cookie_key,
            cookie_value    : response_data.logged_in_cookie_value,
        },
        function(data) {           
            if(data.success)
                location.reload();
            else 
              console.log('error saving cookie data in database');
                        
        },'json');

    }

    function insert_blogid_in_options_table(blog_id){

      jQuery.post( ajaxurl,
        {
            action    : 'save_standalone_school_blogid',
            blog_id  : blog_id
        },
        function(data) {           
            if(data.blog_id)
                location.reload();
            else 
              console.log('error inserting blogid in database');
                        
        },'json');

    }
    
    function init_school_data_sync(referer,lastsync_id,syncstatus,blog_id,last_sync){
      console.log(referer);
      var login_cookie_name = jQuery('#login_cookie_name').val();
      var login_cookie_value = jQuery('#login_cookie_value').val();
       jQuery('#sync-media').prop('disabled', true);
       jQuery.ajax({  
                type: 'POST',  
                url: ajaxurl,  
                data: {  
                    action: 'sync-local-database',
                    blog_id: blog_id,
                    last_sync: last_sync,
                    device_type: 'standalone',
                    login_cookie_name: login_cookie_name,
                    login_cookie_value: login_cookie_value
                },  
                success: function(data, textStatus, XMLHttpRequest){  
                    //alert('Success: ' + data);
                    var data = jQuery.parseJSON( data ); 
                    jQuery(referer).next().text('Local Sync started...'); 
                    //jQuery("#test-div1").append(data);  
                    school_data_sync_start(referer,lastsync_id,syncstatus,data)
                },  
                error: function(XMLHttpRequest, textStatus, errorThrown){  
                    console.log(errorThrown);  
                    jQuery('#sync-media').prop('disabled', false);
                    jQuery(referer).prop('disabled', false); 
                }  
	    }); 
    }
    
    function school_data_sync_start(referer,lastsync_id,syncstatus,respdata){
        //console.log(respdata)
        if(respdata.blog_expired){
            /// code logic to delete site content
            jQuery.post( ajaxurl,
            {
                action    : 'sds_delete_blog_content'
            },
            function(data) {           
                       if(data.code === 'OK'){ 
                                   jQuery(referer).next().text('Blog Validity Expired'); 
                                   jQuery(referer).prop('disabled', false);
                                   jQuery('#sync-media').prop('disabled', false);

                       }       
            },'json');    
        }
        else{
            jQuery.post( ajaxurl,
            {
                action    : 'sds_data_sync_start',
                filepath  : respdata.exported_csv_url,
                last_sync : respdata.last_sync,
                lastsync_id : lastsync_id,
                syncstatus : syncstatus
            },
            function(data) {           
                       if(data.code === 'OK'){ 
                                   jQuery(referer).next().text('File downloaded...');
                                   school_data_sync_import(referer,data.sync_request_id)


                       } else if(data.code === 'ERROR') {
                                   //alert('error');
                                   jQuery(referer).next().text('File download failed'); 
                                   jQuery(referer).prop('disabled', false);
                                   jQuery('#sync-media').prop('disabled', false);
                       }          
            },'json');            
        }
        
    }
    
     function data_sync_resume_download(referer,lastsync,syncstatus,filepath,lastsync_id){
        referer.next().text('Downloading Data...');
        jQuery.post( ajaxurl,
        {
            action    : 'sds_data_sync_start',
            filepath  : filepath,
            last_sync : lastsync,
            lastsync_id : lastsync_id,
            syncstatus : syncstatus
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('File downloaded...');
                               school_data_sync_import(referer,data.sync_request_id)
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text('File download failed'); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                   }          
        },'json');
        
    }
    
    function school_data_sync_import(referer,sync_request_id){
        referer.next().text('Importing Data...');
        jQuery.post( ajaxurl,
        {
            action    : 'sds_data_sync_import',
            sync_id   : sync_request_id,
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Sync completed! You now have all the recent updates');
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                               jQuery(referer).val('Start');
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text('Data Import failed'); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                   }          
        },'json');
        
    }
    
    function resync_school_data_sync(syncreference,lastsync,syncstatus,filepath,lastsync_id,blog_id){
        jQuery(syncreference).prop('disabled', true);
        jQuery('#sync-media').prop('disabled', true);
        if(syncstatus == 'downloaded'){
            school_data_sync_import(syncreference,lastsync_id);
        }
        else if(syncstatus == 'download-start'){
            data_sync_resume_download(syncreference,lastsync,syncstatus,filepath,lastsync_id);
        }
        else if(syncstatus == 'imported'){
            school_data_local_export(syncreference,lastsync,lastsync_id,blog_id);
        }
        else if(syncstatus == 'export-local'){
            school_data_local_upload(syncreference,lastsync_id);
        }
        else if(syncstatus == 'transfered-server'){
            check_server_data_sync(syncreference,lastsync_id,blog_id);
        }
        
        
    }
    
    function school_data_local_export(referer,lastsync,lastsync_id,blog_id){
        referer.next().text('Exporting local data...');
        jQuery.post( ajaxurl,
        {
            action    : 'sds_data_sync_local_export',
            last_sync : lastsync
            
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Local Data exported...');
                               jQuery(referer).attr('data-lastsync-id',data.sync_request_id);
                               jQuery(referer).attr('data-syncstatus',data.status);
                               if(data.status == 'export-not-required'){
                                    //school_data_local_upload(referer,data.sync_request_id,blog_id,lastsync);
                                    init_school_data_sync(referer,data.sync_request_id,data.status,blog_id,lastsync);

                               }
                               else{
                                   school_data_local_upload(referer,data.sync_request_id,blog_id,lastsync);
                               }
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text(data.status); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                   }          
        },'json');
    }
    
    function school_data_local_upload(referer,sync_request_id,blog_id,last_sync){
        
      var login_cookie_name = jQuery('#login_cookie_name').val();
      var login_cookie_value = jQuery('#login_cookie_value').val();
        jQuery.post( ajaxurl,
        {
            action    : 'sds_data_sync_local_upload',
            sync_request_id : sync_request_id,
            blog_id         : blog_id,
            login_cookie_name : login_cookie_name,
            login_cookie_value : login_cookie_value
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Local Data uploaded...').delay(250).text('Waiting For Server Sync..');
                               //school_data_local_upload(referer,data.sync_request_id);
                               jQuery(referer).attr( 'data-server-sync-id', data.sync_request_id );
                               check_server_data_sync(referer,sync_request_id,blog_id,last_sync);
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text(data.message); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                   }          
        },'json');
    }
    
    function check_server_data_sync(referer,sync_request_id,blog_id,last_sync){
        referer.next().text('Checking server...');
        var syncstatus = referer.attr('data-syncstatus');
        var server_sync_id = referer.attr('data-server-sync-id');
        var login_cookie_name = jQuery('#login_cookie_name').val();
        var login_cookie_value = jQuery('#login_cookie_value').val();      
        
        check_server_sync = setInterval(function()
                                {
                                  jQuery.post( ajaxurl,
                                  {
                                    action    : 'check-server-app-data-sync-completion',
                                    blog_id :blog_id,
                                    sync_request_id:server_sync_id,
                                    login_cookie_name : login_cookie_name,
                                    login_cookie_value : login_cookie_value
                                  },
                                    function(data) { 
                                        var data = jQuery.parseJSON( data );
                                        console.log(data);
                                        if(data === true){ 
                                        jQuery(referer).next().text('Server Syncd...').delay(250).text('Initializing download..');
                                        init_school_data_sync(referer,sync_request_id,syncstatus,blog_id,last_sync);
                                        clearInterval(check_server_sync);
                                        }         
                                    },'json');  
                                
                                }, 10000);
    }
    
    
    
    //MEDIA SYNC FUNCTIONS
        jQuery("#sync-media").on('click',function(){

                jQuery(this).prop('disabled', true); 
                jQuery('#sync-data').prop('disabled', true);
                jQuery(this).next().text('Downloading images...');     
                var referer = jQuery(this);
                var login_cookie_name = jQuery('#login_cookie_name').val();
                var login_cookie_value = jQuery('#login_cookie_value').val();
                jQuery.post( ajaxurl,
                {
                    action    : 'sds_media_sync',
                    type : 'images',
                    login_cookie_name : login_cookie_name,
                    login_cookie_value : login_cookie_value
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       referer.next().text('Image files downloaded...');
                                       //school_data_local_upload(referer,data.sync_request_id);
                                       setTimeout(function() {
                                            sync_media_audios(referer);
                                        }, 2000);
                                       //sync_media_audios(referer);


                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       referer.next().text(data.message); 
                                       referer.prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                           }          
                },'json');
         
        });
        
        function sync_media_audios(referer){
            referer.next().text('Downloading Audio files...');
                jQuery.post( ajaxurl,
                {
                    action    : 'sds_media_sync',
                    type : 'audios',
                    login_cookie_name : login_cookie_name,
                    login_cookie_value : login_cookie_value
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       jQuery(referer).next().text('Audio files downloaded...');
                                       //school_data_local_upload(referer,data.sync_request_id);
                                       setTimeout(function() {
                                            sync_media_videos(referer);
                                        }, 2000);
                                       //sync_media_videos(referer);


                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       jQuery(referer).next().text(data.message); 
                                       jQuery(referer).prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                           }          
                },'json');
        }
        
        function sync_media_videos(referer){
            referer.next().text('Downloading Video files...');
                jQuery.post( ajaxurl,
                {
                    action : 'sds_media_sync',
                    type : 'videos',
                    login_cookie_name : login_cookie_name,
                    login_cookie_value : login_cookie_value
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       jQuery(referer).next().text('Video files downloaded...').fadeOut(1000,function(){
                                           jQuery(referer).next().text('Media Sync Completed!').fadeIn(1000);
                                       });
                                       jQuery(referer).prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);

                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       jQuery(referer).next().text(data.message).fadeOut(5000); 
                                       jQuery(referer).prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                           }          
                },'json');
        }        
    
});