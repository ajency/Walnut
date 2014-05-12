<?php

function insert_question_response($data){
    global $wpdb;

    extract($data);

    $ref_id= 'CP'.$content_piece_id.'C'.$collection_id.'D'.$division;

    $insert_data= array(
        'ref_id'                => $ref_id,
        'content_piece_id'      => $content_piece_id,
        'collection_id'         => $collection_id,
        'division'              => $division,
        'status'                => 'started'
    );

    $wpdb->insert($wpdb->prefix . 'question_response', $insert_data,
        array('%s','%d','%d','%d') );

    update_question_response_logs($ref_id);

    return $ref_id;
}

function update_question_response($data){
    
    global $wpdb;

    extract($data);

    if($question_response)
        $data_response= maybe_serialize($question_response);
    else
        $data_response='';
    
    $update_data= array(
        'question_response'     => $data_response,
        'total_time'            => $total_time,
        'status'                => 'completed'
    );

    $response = $wpdb->update($wpdb->prefix . 'question_response', $update_data,
            array('ref_id'=>$ref_id) );

    
    return $response;
}


function update_question_response_logs($ref_id){

    global $wpdb;

    $response= $wpdb->insert(
                            $wpdb->prefix . 'question_response_logs',
                            array('qr_ref_id'=>$ref_id),
                            array('%s')
                        );

    return $response;

}