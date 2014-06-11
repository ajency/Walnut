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
    $extract_path = $uploads_path['path'] . '/.tmp';

    $zip->extractTo( $extract_path );

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex( $i );
        read_csv_file( $extract_path . '/' . $stat['name'] );
    }

    //FIXME: handle deletion of .tmp folder

    $zip->close();
}


function read_csv_file( $file_path ) {

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
        'ref_id'            => $question_response_data[0],
        'teacher_id'        => $question_response_data[1],
        'content_piece_id'  => $question_response_data[2],
        'collection_id'     => $question_response_data[3],
        'division'          => $question_response_data[4],
        'question_response' => $question_response,
        'time_taken'        => $question_response_data[6],
        'start_date'        => $question_response_data[7],
        'end_date'          => $question_response_data[8],
        'status'            => $question_response_data[9]
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
function get_pending_app_sync_request_ids() {

    global $wpdb;

    $table_name = $wpdb->prefix . "sync_apps_data";

    $query = $wpdb->prepare( "SELECT id FROM $table_name WHERE status = %s", 'pending' );

    $sync_request_ids = $wpdb->get_col( $query );

    return $sync_request_ids;
}