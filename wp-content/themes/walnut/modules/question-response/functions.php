<?php

function insert_question_response($data){
    global $wpdb;

    extract($data);

    $ref_id= 'CP'.$content_piece_id.'C'.$collection_id.'D'.$division;

    $insert_data= array(
        'ref_id'                => $ref_id,
        'teacher_id'            => get_current_user_id(),
        'content_piece_id'      => $content_piece_id,
        'collection_id'         => $collection_id,
        'division'              => $division,
        'status'                => $status
    );

    if(isset($start_date))
        $insert_data['start_date']= $start_date;

    $record_exists= $wpdb->get_row("select ref_id from {$wpdb->prefix}question_response where ref_id like '$ref_id'");

    if($record_exists){

        $update_data=array(
            'start_date'=> $start_date
        );

        $wpdb->update($wpdb->prefix . 'question_response', $update_data,
            array('ref_id'=>$ref_id) );
    }

    else
        $wpdb->insert($wpdb->prefix . 'question_response', $insert_data,
            array('%s','%d','%d','%d') );

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
        'teacher_id'            => get_current_user_id(),
        'question_response'     => $data_response,
        'time_taken'            => $time_taken,
        'status'                => $status
    );

    if($status=='completed')
        $update_data['end_date']= date('Ymdhis');

    $response = $wpdb->update($wpdb->prefix . 'question_response', $update_data,
            array('ref_id'=>$ref_id) );
    
    return $response;
}

function get_question_responses($collection_id, $division){

    global $wpdb;

    if (!$collection_id || !$division)
        return false;

    $data= array();

    $question_response_qry=$wpdb->prepare("select ref_id from {$wpdb->prefix}question_response
        where collection_id=%d and division= %d ", array($collection_id, $division));

    $responses= $wpdb->get_results($question_response_qry);

    foreach($responses as $response){
        $data[] = get_single_question_response($response->ref_id);
    }

    return $data;
}

function get_single_question_response($ref_id){

    global $wpdb;

    if(!$ref_id) return false;

    $question_response_qry=$wpdb->prepare("select * from {$wpdb->prefix}question_response
        where ref_id= %s ", $ref_id);

    $question_response= $wpdb->get_results($question_response_qry);

    $numeric_keys=array('teacher_id','collection_id','content_piece_id','division','time_taken');

    $response_data=$qr= array();

    foreach($question_response as $resp){
        foreach($resp as $key=>$value){
            if(in_array($key, $numeric_keys))
                $response_data[$key]=(int) $value;
            else
                $response_data[$key]=$value;
        }
        $teacher_data= get_userdata($resp->teacher_id);
        $response_data['teacher_name']= $teacher_data->display_name;

        $current_blog=get_current_blog_id();
        switch_to_blog(1);
        $question_type= get_post_meta($resp->content_piece_id, 'question_type', true);
        switch_to_blog($current_blog);

        if($question_type === 'individual'){
            $question_response_array= maybe_unserialize($resp->question_response);
            foreach($question_response_array as $resp){
                $qr[]= (int) $resp;
            }
            $response_data['question_response']=$qr;
        }
    }

    return $response_data;

}