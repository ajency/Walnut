<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 28/06/14
 * Time: 2:07 PM
 */


function save_content_module($data = array()) {
    global $wpdb;

    $duration= (int) $data['duration'];

    if($data['minshours']=='hrs')
        $duration = $duration * 60;

    $content_data = array(
        'name'              => $data['name'],
        'term_ids'          => maybe_serialize($data['term_ids']),
        'last_modified_on'  => date('y-m-d H:i:s'),
        'last_modified_by'  => get_current_user_id(),
        'duration'          => $duration,
        'status'            => $data['status']
    );

    if (isset($data['id'])) {
        $content_module = $wpdb->update($wpdb->prefix . 'content_collection', $content_data, array('id' => $data['id']));
        $module_id = (int) $data['id'];
    } else {
        $content_data['created_on'] = date('y-m-d H:i:s');
        $content_data['created_by'] = get_current_user_id();
        $content_module = $wpdb->insert($wpdb->prefix . 'content_collection', $content_data);
        $module_id = $wpdb->insert_id;
    }
    if ($content_module) {

        $meta_description = array(
            'collection_id' => $module_id,
            'meta_key' => 'description',
            'meta_value' => maybe_serialize($data['description'])
        );

        if (isset($data['id']))
            $content_meta = $wpdb->update($wpdb->prefix . 'collection_meta', $meta_description, array('collection_id' => $data['id'], 'meta_key'=>'description'));
        else
            $content_meta = $wpdb->insert($wpdb->prefix . 'collection_meta', $meta_description);

        $meta_textbook = array(
            'collection_id' => $module_id,
            'meta_key' => 'textbook',
            'meta_value' => $data['term_ids']['textbook']
        );
        if (isset($data['id']))
            $textbook_meta = $wpdb->update($wpdb->prefix . 'collection_meta', $meta_textbook, array('collection_id' => $data['id'], 'meta_key'=>'textbook'));
        else
            $textbook_meta = $wpdb->insert($wpdb->prefix . 'collection_meta', $meta_textbook);
    }

    return $module_id;
}

function update_module_content_pieces($data= array()){
    global $wpdb;
    $content_pieces = maybe_serialize($data['content_pieces']);

    $exists_qry = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}collection_meta WHERE
        collection_id=%d AND meta_key=%s", $data['id'], 'content_pieces');

    $exists = $wpdb->get_results($exists_qry);

    if($exists){
        $content_pieces_qry = $wpdb->prepare("UPDATE {$wpdb->prefix}collection_meta SET
            meta_value=%s WHERE collection_id=%d AND meta_key=%s",
            $content_pieces,$data['id'],'content_pieces' );
    }

    else{
        $content_pieces_qry = $wpdb->prepare("INSERT into {$wpdb->prefix}collection_meta
            (collection_id, meta_key, meta_value) VALUES (%d,%s,%s)",
            $data['id'],'content_pieces',$content_pieces );
    }

    $wpdb->query($content_pieces_qry);
}

