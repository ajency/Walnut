<?php
use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;


function sds_read_class_divisions_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $class_divisions_data ) {

        if (sds_validate_class_divisions_csv_row( $class_divisions_data ) === true) {
            $class_divisions_data = sds_convert_csv_row_to_class_divisions_format( $class_divisions_data );

            sds_sync_class_divisions( $class_divisions_data );

        } else {
            sds_write_to_import_error_log( $class_divisions_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}

function sds_validate_class_divisions_csv_row( $class_divisions_data ) {

    if (!is_array( $class_divisions_data ))
        return new WP_Error("", "Not a valid record");

    if(! (int) $class_divisions_data[0] )
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $class_divisions_data ) !== 3)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_class_divisions_format( $class_divisions_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'id' => $class_divisions_data[0],
        'division' => $class_divisions_data[1],
        'class_id' => $class_divisions_data[2]
    );
}

function sds_sync_class_divisions( $class_divisions_data ) {

    if (sds_class_divisions_exists( $class_divisions_data ))
        sds_sync_update_class_divisions( $class_divisions_data );

    else
        sds_sync_insert_class_divisions( $class_divisions_data );

}

function sds_sync_insert_class_divisions( $class_divisions_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "class_divisions",
        $class_divisions_data );

    return $wpdb->insert_id;
}

function sds_sync_update_class_divisions( $class_divisions_data ) {

    global $wpdb;

    $id     = $class_divisions_data['id'];
    $division= $class_divisions_data['division'];
    $class_id= $class_divisions_data['class_id'];


    $update_query= $wpdb->prepare( "UPDATE {$wpdb->prefix}class_divisions
        SET division = %s,class_id = %s
        WHERE id like %s",
        array($division, $class_id, $id ) );

    $wpdb->query($update_query);

    return true;
}

