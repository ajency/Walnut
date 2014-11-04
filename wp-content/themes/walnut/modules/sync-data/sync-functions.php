<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 06/06/14
 * Time: 12:21 PM
 */

/**
 * @param $sync_data
 * @return WP_Error | Int Wp error or sync request id
 */
function insert_sync_request_record( $sync_data ) {

    global $wpdb;

    $defaults = array(
        'blog_id' => get_current_blog_id(),
        'meta' => array(),
        'file_path' => '',
        'status' => 'pending' );

    if (!is_array( $sync_data ))
        return new WP_Error('invalid_record_data', __( 'Invalid record data passed' ));

    $record_data = wp_parse_args( $sync_data, $defaults );

    if (empty($record_data['file_path']))
        return new WP_Error('invalid_path', __( 'Invalid path value' ));

    //serialize meta value
    $record_data['meta'] = maybe_serialize( $record_data['meta'] );

    $wpdb->insert( $wpdb->prefix . "sync_apps_data", $record_data );

    $sync_request_id = $wpdb->insert_id;

    return $sync_request_id;
}

function sync_app_data_to_db( $sync_request_id ) {

    require_once "import_question_response.php";
    require_once "import_question_response_meta.php";
    require_once "import_quiz_question_response.php";
    require_once "import_quiz_response_summary.php";
    require_once "import_quiz_schedules.php";

    if (validate_file_exists( $sync_request_id ) === false)
        return false;

    $file_path = get_sync_zip_file_path( $sync_request_id );

    $zip = new ZipArchive;

    $archive = $zip->open( $file_path );

    if ($archive === false)
        return;

    $uploads_path = wp_upload_dir();
    $extract_path = str_replace('/images', '', $uploads_path['path']) . '/.tmp';

    $zip->extractTo( $extract_path );

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex( $i );
        if(strpos($stat['name'],'question_response.csv') !== false)
            read_question_response_csv_file( $extract_path . '/' . $stat['name'] );

        if(strpos($stat['name'],'question_response_meta.csv') !== false)
            read_question_response_meta_csv_file( $extract_path . '/' . $stat['name'] );

        if(strpos($stat['name'],'quiz_question_response.csv') !== false)
            read_quiz_question_response_csv_file( $extract_path . '/' . $stat['name'] );

        if(strpos($stat['name'],'quiz_response_summary.csv') !== false)
            read_quiz_response_summary_csv_file( $extract_path . '/' . $stat['name'] );

        if(strpos($stat['name'],'quiz_schedules.csv') !== false)
            read_quiz_schedules_csv_file( $extract_path . '/' . $stat['name'] );
    }

    mark_sync_as_complete( $sync_request_id );

    $files = glob($extract_path.'/*'); // get all file names from .tmp folder
    foreach($files as $file){ // iterate files
        if(is_file($file))
            unlink($file); // delete file
    }

    #delete the zip file
    #unlink($file_path);

    $zip->close();
}


function mark_sync_as_complete( $sync_request_id ) {
    global $wpdb;

    //TODO: add these table names to $wpdb; Implement DRY
    $table_name = $wpdb->prefix . "sync_apps_data";

    $wpdb->update( $table_name,
        array( 'status' => 'complete' ),
        array( 'id' => $sync_request_id )
    );

}

/**
 * @param $sync_request_id
 * @return bool
 */
function validate_file_exists( $sync_request_id ) {

    $file_path = get_sync_zip_file_path( $sync_request_id );

    if ($file_path === false)
        return;

    if (is_string( $file_path ) && file_exists( $file_path ))
        return true;

    return false;
}


function change_zip_upload_path( $param ) {

    $upsync_path = "tmp/upsync";
    $param['path'] = str_replace( 'images', $upsync_path, $param['path'] );
    $param['url'] = str_replace( 'images', $upsync_path, $param['url'] );
    $param['basedir'] = str_replace( 'images', $upsync_path, $param['basedir'] );
    $param['baseurl'] = str_replace( 'images', $upsync_path, $param['baseurl'] );
    $param['subdir'] = '';

    return $param;
}


function add_zip_upload_mimes( $mime_types, $user ) {

    $mime_types['zip'] = 'application/octet';
    return $mime_types;
}


