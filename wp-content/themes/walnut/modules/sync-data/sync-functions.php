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

// FIXME: remove hardcoded 14
function sync_app_data_to_db( $sync_request_id ) {

    $sync_request_id = 14;

    if (validate_file_exists( $sync_request_id ) === false)
        return false;

    $file_path = get_sync_zip_file_path( $sync_request_id );

    $zip = new ZipArchive;

    $archive = $zip->open( $file_path );

    if ( $archive === false)
        return;

    $uploads_path = wp_upload_dir();
    $extract_path = $uploads_path['path'] . '/.tmp';

    $zip->extractTo( $extract_path );

    for( $i = 0; $i < $zip->numFiles; $i++ ){
        $stat = $zip->statIndex( $i );
        read_csv_file( $extract_path . '/' . $stat['name'] );
    }

    $zip->close();
}

function read_csv_file( $file_path ) {
    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();
    $interpreter->addObserver( function ( array $row ) {
        //echo json_encode( $row );
    } );
    $lexer->parse( $file_path, $interpreter );
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

    $upsync_path = "/tmp/upsync";

    $param['path'] = str_replace( $param['subdir'], $upsync_path, $param['path'] );
    $param['url'] = str_replace( $param['subdir'], $upsync_path, $param['url'] );
    $param['subdir'] = $upsync_path;

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
function get_pending_app_sync_requests() {

    global $wpdb;

    $table_name = $wpdb->prefix . "sync_apps_data";

    $query = $wpdb->prepare( "SELECT id FROM $table_name WHERE status = %s", 'pending' );

    $sync_request_ids = $wpdb->get_col( $query );

    return $sync_request_ids;
}