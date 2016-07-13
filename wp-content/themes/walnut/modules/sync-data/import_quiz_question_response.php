<?php

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

function read_quiz_question_response_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    $interpreter->addObserver( function ( array $quiz_response_data ) {

        if (validate_quiz_response_csv_row( $quiz_response_data ) === true) {

            $quiz_response_data = convert_csv_row_to_quiz_response_format( $quiz_response_data );
            sync_quiz_response( $quiz_response_data );

        } else {
            write_to_quiz_response_import_error_log( $quiz_response_data );
        }

    } );

    $lexer->parse( $file_path, $interpreter );
}

function validate_quiz_response_csv_row( $quiz_response_data ) {

    if (!is_array( $quiz_response_data ))
        return new WP_Error("", "Not a valid record");

    if($quiz_response_data [0] == 'qr_id')
        return false;
        
    // Total columns for each row MUST be 8. else its a improper CSV row
    if (count( $quiz_response_data ) !== 7)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}

function convert_csv_row_to_quiz_response_format( $quiz_response_data ) {

    $status = wp_unslash($quiz_response_data[6]);
    $status = str_replace("};","}",$status);

    $question_response = wp_unslash($quiz_response_data[3]);
    $question_response = str_replace("};","}",$question_response);

    return array(
        'qr_id'             => $quiz_response_data[0],
        'summary_id'        => $quiz_response_data[1],
        'content_piece_id'  => $quiz_response_data[2],
        'question_response' => $question_response,
        'time_taken'        => $quiz_response_data[4],
        'marks_scored'      => $quiz_response_data[5],
        'status'            => $status
    );
}

function sync_quiz_response( $quiz_response_data ) {

    if (quiz_response_exists( $quiz_response_data['qr_id'] )) {
        sync_update_quiz_response( $quiz_response_data );
    } else {
        sync_insert_quiz_response( $quiz_response_data );
    }
}

function sync_insert_quiz_response( $quiz_response_data ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "quiz_question_response",
        $quiz_response_data );

    return $wpdb->insert_id;
}

function sync_update_quiz_response( $quiz_response_data ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "quiz_question_response",
        $quiz_response_data,
        array( 'qr_id' => $quiz_response_data['qr_id'] ) );

    return true;
}

function quiz_response_exists( $qr_id ) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT qr_id FROM {$wpdb->prefix}quiz_question_response WHERE qr_id LIKE %s", $qr_id );
    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function write_to_quiz_response_import_error_log( $quiz_response_data ) {
    //TODO: Handle failed import records here
}

