<?php

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

function read_quiz_schedules_csv_file( $file_path ) {

    $lexer = new Lexer(new LexerConfig());
    $interpreter = new Interpreter();

    $interpreter->addObserver( function ( array $quiz_schedule ) {

        if (validate_quiz_schedule_csv_row( $quiz_schedule ) === true) {

            $quiz_schedule = convert_csv_row_to_quiz_schedule_format( $quiz_schedule );
            sync_quiz_schedule( $quiz_schedule );

        } else 
            write_to_quiz_schedule_import_error_log( $quiz_schedule );
    } );

    $lexer->parse( $file_path, $interpreter );
}

function validate_quiz_schedule_csv_row( $quiz_schedule ) {

    if (!is_array( $quiz_schedule ))
        return new WP_Error("", "Not a valid record");

    if($quiz_schedule [0] == 'quiz_id')
        return false;
        
    // Total columns for each row MUST be 11. else its a improper CSV row
    if (count( $quiz_schedule ) !== 5)
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
 
function convert_csv_row_to_quiz_schedule_format( $quiz_schedule ) {

    return array(
        'quiz_id' 		=> $quiz_schedule[0],
        'division_id' 	=> $quiz_schedule[1],
        'schedule_from' => $quiz_schedule[2],
        'schedule_to' 	=> $quiz_schedule[3]
    );
}

function sync_quiz_schedule( $quiz_schedule ) {

    if (quiz_schedule_exists( $quiz_schedule['quiz_id'], $quiz_schedule['division_id'])) {
        sync_update_quiz_schedule( $quiz_schedule );
    } else {
        sync_insert_quiz_schedule( $quiz_schedule );
    }
}

function sync_insert_quiz_schedule( $quiz_schedule ) {

    global $wpdb;

    $wpdb->insert( $wpdb->prefix . "quiz_schedules",
        $quiz_schedule );

    return true;
}

function sync_update_quiz_schedule( $quiz_schedule ) {

    global $wpdb;

    $wpdb->update( $wpdb->prefix . "quiz_schedules",
	        $quiz_schedule,
	        array( 
	        	'quiz_id' => $quiz_schedule['quiz_id'],
	        	'division_id' => $quiz_schedule['division_id']
	        	)
        	);
    return true;
}

function quiz_schedule_exists( $quiz_id, $division_id) {

    global $wpdb;

    $query = $wpdb->prepare( "SELECT quiz_id FROM {$wpdb->prefix}quiz_schedules 
    			WHERE quiz_id  = %d 
    			AND division_id LIKE %s",
    			$quiz_id, $division_id );

    $record = $wpdb->get_var( $query );

    return is_string( $record );
}

function write_to_quiz_schedule_import_error_log( $quiz_schedule ) {
    //TODO: Handle failed import records here
}