function update_training_module_status($args=array()){

    global $wpdb;

    extract($args);

    if(!isset($teacher_id))
        $teacher_id= get_current_user_id();

    $data=array(
        'division_id'=> $division,
        'collection_id'=>$id,
        'teacher_id'=> $teacher_id,
        'date'=>date('Ymd'),
        'status'=>$status
    );

    if($status=='completed' || $status=='scheduled'){
        if($status=='scheduled'){
            $date = date('Ymd',strtotime($training_date));
            $data['date']= $date;
        }
        $content_module = $wpdb->insert($wpdb->prefix . 'training_logs', $data);
    }

    else { //check if the last status was started/ scheduled and change it appropriately
        $chk_logs_qry = $wpdb->prepare("select id,status from
            {$wpdb->prefix}training_logs where division_id=%d and
                collection_id=%d order by id desc limit 1",$division,$id);

        $chk_logs= $wpdb->get_results($chk_logs_qry);

        if($chk_logs){
            foreach($chk_logs as $log){
                if($log->status=='started'){
                    $data['status'] = 'resumed';
                    $content_module = $wpdb->insert($wpdb->prefix . 'training_logs', $data);
                }

                if($log->status=='scheduled'){
                    $data['status'] = 'started';
                    $content_module = $wpdb->update($wpdb->prefix . 'training_logs', $data, array('id'=>$log->id));
                }
            }
        }
        else {
            $data['status'] = 'started';
            $content_module = $wpdb->insert($wpdb->prefix . 'training_logs', $data);
        }
    }

    return $content_module;

}

function get_all_content_modules($args=array()){

    #fixme : fetch modules based on post_status to implemented properly

    $current_blog= get_current_blog_id();
    switch_to_blog(1);

    global $wpdb;

    $published_modules = $archived_modules = $all_content_modules = null;
    $id=0;

    if(isset($args['textbook'])){

        if(isset($args['post_status'])){
            $published_query = $wpdb->prepare(
                'SELECT id FROM '.$wpdb->prefix.'content_collection WHERE
                    status LIKE %s and term_ids LIKE %s',
                array($args['post_status'], '%\"'.$args['textbook'].'\";%')
            );
            $published_modules = $wpdb->get_results($published_query);
        }
        else{
            $published_query = $wpdb->prepare('SELECT id FROM '.$wpdb->prefix.'content_collection WHERE status = "publish" and term_ids LIKE %s', '%\"'.$args['textbook'].'\";%');
            $archived_query =  $wpdb->prepare('SELECT id FROM '.$wpdb->prefix.'content_collection WHERE status = "archive" and term_ids LIKE %s', '%\"'.$args['textbook'].'\";%');
            $published_modules = $wpdb->get_results($published_query);
            $archived_modules = $wpdb->get_results($archived_query);
        }

    }
    elseif(isset($args['class_id'])){

        $textbooks=get_textbooks_for_class($args['class_id']);
        $textbook_ids=array();
        foreach($textbooks as $book)
            $textbook_ids[]=$book->term_id;

        $textbook_ids = join(',',$textbook_ids);
        $all_query = $wpdb->prepare("SELECT collection_id FROM {$wpdb->prefix}collection_meta
            WHERE meta_key like %s AND meta_value in ($textbook_ids)", 'textbook');
        $all_content_modules = $wpdb->get_results($all_query);
    }

    else{
//        $query = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}content_collection where status = 'publish'", null);
//        $archived_query = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}content_collection where status = 'archive'", null);
        $all_query = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}content_collection", null);
        $all_content_modules = $wpdb->get_results($all_query);
    }

    $content_data=array();
    switch_to_blog($current_blog);

    $division = '';

    if(isset($args['division']))
        $division = $args['division'];

    if( !is_null($published_modules))
        foreach($published_modules as $item)
            $content_data[]=  get_single_content_module($item->id, $division , 'publish');

    if( !is_null($all_content_modules))
        foreach($all_content_modules as $item){
            $id=$item->id;
            if ($id == 0)
                $id = $item->collection_id;
            $content_data[]=  get_single_content_module($id, $division);
        }

    if( !is_null($archived_modules))
        foreach($archived_modules as $item){
            $archived_data = get_single_content_module($item->id, $division, 'archive');
            if($archived_data)
                $content_data[] = $archived_data;
        }

    switch_to_blog($current_blog);
    return $content_data;
}

function get_single_content_module($id, $division='', $post_status=''){

    global $wpdb;


    $query = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id= %d", $id);

    $data = $wpdb->get_row($query);


    $data->term_ids         = maybe_unserialize ($data->term_ids);
    $duration               = $data->duration;
    $data->minshours        ='mins';
    $data->total_minutes    = $data->duration; // only used for sorting accoring to time
    if($duration >= 60){
        $data->duration     = $duration/60;
        $data->minshours    ='hrs';
    }
    $data->post_status = $post_status;

    $query_description = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}collection_meta
        WHERE collection_id=%d",$id);

    $description= $wpdb->get_results($query_description);

    $data->description=$data->content_pieces=array();

    foreach($description as $key=>$value){
        $meta_val = maybe_unserialize ($value->meta_value);

        if ($value->meta_key=='description')
            $data->description= $meta_val;

        if ($value->meta_key=='content_pieces' )
            $data->content_pieces= $meta_val;

    }


    if($division){
        $status_dets = get_content_module_status($id, $division,$data->content_pieces);
        $data->status= $status_dets['status'];
        $data->training_date= $status_dets['start_date'];
    }
    if($post_status == 'archive'){
        if($data->status == 'not started')
            return false;
    }
    return $data;

}

