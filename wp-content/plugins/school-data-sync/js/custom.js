jQuery(document).ready(function() {

    jQuery("#sync-data").on('click',function(){
        var lastsync = jQuery(this).attr('data-lastsync');
        var lastsync_id = jQuery(this).attr('data-lastsync-id');
        var syncstatus = jQuery(this).attr('data-syncstatus');
        var filepath = jQuery(this).attr('data-file-path');
        var syncreference = jQuery(this);
	//alert(SERVER_AJAXURL);
        if(syncstatus == ''){
            init_school_data_sync(syncreference,lastsync_id,syncstatus);
        }
        else{
            resync_school_data_sync(syncreference,lastsync,syncstatus,filepath,lastsync_id);
        }
 
    });
    
    function init_school_data_sync(referer,lastsync_id,syncstatus){
      console.log(referer);
       jQuery.ajax({  
                type: 'GET',  
                url: SERVER_AJAXURL,  
                data: {  
                    action: 'sync-database',
                    blog_id: 15
                },  
                success: function(data, textStatus, XMLHttpRequest){  
                    //alert('Success: ' + data);
                    jQuery(referer).next().text('Local Sync started...');  
                    jQuery(referer).prop('disabled', true); 
                    //jQuery("#test-div1").append(data);  
                    school_data_sync_start(referer,lastsync_id,syncstatus,data)
                },  
                error: function(XMLHttpRequest, textStatus, errorThrown){  
                    console.log(errorThrown);  
                }  
	    }); 
    }
    
    function school_data_sync_start(referer,lastsync_id,syncstatus,respdata){
        
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
                   }          
        },'json');
        
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
                               jQuery(referer).next().text('Data Imported successfully!!');
                               jQuery(referer).prop('disabled', false);
                               jQuery(referer).val('Start');
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text('Data Import failed'); 
                               jQuery(referer).prop('disabled', false);
                   }          
        },'json');
        
    }
    
    function resync_school_data_sync(syncreference,lastsync,syncstatus,filepath,lastsync_id){
        jQuery(syncreference).prop('disabled', true); 
        if(syncstatus == 'downloaded'){
            school_data_sync_import(syncreference,lastsync_id);
        }
        else if(syncstatus == 'download-start'){
            data_sync_resume_download(syncreference,lastsync,syncstatus,filepath,lastsync_id);
        }
        else if(syncstatus == 'imported'){
            school_data_local_export(syncreference,lastsync,lastsync_id);
        }
        else if(syncstatus == 'export-local'){
            school_data_local_upload(syncreference,lastsync_id);
        }
        else if(syncstatus == 'transfered-server'){
            check_server_data_sync(syncreference,lastsync_id);
        }
        
        
    }
    
    function school_data_local_export(referer,lastsync,lastsync_id){
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
                               school_data_local_upload(referer,data.sync_request_id);
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text(data.status); 
                               jQuery(referer).prop('disabled', false);
                   }          
        },'json');
    }
    
    function school_data_local_upload(referer,sync_request_id){
        jQuery.post( ajaxurl,
        {
            action    : 'sds_data_sync_local_upload',
            sync_request_id : sync_request_id
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Local Data uploaded...').delay(250).text('Waiting For Server Sync..');
                               //school_data_local_upload(referer,data.sync_request_id);
                               jQuery(referer).attr( 'data-server-sync-id', data.sync_request_id );
                               check_server_data_sync(referer,sync_request_id);
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text(data.message); 
                               jQuery(referer).prop('disabled', false);
                   }          
        },'json');
    }
    
    function check_server_data_sync(referer,sync_request_id){
        referer.next().text('Checking server...');
        var syncstatus = referer.attr('data-syncstatus');
        var server_sync_id = referer.attr('data-server-sync-id');
        check_server_sync = setInterval(function()
                                {
                                  jQuery.get( SERVER_AJAXURL,
                                  {
                                    action    : 'check-app-data-sync-completion',
                                    blog_id : 15,
                                    sync_request_id:server_sync_id
                                  },
                                    function(data) { 
                                        console.log(data);
                                        if(data === true){ 
                                        jQuery(referer).next().text('Server Syncd...').delay(250).text('Initializing download..');
                                        init_school_data_sync(referer,sync_request_id,syncstatus);
                                        clearInterval(check_server_sync);
                                        }         
                                    },'json');  
                                
                                }, 10000);
    }
    
    
    
    //MEDIA SYNC FUNCTIONS
        jQuery("#sync-media").on('click',function(){

                jQuery(this).prop('disabled', true); 
                jQuery(this).next().text('Downloading images...');     
                var referer = jQuery(this);
                jQuery.post( ajaxurl,
                {
                    action    : 'sds_media_sync_images',
                    type : 'images'
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
                           }          
                },'json');
         
        });
        
        function sync_media_audios(referer){
            referer.next().text('Downloading Audio files...');
                jQuery.post( ajaxurl,
                {
                    action    : 'sds_media_sync_images',
                    type : 'audios'
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
                           }          
                },'json');
        }
        
        function sync_media_videos(referer){
            referer.next().text('Downloading Video files...');
                jQuery.post( ajaxurl,
                {
                    action : 'sds_media_sync_images',
                    type : 'videos'
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       jQuery(referer).next().text('Video files downloaded...').fadeOut(5000);
                                       jQuery(referer).prop('disabled', false);

                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       jQuery(referer).next().text(data.message).fadeOut(5000); 
                                       jQuery(referer).prop('disabled', false);
                           }          
                },'json');
        }        
    
});