<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 28/06/14
 * Time: 2:07 PM
 */


function save_content_module($data = array()) {
    global $wpdb;

    $duration = (int)$data['duration'];

    if($data['minshours']=='hrs')
        $duration = $duration * 60;

    $content_data = array(
        'name'              => $data['name'],
        'term_ids'          => maybe_serialize($data['term_ids']),
        'last_modified_on'  => date('y-m-d H:i:s'),
        'last_modified_by'  => get_current_user_id(),
        'duration'          => $duration,
        'post_status'       => $data['post_status']
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

function get_all_content_modules($args=array()){

    global $wpdb;

    $post_status= 'publish';

    if(isset($args['post_status']))
        $post_status = $args['post_status'];

    $content_modules_ids_array = get_modules_by_post_status($post_status);

    if(isset($args['search_str']) && trim($args['search_str']) !=''){
        $search_results = get_modules_by_search_string($args['search_str']);

    }

    $content_module_ids = join(',',__u::flatten($content_modules_ids_array));

    if(isset($args['textbook'])){

        $modules_query = $wpdb->prepare(
            "SELECT id FROM {$wpdb->base_prefix}content_collection WHERE
                term_ids LIKE %s AND id in ($content_module_ids)",
            array('%\"'.$args['textbook'].'\";%')
        );
        $content_modules = $wpdb->get_results($modules_query, ARRAY_A);
        $content_modules_ids_array = __u::flatten($content_modules);

    }

    elseif(isset($args['class_id'])){

        $textbooks=get_textbooks_for_class($args['class_id']);
        $textbook_ids=array();
        foreach($textbooks as $book)
            $textbook_ids[]=$book->term_id;

        $textbook_ids = join(',',$textbook_ids);
        $modules_query = $wpdb->prepare(
            "SELECT collection_id FROM {$wpdb->prefix}collection_meta
                WHERE meta_key like %s
                AND meta_value in ($textbook_ids)
                AND collection_id in ($content_module_ids)", 'textbook');
        $content_modules = $wpdb->get_results($modules_query, ARRAY_A);
        $content_modules_ids_array = __u::flatten($content_modules);

    }


    $division = '';
    if(isset($args['division'])){

       $division = $args['division'];

       $archive_ids = get_modules_by_post_status('archive');

        foreach($archive_ids as $id){
            $taken_status= get_content_module_status($id, $division);
            if($taken_status['status']!='not started')
                $content_modules_ids_array[] = $id;
        }

    }

    $content_data=array();

    foreach($content_modules_ids_array as $id)
        $content_data[]=  get_single_content_module($id, $division);

    return $content_data;
}

function get_modules_by_search_string($search_string){


}

function get_modules_by_post_status($post_status='publish'){

    global $wpdb;

    if ($post_status=='any')
        $post_status='%%';

    $modules_by_status_query = $wpdb->prepare('SELECT id FROM '.$wpdb->base_prefix.'content_collection
            WHERE post_status LIKE %s', $post_status);

    $modules_by_status = $wpdb->get_results($modules_by_status_query, ARRAY_A);

    $module_ids = __u::flatten($modules_by_status);

    return $module_ids;

}

function get_single_content_module($id, $division=''){

    global $wpdb;


    $query = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id= %d", $id);

    $data = $wpdb->get_row($query);

    $data->id               = (int) $data->id;
    $data->term_ids         = maybe_unserialize ($data->term_ids);
    $duration               = $data->duration;
    $data->minshours        ='mins';
    $data->total_minutes    = $data->duration; // only used for sorting accoring to time
    if($duration >= 60){
        $data->duration     = $duration/60;
        $data->minshours    ='hrs';
    }

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
        $data->end_date = $status_dets['end_date'];
    }

    return $data;

}

function get_content_module_status($id, $division, $content_pieces=array()){

    global $wpdb;
    $start_date='';

    if(sizeof($content_pieces==0)){

        $content_pieces_query= $wpdb->prepare("SELECT meta_value FROM {$wpdb->base_prefix}collection_meta
            WHERE collection_id = %d AND meta_key like %s",
            array($id, 'content_pieces')
        );

        $content_pieces  = $wpdb->get_var($content_pieces_query);
        $content_pieces = __u::flatten(maybe_unserialize($content_pieces));
    }

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
        'start_date' => $start_date,
        'end_date'   => get_module_end_date($id)
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


    return $teachers;
}


function get_module_end_date($module_id, $blog_id=0){

    global $wpdb;

    if($blog_id>0)
        switch_to_blog($blog_id);

    $question_response_table = $wpdb->prefix . "question_response";

    $completed_date_query = $wpdb->prepare(
        "SELECT max(end_date) FROM $question_response_table
                WHERE collection_id = %d",
        array($module_id)
    );

    $end_date=$wpdb->get_var($completed_date_query);

    $end_date = date('d M Y', strtotime($end_date));

    restore_current_blog();

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