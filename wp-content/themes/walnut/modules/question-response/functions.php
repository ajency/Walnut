<?php

function update_question_response($data){
    
    global $wpdb;
   
    $data_response= maybe_serialize($data['question_response']);
    
    $insertdata= array(
        'collection_id'         => $data['collection_id'],
        'content_piece_id'      => $data['content_piece_id'],
        'division'              => $data['division'],
        'date_created'          => date('Ymd'),
        'date_modified'         => date('Ymd'),
        'total_time'            => 0,
        'question_response'     => $data_response,
        'time_started'          => '',
        'time_completed'        =>''
        
    );
    
    if (!isset($data['id']) || $data['id']==0){
        $response = $wpdb->insert($wpdb->prefix . 'question_response', $insertdata, 
                array('%d','%d','%d','%s','%s','%d','%s','%s','%s') );
        $response_id =  $response = $wpdb->insert_id;
    }
    else {
        $updatedata = array(
            'date_modified'     => date('Ymd'),
            'question_response' => $data_response,
        );
        $response_id = $data['id'];
        
        $response = $wpdb->update($wpdb->prefix . 'question_response', $updatedata, 
                array('id'=>$response_id) );
        
    }
    
    
    return $response_id;
}


