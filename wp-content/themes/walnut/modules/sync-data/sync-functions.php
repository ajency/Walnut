<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 06/06/14
 * Time: 12:21 PM
 */

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

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
    }

    mark_sync_as_complete( $sync_request_id );

    $files = glob($extract_path.'/*'); // get all file names from .tmp folder
    foreach($files as $file){ // iterate files
        if(is_file($file))
            unlink($file); // delete file
    }

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

function read_question_response_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $question_response_data ) {

        if (validate_csv_row( $question_response_data ) === true) {

            $question_response_data = convert_csv_row_to_question_response_format( $question_response_data );
            sync_question_response( $question_response_data );

        } else {
            write_to_question_response_import_error_log( $question_response_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}

/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function validate_csv_row( $question_response_data ) {

    if (!is_array( $question_response_data ))
        return new WP_Error("", "Not a valid record");

    if($question_response_data [0] == 'ref_id')
        return false;
        
    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $question_response_data ) !== 10)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}

/**
 * @param $question_response_data Expected array = array(CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0)
 * @return array(
 * 'ref_id' => 'CP143C59D123456011',
 * 'teacher_id' => 78,
 * 'content_piece_id' => 143,
 * 'collection_id' => 59,
 * 'division' => '123456011,
 * 'status' => $status
 * );
 */
 
function convert_csv_row_to_question_response_format( $question_response_data ) {

    // it can be string or array; hence, sanitize if serialize string
    $question_response = sanitize_question_response( $question_response_data[5] );

    return array(
        'ref_id' => $question_response_data[0],
        'teacher_id' => $question_response_data[1],
        'content_piece_id' => $question_response_data[2],
        'collection_id' => $question_response_data[3],
        'division' => $question_response_data[4],
        'question_response' => wp_unslash($question_response),
        'time_taken' => $question_response_data[6],
        'start_date' => $question_response_data[7],
        'end_date' => $question_response_data[8],
        'status' => $question_response_data[9]
    );
}

function sanitize_question_response( $question_response ) {
    //NOTE: Might have some logic here
    return $question_response;
}

function sync_question_response( $question_response_data ) {

    if (question_response_exists( $question_response_data['ref_id'] )) {
        sync_update_question_response( $question_response_data );
    } else {
        sync_insert_question_response( $question_response_data );
    }
}

function sync_insert_question_response( $question_response_data ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "question_response",
        $question_response_data );

    return $wpdb->insert_id;
}

function sync_update_question_response( $question_response_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "question_response",
        $question_response_data,
        array( 'ref_id' => $question_response_data['ref_id'] ) );

    return true;
}

function question_response_exists( $reference_id ) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT ref_id FROM {$wpdb->prefix}question_response WHERE ref_id like %s", $reference_id );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}




function read_question_response_meta_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $question_response_meta_data ) {

        if (validate_meta_csv_row( $question_response_meta_data ) === true) {
            $question_response_meta_data = convert_csv_row_to_question_response_meta_format( $question_response_meta_data );

            sync_question_response_meta( $question_response_meta_data );

        } else {
            write_to_question_response_import_error_log( $question_response_meta_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function validate_meta_csv_row( $question_response_meta_data ) {

    if (!is_array( $question_response_meta_data ))
        return new WP_Error("", "Not a valid record");
    
    if($question_response_meta_data [0] == 'qr_ref_id')
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $question_response_meta_data ) !== 3)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function convert_csv_row_to_question_response_meta_format( $question_response_meta_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'qr_ref_id' => $question_response_meta_data[0],
        'meta_key' => $question_response_meta_data[1],
        'meta_value' => wp_unslash($question_response_meta_data[2])
    );
}

function sync_question_response_meta( $question_response_meta_data ) {

    if (question_response_meta_exists( $question_response_meta_data ))
        sync_update_question_response_meta( $question_response_meta_data );

    else
        sync_insert_question_response_meta( $question_response_meta_data );

}

function sync_insert_question_response_meta( $question_response_meta_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "question_response_meta",
        $question_response_meta_data );

    return $wpdb->insert_id;
}

function sync_update_question_response_meta( $question_response_meta_data ) {

    global $wpdb;

    $ref_id     = $question_response_meta_data['qr_ref_id'];
    $meta_key   = $question_response_meta_data['meta_key'];
    $meta_value   = $question_response_meta_data['meta_value'];


    $update_query= $wpdb->prepare( "UPDATE {$wpdb->prefix}question_response_meta
        SET meta_value = %s
        WHERE qr_ref_id like %s AND meta_key like %s",
        array($meta_value, $ref_id, $meta_key ) );

    $wpdb->query($update_query);

    return true;
}

function question_response_meta_exists( $question_response_meta_data ) {

    global $wpdb;

    $ref_id= $question_response_meta_data['qr_ref_id'];
    $meta_key= $question_response_meta_data['meta_key'];

    $query = $wpdb->prepare( "SELECT qr_ref_id FROM {$wpdb->prefix}question_response_meta
        WHERE qr_ref_id like %s AND meta_key like %s",
        array($ref_id, $meta_key)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function write_to_question_response_import_error_log( $question_response_data ) {
    //TODO: Handle failed import records here
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