function sds_class_divisions_exists( $class_divisions_data ) {

    global $wpdb;

    $division= $class_divisions_data['division'];
    $class_id= $class_divisions_data['class_id'];

    $query = $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}class_divisions
        WHERE division like %s AND class_id like %s",
        array($division, $class_id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_write_to_import_error_log( $class_divisions_data ) {
    //TODO: Handle failed import records here
}

function sds_read_question_response_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $question_response_data ) {

        if (sds_validate_question_response_csv_row( $question_response_data ) === true) {

            $question_response_data = sds_convert_csv_row_to_question_response_format( $question_response_data );
            sds_sync_question_response( $question_response_data );

        } else {
            sds_write_to_import_error_log( $question_response_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}

/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_question_response_csv_row( $question_response_data ) {

    if (!is_array( $question_response_data ))
        return new WP_Error("", "Not a valid record");

    if($question_response_data[0] == 'ref_id')
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
function sds_convert_csv_row_to_question_response_format( $question_response_data ) {

    // it can be string or array; hence, sanitize if serialize string
    $question_response = sds_sanitize_question_response( $question_response_data[5] );

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

function sds_sanitize_question_response( $question_response ) {
    //NOTE: Might have some logic here
    return $question_response;
}

function sds_sync_question_response( $question_response_data ) {

    if (question_response_exists( $question_response_data['ref_id'] )) {
        sds_sync_update_question_response( $question_response_data );
    } else {
        sds_sync_insert_question_response( $question_response_data );
    }
}

function sds_sync_insert_question_response( $question_response_data ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "question_response",
        $question_response_data );

    return $wpdb->insert_id;
}

function sds_sync_update_question_response( $question_response_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "question_response",
        $question_response_data,
        array( 'ref_id' => $question_response_data['ref_id'] ) );

    return true;
}

function sds_question_response_exists( $reference_id ) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT ref_id FROM {$wpdb->prefix}question_response WHERE ref_id like %s", $reference_id );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}




function sds_read_question_response_meta_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $question_response_meta_data ) {

        if (sds_validate_question_response_meta_csv_row( $question_response_meta_data ) === true) {
            $question_response_meta_data = sds_convert_csv_row_to_question_response_meta_format( $question_response_meta_data );

            sds_sync_question_response_meta( $question_response_meta_data );

        } else {
            sds_write_to_import_error_log( $question_response_meta_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_question_response_meta_csv_row( $question_response_meta_data ) {

    if (!is_array( $question_response_meta_data ))
        return new WP_Error("", "Not a valid record");

    if($question_response_meta_data[0] == 'qr_ref_id')
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $question_response_meta_data ) !== 3)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_question_response_meta_format( $question_response_meta_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'qr_ref_id' => $question_response_meta_data[0],
        'meta_key' => $question_response_meta_data[1],
        'meta_value' => wp_unslash($question_response_meta_data[2])
    );
}

function sds_sync_question_response_meta( $question_response_meta_data ) {

    if (sds_question_response_meta_exists( $question_response_meta_data ))
        sds_sync_update_question_response_meta( $question_response_meta_data );

    else
        sds_sync_insert_question_response_meta( $question_response_meta_data );

}

function sds_sync_insert_question_response_meta( $question_response_meta_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "question_response_meta",
        $question_response_meta_data );

    return $wpdb->insert_id;
}

function sds_sync_update_question_response_meta( $question_response_meta_data ) {

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

function sds_question_response_meta_exists( $question_response_meta_data ) {

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

function sds_read_content_collection_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $content_collection_data ) {

        if (sds_validate_content_collection_csv_row( $content_collection_data ) === true) {
            $content_collection_data = sds_convert_csv_row_to_content_collection_format( $content_collection_data );

            sds_sync_content_collection( $content_collection_data );

        } else {
            sds_write_to_import_error_log( $content_collection_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_content_collection_csv_row( $content_collection_data ) {

    if (!is_array( $content_collection_data ))
        return new WP_Error("", "Not a valid record");


    if(!(int) $content_collection_data[0])
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $content_collection_data ) !== 12)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_content_collection_format( $content_collection_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'id' => $content_collection_data[0],
        'name' => $content_collection_data[1],
        'created_on' => $content_collection_data[2],
        'created_by' => $content_collection_data[3],
        'last_modified_on' => $content_collection_data[4],
        'last_modified_by' => $content_collection_data[5],
        'published_on' => $content_collection_data[6],
        'published_by' => $content_collection_data[7],
        'post_status' => $content_collection_data[8],
        'type' => $content_collection_data[9],
        'term_ids' => wp_unslash($content_collection_data[10]),
        'duration' => $content_collection_data[11]
    );
}

function sds_sync_content_collection( $content_collection_data ) {

    if (sds_content_collection_exists( $content_collection_data ))
        sds_sync_update_content_collection( $content_collection_data );

    else
        sds_sync_insert_content_collection( $content_collection_data );

}

function sds_sync_insert_content_collection( $content_collection_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "content_collection",
        $content_collection_data );

    return $wpdb->insert_id;
}

function sds_sync_update_content_collection( $content_collection_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "content_collection",
        $content_collection_data,
        array( 'id' => $content_collection_data['id'] ) );



    return true;
}

function sds_content_collection_exists( $content_collection_data ) {

    global $wpdb;

    $id= $content_collection_data['id'];

    $query = $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}content_collection
        WHERE id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_collection_meta_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $collection_meta_data ) {

        if (sds_validate_collection_meta_csv_row( $collection_meta_data ) === true) {
            $collection_meta_data = sds_convert_csv_row_to_collection_meta_format( $collection_meta_data );

            sds_sync_collection_meta( $collection_meta_data );

        } else {
            sds_write_to_import_error_log( $collection_meta_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_collection_meta_csv_row( $collection_meta_data ) {

    if (!is_array( $collection_meta_data ))
        return new WP_Error("", "Not a valid record");

    if(!(int) $collection_meta_data[0] )
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $collection_meta_data ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_collection_meta_format( $collection_meta_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'id' => $collection_meta_data[0],
        'collection_id' => $collection_meta_data[1],
        'meta_key' => $collection_meta_data[2],
        'meta_value' => wp_unslash($collection_meta_data[3])
    );
}

function sds_sync_collection_meta( $collection_meta_data ) {

    if (sds_collection_meta_exists( $collection_meta_data ))
        sds_sync_update_collection_meta( $collection_meta_data );

    else
        sds_sync_insert_collection_meta( $collection_meta_data );

}

function sds_sync_insert_collection_meta( $collection_meta_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "collection_meta",
        $collection_meta_data );

    return $wpdb->insert_id;
}

function sds_sync_update_collection_meta( $collection_meta_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "collection_meta",
        $collection_meta_data,
        array( 'id' => $collection_meta_data['id'] ) );



    return true;
}

function sds_collection_meta_exists( $collection_meta_data ) {

    global $wpdb;

    $id= $collection_meta_data['id'];
	$meta_key= $collection_meta_data['$meta_key'];

    $query = $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}collection_meta
        WHERE id like %s AND meta_key like %s",
        array($id,$meta_key)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_options_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $options_data ) {

        if (sds_validate_options_csv_row( $options_data ) === true) {
            $options_data = sds_convert_csv_row_to_options_format( $options_data );

            sds_sync_options( $options_data );

        } else {
            sds_write_to_import_error_log( $options_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_options_csv_row( $options_data ) {

    if (!is_array( $options_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $options_data ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_options_format( $options_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'option_id' => $options_data[0],
        'option_name' => $options_data[1],
        'option_value' => wp_unslash($options_data[2]),
        'autoload' => $options_data[3]
    );
}

function sds_sync_options( $options_data ) {

    if (sds_options_exists( $options_data ))
        sds_sync_update_options( $options_data );

    else
        sds_sync_insert_options( $options_data );

}

function sds_sync_insert_options( $options_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "options",
        $options_data );

    return $wpdb->insert_id;
}

function sds_sync_update_options( $options_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "options",
        $options_data,
        array( 'option_id' => $options_data['option_id'] ) );



    return true;
}

function sds_options_exists( $options_data ) {

    global $wpdb;

    $id= $options_data['option_id'];

    $query = $wpdb->prepare( "SELECT option_id FROM {$wpdb->prefix}options
        WHERE option_id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_posts_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $posts_data ) {

        if (sds_validate_posts_csv_row( $posts_data ) === true) {
            $posts_data = sds_convert_csv_row_to_posts_format( $posts_data );

            sds_sync_posts( $posts_data );

        } else {
            sds_write_to_import_error_log( $posts_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_posts_csv_row( $posts_data ) {

    if (!is_array( $posts_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $posts_data ) !== 23)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_posts_format( $posts_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'ID' => $posts_data[0],
        'post_author' => $posts_data[1],
        'post_date' => $posts_data[2],
        'post_date_gmt' => $posts_data[3],
        'post_content' => $posts_data[4],
        'post_title' => $posts_data[5],
        'post_excerpt' => $posts_data[6],
        'post_status' => $posts_data[7],
        'comment_status' => $posts_data[8],
        'ping_status' => $posts_data[9],
        'post_password' => $posts_data[10],
        'post_name' => $posts_data[11],
        'to_ping' => $posts_data[12],
        'pinged' => $posts_data[13],
        'post_modified' => $posts_data[14],
        'post_modified_gmt' => $posts_data[15],
        'post_content_filtered' => $posts_data[16],
        'post_parent' => $posts_data[17],
        'guid' => $posts_data[18],
        'menu_order' => $posts_data[19],
        'post_type' => $posts_data[20],
        'post_mime_type' => $posts_data[21],
        'comment_count' => $posts_data[22]
    );
}

function sds_sync_posts( $posts_data ) {

    if (sds_posts_exists( $posts_data ))
        sds_sync_update_posts( $posts_data );

    else
        sds_sync_insert_posts( $posts_data );

}

function sds_sync_insert_posts( $posts_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "posts",
        $posts_data );

    return $wpdb->insert_id;
}

function sds_sync_update_posts( $posts_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "posts",
        $posts_data,
        array( 'ID' => $posts_data['ID'] ) );



    return true;
}

function sds_posts_exists( $posts_data ) {

    global $wpdb;

    $id= $posts_data['ID'];

    $query = $wpdb->prepare( "SELECT ID FROM {$wpdb->prefix}posts
        WHERE ID like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_postmeta_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $postmeta_data ) {

        if (sds_validate_postmeta_csv_row( $postmeta_data ) === true) {
            $postmeta_data = sds_convert_csv_row_to_postmeta_format( $postmeta_data );

            sds_sync_postmeta( $postmeta_data );

        } else {
            sds_write_to_import_error_log( $postmeta_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_postmeta_csv_row( $postmeta_data ) {

    if (!is_array( $postmeta_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $postmeta_data ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_postmeta_format( $postmeta_data ) {
    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );


    return array(
        'meta_id' => $postmeta_data[0],
        'post_id' => $postmeta_data[1],
        'meta_key' => $postmeta_data[2],
        'meta_value' => wp_unslash($postmeta_data[3])
    );
}

function sds_sync_postmeta( $postmeta_data ) {

    if (sds_postmeta_exists( $postmeta_data ))
        sds_sync_update_postmeta( $postmeta_data );

    else
        sds_sync_insert_postmeta( $postmeta_data );

}

function sds_sync_insert_postmeta( $postmeta_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "postmeta",
        $postmeta_data );

    return $wpdb->insert_id;
}

function sds_sync_update_postmeta( $postmeta_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "postmeta",
        $postmeta_data,
        array( 'meta_id' => $postmeta_data['meta_id'] ) );



    return true;
}

function sds_postmeta_exists( $postmeta_data ) {

    global $wpdb;

    $id= $postmeta_data['meta_id'];

    $query = $wpdb->prepare( "SELECT meta_id FROM {$wpdb->prefix}postmeta
        WHERE meta_id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_term_relationships_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $term_relationships_data ) {

        if (sds_validate_term_relationships_csv_row( $term_relationships_data ) === true) {
            $term_relationships_data = sds_convert_csv_row_to_term_relationships_format( $term_relationships_data );

            sds_sync_term_relationships( $term_relationships_data );

        } else {
            sds_write_to_import_error_log( $term_relationships_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_term_relationships_csv_row( $term_relationships_data ) {

    if (!is_array( $term_relationships_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $term_relationships_data ) !== 3)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_term_relationships_format( $term_relationships_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'object_id' => $term_relationships_data[0],
        'term_taxonomy_id' => $term_relationships_data[1],
        'term_order' => $term_relationships_data[2]
    );
}

function sds_sync_term_relationships( $term_relationships_data ) {

    if (sds_term_relationships_exists( $term_relationships_data ))
        sds_sync_update_term_relationships( $term_relationships_data );

    else
        sds_sync_insert_term_relationships( $term_relationships_data );

}

function sds_sync_insert_term_relationships( $term_relationships_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "term_relationships",
        $term_relationships_data );

    return $wpdb->insert_id;
}

function sds_sync_update_term_relationships( $term_relationships_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "term_relationships",
        $term_relationships_data,
        array( 'object_id' => $term_relationships_data['object_id'] ) );



    return true;
}

function sds_term_relationships_exists( $term_relationships_data ) {

    global $wpdb;

    $id= $term_relationships_data['object_id'];

    $query = $wpdb->prepare( "SELECT object_id FROM {$wpdb->prefix}term_relationships
        WHERE object_id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_term_taxonomy_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $term_taxonomy_data ) {

        if (sds_validate_term_taxonomy_csv_row( $term_taxonomy_data ) === true) {
            $term_taxonomy_data = sds_convert_csv_row_to_term_taxonomy_format( $term_taxonomy_data );

            sds_sync_term_taxonomy( $term_taxonomy_data );

        } else {
            sds_write_to_import_error_log( $term_taxonomy_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_term_taxonomy_csv_row( $term_taxonomy_data ) {

    if (!is_array( $term_taxonomy_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $term_taxonomy_data ) !== 6)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_term_taxonomy_format( $term_taxonomy_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'term_taxonomy_id' => $term_taxonomy_data[0],
        'term_id' => $term_taxonomy_data[1],
        'taxonomy' => $term_taxonomy_data[2],
        'description' => $term_taxonomy_data[3],
        'parent' => $term_taxonomy_data[4],
        'count' => $term_taxonomy_data[5]
    );
}

function sds_sync_term_taxonomy( $term_taxonomy_data ) {

    if (sds_term_taxonomy_exists( $term_taxonomy_data ))
        sds_sync_update_term_taxonomy( $term_taxonomy_data );

    else
        sds_sync_insert_term_taxonomy( $term_taxonomy_data );

}

function sds_sync_insert_term_taxonomy( $term_taxonomy_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "term_taxonomy",
        $term_taxonomy_data );

    return $wpdb->insert_id;
}

function sds_sync_update_term_taxonomy( $term_taxonomy_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "term_taxonomy",
        $term_taxonomy_data,
        array( 'term_taxonomy_id' => $term_taxonomy_data['term_taxonomy_id'] ) );



    return true;
}

function sds_term_taxonomy_exists( $term_taxonomy_data ) {

    global $wpdb;

    $id= $term_taxonomy_data['term_taxonomy_id'];

    $query = $wpdb->prepare( "SELECT term_taxonomy_id FROM {$wpdb->prefix}term_taxonomy
        WHERE term_taxonomy_id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_terms_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $terms_data ) {

        if (sds_validate_terms_csv_row( $terms_data ) === true) {
            $terms_data = sds_convert_csv_row_to_terms_format( $terms_data );

            sds_sync_terms( $terms_data );

        } else {
            sds_write_to_import_error_log( $terms_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_terms_csv_row( $terms_data ) {

    if (!is_array( $terms_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $terms_data ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_terms_format( $terms_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'term_id' => $terms_data[0],
        'name' => $terms_data[1],
        'slug' => $terms_data[2],
        'term_group' => $terms_data[3]
    );
}

function sds_sync_terms( $terms_data ) {

    if (sds_terms_exists( $terms_data ))
        sds_sync_update_terms( $terms_data );

    else
        sds_sync_insert_terms( $terms_data );

}

function sds_sync_insert_terms( $terms_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "terms",
        $terms_data );

    return $wpdb->insert_id;
}

function sds_sync_update_terms( $terms_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "terms",
        $terms_data,
        array( 'term_id' => $terms_data['term_id'] ) );



    return true;
}

function sds_terms_exists( $terms_data ) {

    global $wpdb;

    $id= $terms_data['term_id'];

    $query = $wpdb->prepare( "SELECT term_id FROM {$wpdb->prefix}terms
        WHERE term_id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_textbook_relationships_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $textbook_relationships_data ) {

        if (sds_validate_textbook_relationships_csv_row( $textbook_relationships_data ) === true) {
            $textbook_relationships_data = sds_convert_csv_row_to_textbook_relationships_format( $textbook_relationships_data );

            sds_sync_textbook_relationships( $textbook_relationships_data );

        } else {
            sds_write_to_import_error_log( $textbook_relationships_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_textbook_relationships_csv_row( $textbook_relationships_data ) {

    if (!is_array( $textbook_relationships_data ))
        return new WP_Error("", "Not a valid record");

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $textbook_relationships_data ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_textbook_relationships_format( $textbook_relationships_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'id' => $textbook_relationships_data[0],
        'textbook_id' => $textbook_relationships_data[1],
        'class_id' => wp_unslash($textbook_relationships_data[2]),
        'tags' => wp_unslash($textbook_relationships_data[3])
    );
}

function sds_sync_textbook_relationships( $textbook_relationships_data ) {

    if (sds_textbook_relationships_exists( $textbook_relationships_data ))
        sds_sync_update_textbook_relationships( $textbook_relationships_data );

    else
        sds_sync_insert_textbook_relationships( $textbook_relationships_data );

}

function sds_sync_insert_textbook_relationships( $textbook_relationships_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "textbook_relationships",
        $textbook_relationships_data );

    return $wpdb->insert_id;
}

function sds_sync_update_textbook_relationships( $textbook_relationships_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "textbook_relationships",
        $textbook_relationships_data,
        array( 'id' => $textbook_relationships_data['id'] ) );



    return true;
}

function sds_textbook_relationships_exists( $textbook_relationships_data ) {

    global $wpdb;

    $id= $textbook_relationships_data['id'];

    $query = $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}textbook_relationships
        WHERE id like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_usermeta_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $usermeta_data ) {

        if (sds_validate_usermeta_csv_row( $usermeta_data ) === true) {
            $usermeta_data = sds_convert_csv_row_to_usermeta_format( $usermeta_data );

            sds_sync_usermeta( $usermeta_data );

        } else {
            sds_write_to_import_error_log( $usermeta_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_usermeta_csv_row( $usermeta_data ) {

    if (!is_array( $usermeta_data ))
        return new WP_Error("", "Not a valid record");

    if($usermeta_data[2] == 'wp_capabilities' || $usermeta_data[2] ==  'wp_user_level' || !(int) $usermeta_data[0])
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $usermeta_data ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_usermeta_format( $usermeta_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    global $wpdb;

    $meta_value = wp_unslash($usermeta_data[3]);
    $meta_key = $usermeta_data[2];

    if(strpos($usermeta_data[2], 'capabilities'))
        $meta_key = $wpdb->prefix. 'capabilities';

    if(strpos($usermeta_data[2], 'user_level'))
        $meta_key = $wpdb->prefix. 'user_level';

    return array(
        'umeta_id' => $usermeta_data[0],
        'user_id' => $usermeta_data[1],
        'meta_key' => $meta_key,
        'meta_value' =>$meta_value
    );
}

function sds_sync_usermeta( $usermeta_data ) {

    if (sds_usermeta_exists( $usermeta_data ))
        sds_sync_update_usermeta( $usermeta_data );

    else
        sds_sync_insert_usermeta( $usermeta_data );

}

function sds_sync_insert_usermeta( $usermeta_data ) {

    global $wpdb;

    $insert = $wpdb->insert( $wpdb->prefix . "usermeta",
        $usermeta_data );

    return $wpdb->insert_id;
}

function sds_sync_update_usermeta( $usermeta_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "usermeta",
        $usermeta_data,
        array( 'umeta_id' => $usermeta_data['umeta_id'] ) );



    return true;
}

function sds_usermeta_exists( $usermeta_data ) {

    global $wpdb;

    $user_id= $usermeta_data['user_id'];
    $meta_key= $usermeta_data['meta_key'];

    $query = $wpdb->prepare( "SELECT umeta_id FROM {$wpdb->prefix}usermeta
        WHERE user_id = %d AND meta_key like %s",
        array($user_id, $meta_key)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_read_users_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    // TODO: move this function out from here. use named function instead of anonymous function
    $interpreter->addObserver( function ( array $users_data ) {

        if (sds_validate_users_csv_row( $users_data ) === true) {
            $users_data = sds_convert_csv_row_to_users_format( $users_data );

            sds_sync_users( $users_data );

        } else {
            sds_write_to_import_error_log( $users_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}
/**
 * @param $question_response_data
 * @return bool|WP_Error
 * Expected array = [CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0]
 */
function sds_validate_users_csv_row( $users_data ) {

    if (!is_array( $users_data ))
        return new WP_Error("", "Not a valid record");

    if (!(int) $users_data[0] )
        return false;

    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $users_data ) !== 12)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}



function sds_convert_csv_row_to_users_format( $users_data ) {

    // it can be string or array; hence, sanitize if serialize string
    //$question_response_meta_data = sanitize_question_response( $question_response_meta_data[3] );

    return array(
        'ID' => $users_data[0],
        'user_login' => $users_data[1],
        'user_pass' => $users_data[2],
        'user_nicename' => $users_data[3],
        'user_email' => $users_data[4],
        'user_url' => $users_data[5],
        'user_registered' => $users_data[6],
        'user_activation_key' => $users_data[7],
        'user_status' => $users_data[8],
        'display_name' => $users_data[9],
        'spam' => $users_data[10],
        'deleted' => $users_data[11]
    );
}

function sds_sync_users( $users_data ) {

    sds_sync_insert_users( $users_data );

}

function sds_sync_insert_users( $users_data ) {

    global $wpdb;

    $data = array(
        'ID'        =>(int) $users_data['ID'],
        'user_login'=> $users_data['user_login'],
        'user_pass' => $users_data['user_pass'],
        'user_nicename' =>$users_data['user_nicename'],
        'user_email' =>$users_data['user_email'],
        'user_registered' =>$users_data['user_registered'],
        'display_name' =>$users_data['display_name']
    );

    $insert= $wpdb->insert( $wpdb->prefix . "users",
        $data );

    return $users_data['ID'];
}

function sds_sync_update_users( $users_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "users",
        $users_data,
        array( 'ID' => $users_data['ID'] ) );

    return true;
}

function sds_users_exists( $users_data ) {

    global $wpdb;

    $id= $users_data['ID'];

    $query = $wpdb->prepare( "SELECT ID FROM {$wpdb->prefix}users
        WHERE ID like %s",
        array($id)
    );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}