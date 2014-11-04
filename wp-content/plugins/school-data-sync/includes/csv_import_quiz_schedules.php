<?php

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

function sds_read_quiz_schedules_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    $interpreter->addObserver( function ( array $quiz_schedule ) {

        if (sds_validate_quiz_schedule_csv_row( $quiz_schedule ) === true) {

            $quiz_schedule = sds_convert_csv_row_to_quiz_schedule_format( $quiz_schedule );
            sds_sync_quiz_schedule( $quiz_schedule );

        } else 
            sds_write_to_quiz_schedule_import_error_log( $quiz_schedule );
    } );

    $lexer->parse( $file_path, $interpreter );
}

function sds_validate_quiz_schedule_csv_row( $quiz_schedule ) {

    if (!is_array( $quiz_schedule ))
        return new WP_Error("", "Not a valid record");

    if($quiz_schedule [0] == 'quiz_id')
        return false;
        
    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $quiz_schedule ) !== 4)
        return new WP_Error("", "Column count for csv row not proper");

    // TODO: add more validation checks here/ May be for each column to be valid

    return true;
}

/**
 * @param $quiz_schedule Expected array = array(CP143C59D123456011,78,143,59,123456011,(few||[]),75.69400024414062,2014-06-10,2014-6-6,completed,0)
 * @return array(
 * 'quiz_id' => '309',
 * 'division_id	' => 3,	
 * 'schedule_from' => '2014-12-11',
 * 'schedule_to' => '2014-12-31',
 * 'status' => 0
 * );
 */
 
function sds_convert_csv_row_to_quiz_schedule_format( $quiz_schedule ) {

    return array(
        'quiz_id' 		=> $quiz_schedule[0],
        'division_id' 	=> $quiz_schedule[1],
        'schedule_from' => $quiz_schedule[2],
        'schedule_to' 	=> $quiz_schedule[3],
        'sync'          => 1
    );
}

function sds_sync_quiz_schedule( $quiz_schedule ) {

    if (sds_quiz_schedule_exists( $quiz_schedule['quiz_id'], $quiz_schedule['division_id'])) {
        sds_sync_update_quiz_schedule( $quiz_schedule );
    } else {
        sds_sync_insert_quiz_schedule( $quiz_schedule );
    }
}

function sds_sync_insert_quiz_schedule( $quiz_schedule ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "quiz_schedules",
        $quiz_schedule );

    return true;
}

function sds_sync_update_quiz_schedule( $quiz_schedule ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "quiz_schedules",
	        $quiz_schedule,
	        array( 
	        	'quiz_id' => $quiz_schedule['ref_id'],
	        	'division_id' => $quiz_schedule['division_id']
	        	)
        	);
    return true;
}

function sds_quiz_schedule_exists( $quiz_id, $division_id) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT quiz_id FROM {$wpdb->prefix}quiz_schedules 
    			WHERE quiz_id  = %d 
    			AND division_id LIKE %s",
    			$quiz_id, $division_id );

    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function sds_write_to_quiz_schedule_import_error_log( $quiz_schedule ) {
    //TODO: Handle failed import records here
}
