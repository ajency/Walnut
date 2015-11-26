<?php

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

function sds_read_quiz_question_response_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    $interpreter->addObserver( function ( array $quiz_response_data ) {

        if (sds_validate_quiz_response_csv_row( $quiz_response_data ) === true) {

            $quiz_response_data = sds_convert_csv_row_to_quiz_response_format( $quiz_response_data );
            sds_sync_quiz_response( $quiz_response_data );

        } else {
            sds_write_to_quiz_response_import_error_log( $quiz_response_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}

function sds_validate_quiz_response_csv_row( $quiz_response_data ) {

    if (!is_array( $quiz_response_data ))
        return new WP_Error("", "Not a valid record");

    if($quiz_response_data [0] == 'qr_id')
        return false;
        
    // Total columns for each row MUST be 7. else its a improper CSV row
    if (count( $quiz_response_data ) !== 7)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}

function sds_convert_csv_row_to_quiz_response_format( $quiz_response_data ) {

    return array(
        'qr_id'             => $quiz_response_data[0],
        'summary_id'        => $quiz_response_data[1],
        'content_piece_id'  => $quiz_response_data[2],
        'question_response' => wp_unslash($quiz_response_data[3]),
        'time_taken'        => $quiz_response_data[4],
        'marks_scored'      => $quiz_response_data[5],
        'status'            => wp_unslash($quiz_response_data[6]),
        'sync' => 1
    );
}

function sds_sync_quiz_response( $quiz_response_data ) {

    if (sds_quiz_response_exists( $quiz_response_data['qr_id'] )) {
        sds_sync_update_quiz_response( $quiz_response_data );
    } else {
        sds_sync_insert_quiz_response( $quiz_response_data );
    }
}

function sds_sync_insert_quiz_response( $quiz_response_data ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "quiz_question_response",
        $quiz_response_data );

    return $wpdb->insert_id;
}

function sds_sync_update_quiz_response( $quiz_response_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "quiz_question_response",
        $quiz_response_data,
        array( 'qr_id' => $quiz_response_data['qr_id'] ) );

    return true;
}

function sds_quiz_response_exists( $qr_id ) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT qr_id FROM {$wpdb->prefix}quiz_question_response WHERE qr_id LIKE %s", $qr_id );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_write_to_quiz_response_import_error_log( $quiz_response_data ) {
    //TODO: Handle failed import records here
}


//import the quiz response summary functions

function sds_read_quiz_response_summary_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    $interpreter->addObserver( function ( array $quiz_summary_data ) {

        if (sds_validate_quiz_summary_csv_row( $quiz_summary_data ) === true) {

            $quiz_summary_data = sds_convert_csv_row_to_quiz_summary_format( $quiz_summary_data );
            sds_sync_quiz_summary( $quiz_summary_data );

        } else 
            sds_write_to_quiz_summary_import_error_log( $quiz_summary_data );
    } );

    $lexer->parse( $file_path, $interpreter );
}

function sds_validate_quiz_summary_csv_row( $quiz_summary_data ) {

    if (!is_array( $quiz_summary_data ))
        return new WP_Error("", "Not a valid record");

    if($quiz_summary_data [0] == 'summary_id')
        return false;
        
    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $quiz_summary_data ) !== 5)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}

function sds_convert_csv_row_to_quiz_summary_format( $quiz_summary_data ) {

    return array(
        'summary_id'    => $quiz_summary_data[0],
        'collection_id' => $quiz_summary_data[1],
        'student_id'    => $quiz_summary_data[2],
        'taken_on'      => $quiz_summary_data[3],
        'quiz_meta'     => wp_unslash($quiz_summary_data[4]),
        'sync' => 1
    );
}

function sds_sync_quiz_summary( $quiz_summary_data ) {

    if (sds_quiz_summary_exists( $quiz_summary_data['summary_id'] )) {
        sds_sync_update_quiz_summary( $quiz_summary_data );
    } else {
        sds_sync_insert_quiz_summary( $quiz_summary_data );
    }
}

function sds_sync_insert_quiz_summary( $quiz_summary_data ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "quiz_response_summary",
        $quiz_summary_data );

    return $wpdb->insert_id;
}

function sds_sync_update_quiz_summary( $quiz_summary_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "quiz_response_summary",
        $quiz_summary_data,
        array( 'summary_id' => $quiz_summary_data['summary_id'] ) );

    return true;
}

function sds_quiz_summary_exists( $summary_id ) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT summary_id FROM {$wpdb->prefix}quiz_response_summary WHERE summary_id LIKE %s", $summary_id );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_write_to_quiz_summary_import_error_log( $quiz_summary_data ) {
    //TODO: Handle failed import records here
}