function get_sync_zip_file_path( $sync_request_id ) {

    global $wpdb;

    // TODO: use wordpress transient API to avoid multiple query
    //wp_cache_get($sync_request_id, $sync_request_id . '_file_path');

    $table_name = $wpdb->prefix . "sync_apps_data";

    $query = $wpdb->prepare( "SELECT file_path FROM $table_name WHERE id = %d", $sync_request_id );

    $file_path = $wpdb->get_var( $query );

    if (is_string( $file_path ))
        return $file_path;

    return false;
}


function check_app_sync_data_completion( $sync_request_id ) {

    global $wpdb;

    //TODO: add these table names to $wpdb; Implement DRY
    $table_name = $wpdb->prefix . "sync_apps_data";

    $query = $wpdb->prepare( "SELECT status FROM $table_name WHERE id=%d", $sync_request_id );

    $status = $wpdb->get_var( $query );

    return is_string( $status ) && $status === 'complete';
}

/**
 * @return array of pending sync request ids
 */
function get_pending_app_sync_request_ids() {

    global $wpdb;

    $table_name = $wpdb->prefix . "sync_apps_data";

    $query = $wpdb->prepare( "SELECT id FROM $table_name WHERE status = %s", 'pending' );

    $sync_request_ids = $wpdb->get_col( $query );

    return $sync_request_ids;
}

function get_images_directory_json() {
    $wp_upload_dir = wp_upload_dir();

    $files = read_folder_directory( $wp_upload_dir['path'], $wp_upload_dir['baseurl']);
    return $files;
}
function get_videos_directory_json() {
    $wp_upload_dir = wp_upload_dir();

    $audio_path=str_replace("images", "videos", $wp_upload_dir['path']);
    $audio_url = str_replace("images", "videos", $wp_upload_dir['baseurl']);

    if($originals){
        $audio_path=str_replace("images", "media-web/videos-web", $wp_upload_dir['path']);
        $audio_url = str_replace("images", "media-web/videos-web", $wp_upload_dir['baseurl']);
    }

    $files = read_folder_directory( $audio_path, $audio_url);
    return $files;
    
}

function get_audio_directory_json($originals=false) {
    $wp_upload_dir = wp_upload_dir();

    $audio_path=str_replace("images", "audios", $wp_upload_dir['path']);
    $audio_url = str_replace("images", "audios", $wp_upload_dir['baseurl']);

    if($originals){
        $audio_path=str_replace("images", "media-web/audio-web", $wp_upload_dir['path']);
        $audio_url = str_replace("images", "media-web/audio-web", $wp_upload_dir['baseurl']);
    }

    $files = read_folder_directory( $audio_path, $audio_url);
    return $files;
}

function read_folder_directory( $dir, $base_URL = '' ) {

    $listDir = array();
    if ($handler = opendir( $dir )) {
        while (($sub = readdir( $handler )) !== FALSE) {

            if ($sub != "." && $sub != ".." && $sub != "Thumb.db" && $sub !== ".DS_Store") {

                if (is_file( $dir . "/" . $sub )) {

                    $file['link']=$base_URL . '/' . $sub;
                    $file['size']=filesize($dir. '/' . $sub)/1024;
                    $file['sizeformat'] = 'kB';
                    $listDir[] = $file;

                } elseif (is_dir( $dir . "/" . $sub )) {

                    $listDir[$sub] = read_folder_directory( $dir . "/" . $sub );
                }

            }
        }
        closedir( $handler );
    }
    return $listDir;
}

/*
 * function to delete site content on expiry/not syncing for 30 days
 */
function delete_site_content(){
    global $wpdb;
    
    $wpdb->query("TRUNCATE TABLE `{$wpdb->prefix}content_collection`");
    $wpdb->query("TRUNCATE TABLE `{$wpdb->prefix}collection_meta`");
    
    $posts_table_query=$wpdb->prepare(
            "SELECT ID FROM {$wpdb->prefix}posts
                    WHERE post_type <> %s ",
            "page"
        );
   
   $del_post_ids = $wpdb->get_col( $posts_table_query );
   
   $post_ids = array();

   foreach ($del_post_ids as $post_id){
       $post_ids[] = $post_id;
   }
   
   if(!empty($post_ids)){
    $wpdb->query("DELETE FROM `{$wpdb->prefix}posts` where ID IN (".implode(',',$post_ids).")");
    $wpdb->query("DELETE FROM `{$wpdb->prefix}postmeta` where post_id IN (".implode(',',$post_ids).")");
   }

}

