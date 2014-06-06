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
        'file_path' => '' );

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


function sync_app_data_to_db( $sync_id ) {

    $file_path = get_sync_zip_file_path();

    if (!file_exists( $file_path ))
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


function get_sync_zip_file_path() {

    return site_url() . "/wp-content/uploads/sites/" . get_current_blog_id() . "/csv-export.zip";
}