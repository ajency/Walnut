<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 05/06/14
 * Time: 6:28 PM
 */
require 'sync-functions.php';


function ajax_sync_app_data() {

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

    $sync_request_id = insert_sync_request_record( array( 'file_path' => $file_data['url'] ) );

    if (is_wp_error( $sync_request_id ))
        wp_die( json_encode( array( 'code' => 'ERROR', 'message' => 'Failed to create sync request. Please try again' ) ) );

    wp_die( json_encode( array('code' => 'OK',  'sync_request_id' => $sync_request_id ) ) );
}
add_action( 'wp_ajax_nopriv_sync-app-data', 'ajax_sync_app_data' );
add_action( 'wp_ajax_sync-app-data', 'ajax_sync_app_data' );


function cron_school_app_data_sync() {

    sync_app_data_to_db( 4 );
}

add_action( 'school_app_data_sync', 'cron_school_app_data_sync' );