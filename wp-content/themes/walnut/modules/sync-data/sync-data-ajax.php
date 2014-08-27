<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 05/06/14
 * Time: 6:28 PM
 */
require_once 'sync-functions.php';
require_once "csv_export_tables.php";

function ajax_sync_app_data() {

    $blog_id = $_REQUEST['blog_id'];

    switch_to_blog( $blog_id );

    $file_id = '';

    if (empty($_FILES))
        wp_die( json_encode( array( 'code' => 'ERROR', 'message' => 'No file to upload' ) ) );

    foreach ($_FILES as $file => $file_data)
        $file_id = $_FILES[$file];

    // add filter only for this request
    add_filter( 'upload_mimes', 'add_zip_upload_mimes', 100, 2 );
    add_filter( 'upload_dir', 'change_zip_upload_path', 100, 1 );

    $file_data = wp_handle_upload( $file_id, array( 'test_form' => false ) );

    if (isset($file_data['error']))
        wp_die( json_encode( array( 'code' => 'ERROR', 'message' => $file_data['error'] ) ) );

    $sync_request_id = insert_sync_request_record( array( 'file_path' => $file_data['file'] ) );

    if (is_wp_error( $sync_request_id )){
        wp_die( json_encode( array( 'code' => 'ERROR', 'message' => 'Failed to create sync request. Please try again' ) ) );
    }

    $blogurl = get_site_url();
    $trigger_cron = false;
    $trigger_blogurl_hit = wp_remote_get($blogurl); //blog url hit to trigger cron scheduled if no site hits
    if(!is_wp_error( $trigger_blogurl_hit ))
        $trigger_cron = true;
    wp_die( json_encode( array( 'code' => 'OK', 'sync_request_id' => $sync_request_id, 'trigger_cron' => $trigger_cron) ) );
}

add_action( 'wp_ajax_nopriv_sync-app-data', 'ajax_sync_app_data' );
add_action( 'wp_ajax_sync-app-data', 'ajax_sync_app_data' );


function cron_school_app_data_sync() {

    $pending_sync_request_ids = get_pending_app_sync_request_ids();

    if (empty($pending_sync_request_ids))
        return false;

    foreach ($pending_sync_request_ids as $sync_request_id)
        sync_app_data_to_db( $sync_request_id );
}

add_action( 'school_app_data_sync', 'cron_school_app_data_sync' );


function check_app_data_sync_completion() {

    $sync_request_id = $_REQUEST['sync_request_id'];

    $blog_id = $_REQUEST['blog_id'];

    switch_to_blog($blog_id);

    $blogurl = get_site_url();
    $trigger_blogurl_hit = wp_remote_get($blogurl); //blog url hit to trigger cron scheduled if no site hits

    $status = check_app_sync_data_completion( $sync_request_id );

    restore_current_blog();

    wp_send_json( $status );
}

add_action( 'wp_ajax_check_app_data_sync_completion', 'check_app_data_sync_completion' );
add_action( 'wp_ajax_nopriv_check-app-data-sync-completion', 'check_app_data_sync_completion' );


function get_site_image_resources_data() {

    switch_to_blog( 1 );

    $resource_data = get_images_directory_json();
    wp_die( json_encode( $resource_data ) );

}
add_action( 'wp_ajax_get-site-image-resources-data', 'get_site_image_resources_data' );
add_action( 'wp_ajax_nopriv_get-site-image-resources-data', 'get_site_image_resources_data' );

function get_site_video_resources_data() {

    switch_to_blog( 1 );

    $originals=false;
    if(isset($_REQUEST['originals']))
        $originals= true;

    $resource_data = get_videos_directory_json($originals);

    wp_die( json_encode( $resource_data ) );
}

add_action( 'wp_ajax_get-site-video-resources-data', 'get_site_video_resources_data' );
add_action( 'wp_ajax_nopriv_get-site-video-resources-data', 'get_site_video_resources_data' );

function get_site_audio_resources_data() {

    switch_to_blog( 1 );

    $originals=false;
    if(isset($_REQUEST['originals']))
        $originals= true;

    $resource_data = get_audio_directory_json($originals);
    wp_die( json_encode( $resource_data ) );
}

add_action( 'wp_ajax_get-site-audio-resources-data', 'get_site_audio_resources_data' );
add_action( 'wp_ajax_nopriv_get-site-audio-resources-data', 'get_site_audio_resources_data' );

function ajax_sync_database(){

    $blog_id= $_REQUEST['blog_id'];
    
    $device_type = $_REQUEST['device_type'];

    $last_sync= (isset($_REQUEST['last_sync']))? $_REQUEST['last_sync']: '';

    $export_details = export_tables_for_app($blog_id, $last_sync ,$device_type);

    wp_send_json($export_details);

}
add_action( 'wp_ajax_nopriv_sync-database', 'ajax_sync_database' );


function ajax_check_blog_validity(){
    $blog_id = $_REQUEST['blog_id'];

    switch_to_blog( $blog_id );
    
    $resp['blog_meta'] = get_option('blog_meta');
    $resp['server_time'] = date('Y-m-d H:i:s');
    wp_send_json($resp);
} 
add_action( 'wp_ajax_nopriv_check-blog-validity', 'ajax_check_blog_validity' );
add_action( 'wp_ajax_check-blog-validity', 'ajax_check_blog_validity' );

