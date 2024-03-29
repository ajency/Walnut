<?php

function insert_question_response($data)
{
    global $wpdb;

    extract($data);

    $ref_id = 'CP' . $content_piece_id . 'C' . $collection_id . 'D' . $division;

    $insert_data = array(
        'ref_id' => $ref_id,
        'teacher_id' => get_current_user_id(),
        'content_piece_id' => $content_piece_id,
        'collection_id' => $collection_id,
        'division' => $division,
        'status' => $status
    );

    //handling sync status for standalone sites. 
    if (!is_multisite()) 
        $insert_data['sync']=0;

    if (isset($start_date))
        $insert_data['start_date'] = $start_date;

    $record_exists = $wpdb->get_row("select ref_id from {$wpdb->prefix}question_response where ref_id like '$ref_id'");

    if ($record_exists) {

        $update_data = array(
            'start_date' => $start_date
        );

        $wpdb->update($wpdb->prefix . 'question_response', $update_data,
            array('ref_id' => $ref_id));
    } else
        $wpdb->insert($wpdb->prefix . 'question_response', $insert_data,
            array('%s', '%d', '%d', '%d'));

    return $ref_id;
}

// FIXME: $data format expected as comment
/**
 * @param $data array()
 * @return mixed
 */
function update_question_response($data)
{

    global $wpdb;

    extract($data);
    $current_blog = get_current_blog_id();
    switch_to_blog( 1 );

    $question_type = get_post_meta($content_piece_id, 'question_type', true);

    switch_to_blog( $current_blog );

    $update_data = array(
        'teacher_id' => get_current_user_id(),
        'time_taken' => $time_taken,
        'status' => $status
    );

    //handling sync status for standalone sites. 
    if (!is_multisite()) 
        $update_data['sync']=0;
    
    $data_response = '';



    if ($question_response){
        if ($question_type == 'multiple_eval'){
            foreach($question_response as $single_student_response){
                $student_id = $single_student_response['id'];

                unset ($single_student_response['id']);
                $response_meta = array(
                    'qr_ref_id'     => $ref_id,
                    'meta_key'      => $student_id,
                    'meta_value'    => maybe_serialize($single_student_response)
                );
                $meta_exists = $wpdb->get_row("select * from {$wpdb->prefix}question_response_meta where qr_ref_id = '$ref_id' and meta_key = '$student_id'");
                if ($meta_exists){
                    $wpdb->update($wpdb->prefix . 'question_response_meta', $response_meta,
                        array('qr_ref_id' => $ref_id, 'meta_key' => $student_id),
                        array('%s', '%d', '%s'));
                } else
                    $wpdb->insert($wpdb->prefix . 'question_response_meta', $response_meta,
                        array('%s', '%d', '%s'));


//                $wpdb->replace($wpdb->prefix .'question_response_meta',$response_meta);

            }

        }
        else{
            $data_response = maybe_serialize($question_response);
        }
    }

    $update_data['question_response'] = $data_response;

    if ($status == 'completed')
        $update_data['end_date'] = date('Ymdhis');

    $response = $wpdb->update($wpdb->prefix . 'question_response', $update_data,
        array('ref_id' => $ref_id));

    return $response;
}

function get_question_responses($collection_id, $division)
{

    global $wpdb;

    if (!$collection_id || !$division)
        return false;

    $data = array();

    $question_response_qry = $wpdb->prepare("select ref_id from {$wpdb->prefix}question_response
        where collection_id=%d and division= %d ", array($collection_id, $division));

    $responses = $wpdb->get_results($question_response_qry);

    foreach ($responses as $response) {
        $data[] = get_single_question_response($response->ref_id);
    }

    return $data;
}

function get_single_question_response($ref_id)
{

    global $wpdb;

    if (!$ref_id) return false;

    $question_response_qry = $wpdb->prepare("select * from {$wpdb->prefix}question_response
        where ref_id= %s ", $ref_id);

    $question_response = $wpdb->get_results($question_response_qry);

    $numeric_keys = array('teacher_id', 'collection_id', 'content_piece_id', 'division', 'time_taken');

    $response_data = $qr = $list = array();

    foreach ($question_response as $resp) {
        foreach ($resp as $key => $value) {
            if (in_array($key, $numeric_keys))
                $response_data[$key] = (int)$value;
            else
                $response_data[$key] = $value;
        }
        $teacher_data = get_userdata($resp->teacher_id);
        $response_data['teacher_name'] = $teacher_data->display_name;

        $current_blog = get_current_blog_id();
        switch_to_blog(1);
        $question_type = get_post_meta($resp->content_piece_id, 'question_type', true);
        switch_to_blog($current_blog);

        if ($question_type === 'individual') {
            $question_response_array = maybe_unserialize($resp->question_response);
            if ($question_response_array) {
                foreach ($question_response_array as $resp) {
                    $qr[] = (int)$resp;
                }
            }
            $response_data['question_response'] = $qr;
        }
        else if ($question_type === 'multiple_eval'){
            $multiple_eval_query = $wpdb->prepare("SELECT meta_key,meta_value FROM {$wpdb->prefix}question_response_meta WHERE qr_ref_id = %s",$ref_id);
            $student_list = $wpdb->get_results($multiple_eval_query,ARRAY_A);
            if ($student_list) {
                foreach ($student_list as $student) {
                    $stud = maybe_unserialize($student['meta_value']);
                    $stud['id'] = (int)$student['meta_key'];

                     array_push($list,$stud);
                }
            }
            $response_data['question_response'] = $list;
        }
    }

    return $response_data;

}

function clear_user_temp_medias(){
    $userid = get_current_user_id();
    $temp_medias = array('audios','videos');
    
    foreach($temp_medias as $mediatype){
        $temp_path = WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.$mediatype;
        $temp_user_path = $temp_path.DIRECTORY_SEPARATOR.get_current_user_id();
        if(file_exists($temp_user_path)){
            $files = glob($temp_user_path.'/*'); // get all file names from user media temp folder
            foreach($files as $file){ // iterate files
                if(is_file($file))
                    unlink($file); // delete file
            }
            rmdir($temp_user_path);
        }
    }
    
}