<?php

require_once 'functions.php';

function create_question_response(){

    extract($_POST);

    $data = array(
        'collection_id'     => $collection_id,
        'content_piece_id'  => $content_piece_id,
        'division'          => $division
    );

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


function ajax_get_question_response(){
    global $wpdb;
    
    $collection_id= $_GET['collection_id'];
    //$question_id= $_GET['content_piece_id'];
    $division =  $_GET['division'];
    $question_type = 'individual';
    
    $question_response_qry=$wpdb->prepare("select * from {$wpdb->prefix}question_response
        where collection_id=%d and division= %d ", array($collection_id, $division));

    $question_response= $wpdb->get_results($question_response_qry);
    
    foreach($question_response as $k=> $resp){
        foreach($resp as $key=> $val){
            $data[$k][$key] = $val;
            if($key=='question_response'){
                $current_blog=  get_current_blog_id();
                switch_to_blog(1);
                $question_type= get_post_meta($resp->content_piece_id, 'question_type', true);
                switch_to_blog($current_blog);
                if($question_type=='individual'){
                    $q_resp_arr=array();
                    $qresponse = maybe_unserialize($val);
                    if($qresponse)
                        foreach($qresponse as $qres){
                            $q_resp_arr[]= (int) $qres;
                        }
                       $data[$k]['question_response']=$q_resp_arr; 
                }
            }
        }
    }
    wp_send_json(array('data'=>$data, 'status'=>'OK'));
}


add_action( 'wp_ajax_get-question-response', 'ajax_get_question_response' );


function ajax_update_question_response_logs() {

    global $wpdb;

    $ref_id= $_POST['ref_id'];

    $log_response= update_question_response_logs($ref_id);

    wp_send_json($log_response);
}

add_action( 'wp_ajax_update-question-response-logs', 'ajax_update_question_response_logs' );