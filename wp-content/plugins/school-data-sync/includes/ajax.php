<?php
function ajax_sds_data_sync_start() {
    global $wpdb;
    $last_sync = $_POST['last_sync'];
    $file_path = $_POST['filepath'];
    $sync_id = $_POST['lastsync_id'];
    $syncstatus = $_POST['syncstatus'];
    
    $table_name = $wpdb->prefix ."sync_local_data";
    if($sync_id == '' || $syncstatus == 'imported'){
        $wpdb->insert( $table_name, array( 'file_path' => $file_path, 'last_sync' => $last_sync ,'status' =>'download-start' ));
        $sync_id = $wpdb->insert_id;
    }else{
        $wpdb->update( $table_name,
        array( 'file_path' => $file_path, 'last_sync' => $last_sync ,'status' =>'download-start' ),
        array( 'id' => $sync_id ) );
    }
    
    if(sds_download_file_local($sync_id)){
        $status =  get_local_syncrecord_status($sync_id);
        wp_die( json_encode( array( 'code' => 'OK', 'sync_request_id' => $sync_id, 'status' => $status) ) );
    }
    else{
        $status =  get_local_syncrecord_status($sync_id);
        wp_die( json_encode( array( 'code' => 'ERROR', 'sync_request_id' => $sync_id, 'status' => $status) ) );
    }

    
}
add_action( 'wp_ajax_sds_data_sync_start', 'ajax_sds_data_sync_start' );

function ajax_sds_data_sync_import() {
    global $wpdb;
    $sync_id = $_POST['sync_id'];
    
    $file_path = $wpdb->get_var( $wpdb->prepare( "SELECT file_path FROM {$wpdb->prefix}sync_local_data WHERE id = %d",$sync_id ) );
    
    $zip_file_name = get_zip_archive_name($file_path);
    
    $uploads_dir=wp_upload_dir();
    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    
    $file_path = $upload_directory.'/tmplocal/downsync/'.$zip_file_name;

    $zip = new ZipArchive;

    $archive = $zip->open( $file_path );   
    

    if ($archive === false)
        return;

    $uploads_path = wp_upload_dir();
    $extract_path = str_replace('/images', '', $uploads_path['path']) . '/.tmp';

    $zip->extractTo( $extract_path );

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex( $i );
        if(strpos($stat['name'],'class_divisions.csv') !== false)
            sds_read_class_divisions_csv_file( $extract_path . '/' . $stat['name'] );

        if(strpos($stat['name'],'question_response_meta.csv') !== false)
            sds_read_question_response_meta_csv_file( $extract_path . '/' . $stat['name'] );
        
        if(strpos($stat['name'],'question_response.csv') !== false)
            sds_read_question_response_csv_file( $extract_path . '/' . $stat['name'] );

        if(strpos($stat['name'],'content_collection.csv') !== false)
            sds_read_content_collection_csv_file( $extract_path . '/' . $stat['name'] );
        
        if(strpos($stat['name'],'collection_meta.csv') !== false)
            sds_read_collection_meta_csv_file( $extract_path . '/' . $stat['name'] );    
        
        if(strpos($stat['name'],'options.csv') !== false)
            sds_read_options_csv_file( $extract_path . '/' . $stat['name'] );    
        
        if(strpos($stat['name'],'postmeta.csv') !== false)
            sds_read_postmeta_csv_file( $extract_path . '/' . $stat['name'] );   

        if(strpos($stat['name'],'posts.csv') !== false)
            sds_read_posts_csv_file( $extract_path . '/' . $stat['name'] );  
                 
        if(strpos($stat['name'],'term_relationships.csv') !== false)
            sds_read_term_relationships_csv_file( $extract_path . '/' . $stat['name'] );     
        
        if(strpos($stat['name'],'term_taxonomy.csv') !== false)
            sds_read_term_taxonomy_csv_file( $extract_path . '/' . $stat['name'] );   
        
        if(strpos($stat['name'],'terms.csv') !== false)
            sds_read_terms_csv_file( $extract_path . '/' . $stat['name'] );       

        if(strpos($stat['name'],'textbook_relationships.csv') !== false)
            sds_read_textbook_relationships_csv_file( $extract_path . '/' . $stat['name'] );     
        
        if(strpos($stat['name'],'users.csv') !== false)
            sds_read_users_csv_file( $extract_path . '/' . $stat['name'] );  
        
        if(strpos($stat['name'],'usermeta.csv') !== false)
            sds_read_usermeta_csv_file( $extract_path . '/' . $stat['name'] );          
    }

    sds_mark_sync_complete( $sync_id );

    $files = glob($extract_path.'/*'); // get all file names from .tmp folder
    foreach($files as $file){ // iterate files
        if(is_file($file))
            unlink($file); // delete file
    }

    $zip->close();
    
    $status =  get_local_syncrecord_status($sync_id);
    if($status == 'imported')
    wp_die( json_encode( array( 'code' => 'OK', 'sync_request_id' => $sync_id, 'status' => $status) ) );
    else
    wp_die( json_encode( array( 'code' => 'ERROR', 'sync_request_id' => $sync_id, 'status' => $status) ) );
}
add_action( 'wp_ajax_sds_data_sync_import', 'ajax_sds_data_sync_import' );

