<?php

require_once 'functions.php';

function save_question_response() {
    
    extract($_POST);
    
    $data = array(
        'collection_id'=>$collection_id,
        'content_piece_id'=> $content_piece_id,
        'question_response'=>$question_response
    );
    
    if(isset($id))
        $data['id']=$id;
            
    $response_id = update_question_response($data);
    
    wp_send_json(array('id'=>$response_id));
}
add_action( 'wp_ajax_create-question-response', 'save_question_response' );
add_action( 'wp_ajax_update-question-response', 'save_question_response' );


function get_question_response(){
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
            if($key=='question_response' && $question_type=='individual'){
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
    
    wp_send_json(array('data'=>$data, 'status'=>'OK'));
}


add_action( 'wp_ajax_get-question-response', 'get_question_response' );