function get_content_module_status($id, $division, $content_pieces){

    global $wpdb;
    $start_date='';

    $check_responses_query= $wpdb->prepare("SELECT content_piece_id, status, start_date  FROM
            {$wpdb->prefix}question_response WHERE collection_id=%d AND
                division=%d",
        $id, $division);

    $module_responses  = $wpdb->get_results($check_responses_query);

    if(!$module_responses)
        $status='not started';

    if($module_responses){

        $status=($module_responses[0]->status === 'scheduled')?'scheduled':'started';

        $start_date= __u::last($module_responses)->start_date;
        $response_content_ids=array();

        foreach($module_responses as $response){
            if($response->status=='completed')
                $response_content_ids[]= $response->content_piece_id;
        }

        if(__u::difference($content_pieces,$response_content_ids) == null)
            $status='completed';
    }
    $status_data=array(
        'status'     => $status,
        'start_date' => $start_date
    );

    return $status_data;
}


function get_module_taken_by($module_id, $blog_id){

    global $wpdb;

    switch_to_blog($blog_id);

    $teachers = '';
    $teacher_names= array();

    $question_response_table = $wpdb->prefix . "question_response";

    $taken_by_query = $wpdb->prepare(
        "SELECT teacher_id FROM $question_response_table
                WHERE collection_id = %d",
        array($module_id)
    );

    $taken_by_result=$wpdb->get_results($taken_by_query, ARRAY_A);

    switch_to_blog(1);
    if(sizeof($taken_by_result>0)){
        $taken_by= (__u::unique(__u::flatten($taken_by_result)));

        foreach($taken_by as $teacher){
            $teacher_data = get_userdata($teacher);
            $teacher_names[]= $teacher_data->display_name;
        }
        if($teacher_names)
            $teachers= join(',', $teacher_names);
    }

    switch_to_blog($blog_id);

    return $teachers;
}


function get_module_end_date($module_id, $blog_id){

    global $wpdb;

    switch_to_blog($blog_id);

    $question_response_table = $wpdb->prefix . "question_response";

    $completed_date_query = $wpdb->prepare(
        "SELECT max(end_date) FROM $question_response_table
                WHERE collection_id = %d",
        array($module_id)
    );

    $end_date=$wpdb->get_var($completed_date_query);

    $end_date = date('d M Y', strtotime($end_date));

    switch_to_blog(1);

    return $end_date;

}

function get_module_textbook($module_id){

    global $wpdb;

    $collection_meta_table = $wpdb->base_prefix . "collection_meta";

    $module_textbook_query = $wpdb->prepare(
        "SELECT meta_value FROM $collection_meta_table
                WHERE collection_id = %d
                AND meta_key LIKE %s",
        array($module_id, 'textbook')
    );

    $textbook_id=$wpdb->get_var($module_textbook_query);

    return $textbook_id;

}

function get_module_name($module_id){

    global $wpdb;

    $content_collection_table = $wpdb->base_prefix . "content_collection";

    $module_name_query = $wpdb->prepare(
        "SELECT name FROM $content_collection_table
                WHERE id=%d",
        $module_id
    );

    $module_name=$wpdb->get_var($module_name_query);

    return $module_name;

}