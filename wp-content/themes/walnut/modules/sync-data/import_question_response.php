<?php

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

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

function write_to_question_response_import_error_log( $question_response_data ) {
    //TODO: Handle failed import records here
}