function ajax_sds_data_sync_local_export(){
    global $wpdb;
    
    $last_sync = $_POST['last_sync'];
    
    $tables_to_export= sds_get_tables_to_export($last_sync);

    $exported_tables= sds_prepare_csvs_for_export($tables_to_export);

    $uploads_dir=wp_upload_dir();

    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);

    $random= rand(9999,99999);

    if(!file_exists($upload_directory.'/tmplocal/'))
        mkdir($upload_directory.'/tmplocal',0755);

    if(!file_exists($upload_directory.'/tmplocal/downsync'))
        mkdir($upload_directory.'/tmplocal/downsync',0755);

    if(!file_exists($upload_directory.'/tmplocal/upsync'))
        mkdir($upload_directory.'/tmplocal/upsync',0755);

    $upload_path= '/tmplocal/upsync/csv-export-'.$random.date('Ymdhis').'.zip';

    $result = sds_create_zip($exported_tables, $upload_directory.$upload_path);

    $export_details = array();

    if($result === false){
        $export_details['message'] = 'Failed to create export file';
        wp_die( json_encode( array( 'code' => 'ERROR', 'status' => $export_details['message']) ) );
    }
    else{
        $uploaded_url= $upload_directory.$upload_path;
        $export_details['exported_csv_url'] = $uploaded_url;
        $export_details['last_sync']=date('Y-m-d h:i:s');
        
        $table_name = $wpdb->prefix ."sync_local_data";
        $meta_data = array();
        $meta_data['exported_local_csv_url'] =  $export_details['exported_csv_url'];
        
        $wpdb->insert( $table_name, array( 'file_path' => '', 'last_sync' => $export_details['last_sync'] ,
                        'status' =>'export-local','meta'=>  maybe_serialize($meta_data)  ));
        $sync_id = $wpdb->insert_id;
        
        wp_die( json_encode( array( 'code' => 'OK', 'sync_request_id' => $sync_id,'status'=>'export-local') ) );
    }

}
add_action( 'wp_ajax_sds_data_sync_local_export', 'ajax_sds_data_sync_local_export' );

function ajax_sds_local_upload_to_server(){
    global $wpdb;
    
    $sync_request_id = $_POST['sync_request_id'];
    
    $filetoupload = get_local_uploaded_file($sync_request_id);
    
    $remote_url = 'http://synapsedu.info/wp-admin/admin-ajax.php';          //temporary hard code url   
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: multipart/form-data"));
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Linux i686; rv:6.0) Gecko/20100101 Firefox/6.0Mozilla/4.0 (compatible;)");
    curl_setopt($ch, CURLOPT_URL, $remote_url);
    curl_setopt($ch, CURLOPT_POST, true);
    $post = array(
        'file' => '@'.$filetoupload,
        'action' => 'sync-app-data',
        'blog_id' =>14,
    );
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    $response = curl_exec($ch);
    curl_close($ch);
    $resp_decode = json_decode($response,true);
    //print_r($response);exit;
    //return $response;
    
    if($resp_decode['code'] == 'OK'){
        $wpdb->update( $wpdb->prefix . "sync_local_data",
        array('status' => 'transfered-server','server_sync_id' => $resp_decode['sync_request_id']),
        array( 'id' => $sync_request_id ) );
        
        wp_die( json_encode( array( 'code' => $resp_decode['code'], 'sync_request_id' => $resp_decode['sync_request_id']) ) );
    }
    
    wp_die( json_encode( array( 'code' => $resp_decode['code'], 'message' => $resp_decode['message']) ) );

}
add_action( 'wp_ajax_sds_data_sync_local_upload', 'ajax_sds_local_upload_to_server' );


///Media Sync functions
function ajax_sds_media_sync_images(){
    $mediafetchactions = array('images' =>'get-site-image-resources-data',
                                'audios'=>'get-site-audio-resources-data',
                                'videos'=>'get-site-video-resources-data');
    $media_type = $_POST['type'];
    
    if(!array_key_exists($media_type, $mediafetchactions))
            wp_die( json_encode( array( 'code' => 'ERROR', 'message' => 'Invalid action') ) );
    
    $localimages = sds_get_media_files_directory_json($media_type);
    
    $localimages_key_val = sds_get_files_name_path($localimages);
    
    $remote_url = 'http://synapsedu.info/wp-admin/admin-ajax.php';          //temporary hard code url 
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_URL, $remote_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    $post = array(
        'action' => $mediafetchactions[$media_type],
    );
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    $response = curl_exec($ch);
    curl_close($ch);
    $resp_decode = json_decode($response,true);
    
    $serverimages_key_val = sds_get_files_name_path($resp_decode);
    
    $files_difference = sds_get_files_difference($localimages_key_val,$serverimages_key_val);
    
    $download_resp = sds_get_files_difference_server($files_difference,$media_type);
    if(!array_key_exists('error', $download_resp)){
        wp_die( json_encode( array( 'code' => 'OK', 'message' => $media_type.' files downloaded') ) );
    }
    
    wp_die( json_encode( array( 'code' => 'ERROR', 'message' => 'Files download error','files' => $download_resp) ) );
}
add_action( 'wp_ajax_sds_media_sync_images', 'ajax_sds_media_sync_images' );
