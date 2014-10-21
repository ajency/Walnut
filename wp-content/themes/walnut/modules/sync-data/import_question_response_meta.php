<?php

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;


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