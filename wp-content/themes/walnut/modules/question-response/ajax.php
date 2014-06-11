<?php

require_once 'functions.php';

function create_question_response(){

    extract($_POST);

    $data = array(
        'collection_id'     => $collection_id,
        'content_piece_id'  => $content_piece_id,
        'division'          => $division,
        'status'            => $status,
        'teacher_id'        => get_current_user_id()
    );

    if(isset($start_date))
        $data['start_date']= $start_date;

    $response_data = insert_question_response($data);

    wp_send_json(array('ref_id'=>$response_data));
}
add_action( 'wp_ajax_create-question-response', 'create_question_response');

function ajax_update_question_response() {
    
    extract($_POST);
    
    $data = array(
        'ref_id'            => $ref_id,
        'question_response' => $question_response,
        'time_taken'        => $time_taken,
        'status'            => $status
    );
            
    $response_data = update_question_response($data);
    
    wp_send_json($response_data);
}
add_action( 'wp_ajax_update-question-response', 'ajax_update_question_response' );


function ajax_get_question_responses(){

    $collection_id= $_GET['collection_id'];

    $division =  $_GET['division'];
    
    $data= get_question_responses($collection_id, $division);

    wp_send_json(array('data'=>$data, 'status'=>'OK'));
}


add_action( 'wp_ajax_get-question-response', 'ajax_get_question_responses' );