/*
 * cron function to check if standalone site is valid
 */
function cron_check_school_valid(){
       global $wpdb;
       

       if(!is_multisite()){

       $qry_last_import = "SELECT last_sync FROM {$wpdb->prefix}sync_local_data
                                        WHERE status =  'imported'  
                                        ORDER BY id DESC LIMIT 1";
       $last_sync_date = $wpdb->get_var($qry_last_import);
      
           if($last_sync_date){

                 $expirytime = strtotime("+30 days",strtotime($last_sync_date));


                 if($expirytime < time() ){
                     delete_site_content();
                 }

           }
       }
}
add_action('scheduled_school_validity', 'cron_check_school_valid');


function school_is_syncd(){
    global $wpdb;
    
    $qry_last_import = "SELECT last_sync FROM {$wpdb->prefix}sync_local_data
                                     WHERE status =  'imported'  
                                     ORDER BY id DESC LIMIT 1";
    $last_sync_date = $wpdb->get_var($qry_last_import);

    if($last_sync_date){
        
    $expirytime = strtotime("+30 days",strtotime($last_sync_date));

    if($expirytime < time() ){
       return false;
    }else{
        return true;
    }

   }
   else{
       return false;
   }
}

function get_sync_log_devices(){
    global $wpdb;
    
    $qry = "SELECT * , MAX( sync_date) as last_sync FROM {$wpdb->prefix}sync_device_log GROUP BY blog_id,device_type ";
    
    $qry_results = $wpdb->get_results( $qry );
    
    return $qry_results;
    
}

function cron_send_site_expiry_notification(){
    global $wpdb;
    
    $qry = "SELECT * , MAX( sync_date) as last_sync FROM {$wpdb->prefix}sync_device_log GROUP BY blog_id,device_type ";
    
    $qry_results = $wpdb->get_results( $qry );   
    
    if(count($qry_results) > 0){
      foreach ($qry_results as $device) {
          $last_sync = strtotime($device->last_sync);
          $last_sync_date = date('Y-m-d',strtotime($device->last_sync));
          $currentdate = date('Y-m-d');
          $days_between = (ceil(abs(strtotime($currentdate) - strtotime($last_sync_date)) / 86400) );
          if($days_between > 20 && $days_between < 30){
              $days_remaining = 30 - $days_between;
              //function call to send email using wp_mail 
              send_user_notification_email($device->device_type,$device->blog_id,$device->meta,$days_remaining);
          }
      }
          
    }
}
add_action('send_site_expiry_notification','cron_send_site_expiry_notification');

function send_user_notification_email($device_type,$blog_id,$device_meta,$days_remaining){
    
    $blog_details = get_blog_details($blog_id);
    
    if($device_type == 'standalone'){
        switch_to_blog($blog_id);
        $query_args = array();
        $query_args['fields'] = array( 'user_email' );
        $query_args['role'] = 'school-admin';
        $users = get_users( $query_args );
        
        $recipients = array();
        foreach ($users as $user){
           $recipients[] = $user->user_email;
        }
        $recipient = implode(',', $recipients);
        restore_current_blog();
    }else{
        $meta_data = maybe_unserialize($device_meta);
        $user_id = $meta_data['user_id'];
        $user_info = get_userdata( $user_id );
        $recipient = $user_info->user_email;
    }
    
    
    $msgcontent = $blog_details->blogname .' On Your device/standalone site will expire in '.$days_remaining.' days. <br>'
            . 'You have '.$days_remaining.' days to get the school internet to work and ping before complete deletion of data. ';
    $headers = 'From: Synapse Learning <admin@synapsedu.info>' . "\r\n";
    add_filter('wp_mail_content_type', create_function('', 'return "text/html";'));
    $subject = "Site Content Delete Notification";
    wp_mail($recipient, $subject, $msgcontent, $headers);
}