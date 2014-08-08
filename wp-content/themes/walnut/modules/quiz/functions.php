<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:47 PM
 */

function save_quiz_module ($data = array()) {

    global $wpdb;

    $duration = $data['duration'];

    if ($data['minshours'] == 'hrs')
        $duration = $duration * 60;

    $content_data = array(
        'name' => $data['name'],
        'term_ids' => maybe_serialize($data['term_ids']),
        'last_modified_on' => date ('y-m-d H:i:s'),
        'last_modified_by' => get_current_user_id (),
        'duration' => $duration,
        'post_status' => $data['post_status'],
        'type' => $data['type']
    );

    if (isset($data['id'])) {
        $content_module = $wpdb->update ($wpdb->base_prefix . 'content_collection', $content_data, array('id' => $data['id']));
        $module_id = (int)$data['id'];
    } else {
        $content_data['created_on'] = date ('y-m-d H:i:s');
        $content_data['created_by'] = get_current_blog_id ();

        $content_module = $wpdb->insert ($wpdb->base_prefix . 'content_collection', $content_data);
        $module_id = $wpdb->insert_id;

        //        print_r($content_data) ; exit;
    }

    if ($content_module) {
        $meta_description = array(
            'collection_id' => $module_id,
            'meta_key' => 'description',
            'meta_value' => maybe_serialize ($data['description'])
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_description, array('collection_id' => $data['id'], 'meta_key' => 'description'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_description);

        $meta_permission = array(
            'collection_id' => $module_id,
            'meta_key' => 'permissions',
            'meta_value' => maybe_serialize ($data['permissions'])
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_permission, array('collection_id' => $data['id'], 'meta_key' => 'permissions'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_permission);

        $meta_quiz_type = array(
            'collection_id' => $module_id,
            'meta_key' => 'quiz_type',
            'meta_value' => $data['quiz_type']
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_quiz_type, array('collection_id' => $data['id'], 'meta_key' => 'quiz_type'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_quiz_type);

        $quiz_meta = array(
            'marks' => $data['marks'],
            'negMarksEnable' => $data['negMarksEnable'],
            'negMarks' => $data['negMarks'],
            'message' => $data['message']
        );
        $meta_quiz_meta = array(
            'collection_id' => $module_id,
            'meta_key' => 'quiz_meta',
            'meta_value' => maybe_serialize ($quiz_meta)
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_quiz_meta, array('collection_id' => $data['id'], 'meta_key' => 'quiz_meta'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_quiz_meta);

    }

    return $module_id;
}


function get_single_quiz_module ($id) {
    global $wpdb;

    $select_query = $wpdb->prepare ("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id = %d", $id);
    $data = $wpdb->get_row ($select_query);
    $data->id = (int)$data->id;

    $duration = (int)$data->duration;
    $data->term_ids = maybe_unserialize($data->term_ids);
    $data->duration = $duration;
    $data->minshours = 'mins';
    $data->total_minutes = (int)$data->duration;
    if ($duration >= 60) {
        $data->minshours = 'hrs';
        $data->duration = $duration/60;
    }

    $query_meta = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}collection_meta WHERE collection_id = %d",$id);
    $quiz_details = $wpdb->get_results($query_meta);

    $data->permissions = $data->description = array();

//    print_r $quiz_details; exit;

    foreach ($quiz_details as $key=>$value){

        if ($value->meta_key == 'permissions')
            $permissions = maybe_unserialize($value->meta_value);
            if ($permissions)
                foreach ($permissions as $k=>$v){
                    $permissions[$k] = filter_var($permissions[$k], FILTER_VALIDATE_BOOLEAN);
                }
            $data->permissions = $permissions;

        if ($value->meta_key == 'description')
            $data->description = maybe_unserialize($value->meta_value);

        if ($value->meta_key == 'quiz_type')
            $data->quiz_type = $value->meta_value;

        if ($value->meta_key == 'content_layout')
            $data->content_layout = maybe_unserialize($value->meta_value);

        if ($value->meta_key == 'quiz_meta'){
            $quiz_meta = maybe_unserialize($value->meta_value);
            $data->marks = (int)$quiz_meta['marks'];
            $data->negMarksEnable = $quiz_meta['negMarksEnable'];
            $data->negMarks = (int)$quiz_meta['negMarks'];
            $data->message = $quiz_meta['message'];
        }
    }
    $content_ids = array();
    if ($data->content_layout){
        foreach($data->content_layout as $content){
            if ($content['type'] == 'content-piece'){
                $content_ids[] = $content['id'];
            }

            elseif ($content['type'] == 'content_set'){
                $set_content_ids = generate_set_items($content['data']['terms_id'],$content['data']['lvl1'],
                    $content['data']['lvl2'],$content['data']['lvl3'],$content_ids);
                foreach($set_content_ids as $id){
                    $content_ids[] = $id;
                }
            }

        }
        $data->content_pieces = $content_ids;
    }

    return $data;
}

function generate_set_items($term_ids, $level1,$level2,$level3,$content_ids){
    global $wpdb;
//    get id for all student type question
    $query = "select ID from {$wpdb->base_prefix}posts
            where ID in (select post_id from {$wpdb->base_prefix}postmeta
                        where meta_key = 'content_type'
                        and meta_value = 'student_question')
             and post_status = 'publish'";
    $stud_quest_ids = $wpdb->get_col($query);

    $stud_quest_ids = __u::reject($stud_quest_ids,function($num){
        return __u::includ($content_ids,$num);
    });

    $stud_quest_ids_string = implode(',',$stud_quest_ids);
    $term_id = '';
    foreach($term_ids as $val){
        if ($val){
            $term_id = $val;
        }
    }
    $term_id_query = '%"'.$term_id.'"%';
    //    get id for all student type question with term id
    $query = "select post_id from {$wpdb->base_prefix}postmeta
              where post_id in ({$stud_quest_ids_string})
              and meta_key = 'content_piece_meta'
              and meta_value like %s";
    $quest_ids_for_terms_id =  $wpdb->get_col($wpdb->prepare($query,$term_id_query));

    $complete_ids = array();
    get_id_from_level($quest_ids_for_terms_id,$level1,'1',$complete_ids);
    get_id_from_level($quest_ids_for_terms_id,$level2,'2',$complete_ids);
    get_id_from_level($quest_ids_for_terms_id,$level3,'3',$complete_ids);
    shuffle($complete_ids);

    return $complete_ids;

}

//get ids for each level accoring to the number specified for that level
//return it in $complete
function get_id_from_level($ids, $count , $level,&$complete){
    global $wpdb;
    $ids_string = implode(',',$ids);
    $query = "select post_id from {$wpdb->base_prefix}postmeta
              where post_id in ({$ids_string})
              and meta_key = 'difficulty_level'
              and meta_value = %s
              order by RAND()
              limit %d";
    $level_ids = $wpdb->get_col($wpdb->prepare($query,$level,(int)$count));
    foreach($level_ids as $val){
        $complete[]=$val;
    }
}



function update_quiz_content_layout($data= array()){
    global $wpdb;
    $content_layout = maybe_serialize($data['content_layout']);

    $exists_qry = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}collection_meta WHERE
        collection_id=%d AND meta_key=%s", $data['id'], 'content_layout');

    $exists = $wpdb->get_results($exists_qry);

    if($exists){
        $content_layout_qry = $wpdb->prepare("UPDATE {$wpdb->prefix}collection_meta SET
            meta_value=%s WHERE collection_id=%d AND meta_key=%s",
            $content_layout,$data['id'],'content_layout' );
    }

    else{
        $content_layout_qry = $wpdb->prepare("INSERT into {$wpdb->prefix}collection_meta
            (collection_id, meta_key, meta_value) VALUES (%d,%s,%s)",
            $data['id'],'content_layout',$content_layout );
    }

    $wpdb->query($content_layout_qry);
}


function get_all_quiz_modules($args){
    global $wpdb;


    if ($args['post_status'] =='any')
            $args['post_status'] = '';
    if ( $args['textbook'] =='any')
            $args['textbook'] = '';
    if ( $args['quiz_type'] =='any')
            $args['quiz_type'] = '';


    $query_string = "SELECT DISTINCT post.id
            FROM {$wpdb->base_prefix}content_collection AS post,
                {$wpdb->base_prefix}collection_meta AS meta
            WHERE meta.collection_id = post.id
            AND post.type = %s
            AND post.post_status LIKE %s
            AND meta.meta_key = %s
            AND meta.meta_value LIKE %s
            AND post.term_ids LIKE %s";

    $post_status_prepare = "%".$args['post_status']."%";
    $quiz_type_prepare = "%".$args['quiz_type']."%";

    if (empty($args['textbook'])){
        $textbook_prepare = '%%';
    }
    else{
        $textbook_prepare = '%"'.$args['textbook'].'"%';
        // print_r('ss'.$textbook_prepare.'ss');
    }


    $query = $wpdb->prepare($query_string,'quiz',$post_status_prepare,'quiz_type',$quiz_type_prepare,
        $textbook_prepare);
    $quiz_ids = $wpdb->get_col($query);

    $result = array();


    if(isset($args['search_str']) && trim($args['search_str']) !=''){
        $quiz_ids = get_modules_by_search_string($args['search_str'],$quiz_ids);
    }

    $quiz_ids = __u::flatten($quiz_ids);

    foreach ($quiz_ids as $id){
        // print_r($id."\n");
        $quiz_data = get_single_quiz_module((int)$id);
        // unset($quiz_data ->content_layout);
        $result[] = $quiz_data;
    }
    // exit;

    return $result;
}

function read_quiz_response_summary($args){
    global $wpdb;
    if(!isset($args['student_id'])){
        $args['student_id'] = get_current_user_id();
    }

    // if id is passed
    if(isset($args['summary_id'])){
        $quiz_response_summary = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}quiz_response_summary
            where summary_id = %s", $args['summary_id']));

    }
    else {
        $quiz_response_summary = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}quiz_response_summary
            where student_id = %d and collection_id = %d", $args['student_id'],$args['collection_id']));
    }
    
    if(!$quiz_response_summary)
        return false;

    // geting status 

    $quiz_meta = maybe_unserialize($quiz_response_summary->quiz_meta);

    unset($quiz_response_summary->quiz_meta);

    $quiz_response_summary->status = $quiz_meta['status'];

    $additional_details_qry = $wpdb->prepare(
        "SELECT SUM(marks_scored) as total_marks_scored,
            SUM(time_taken) as total_time_taken
            FROM {$wpdb->prefix}quiz_question_response
        WHERE summary_id = %s", $quiz_response_summary->summary_id
    );

    $additional_details= $wpdb->get_row($additional_details_qry);   

    $quiz_response_summary->total_marks_scored =  $additional_details->total_marks_scored;
    
    $quiz_response_summary->total_time_taken =  $additional_details->total_time_taken;

    $questions_skipped_qry = $wpdb->prepare(
        "SELECT count(status) from {$wpdb->prefix}quiz_question_response
        WHERE status like %s",
        'skipped'
    );

    $quiz_response_summary->num_skipped = $wpdb->get_var($questions_skipped_qry);

    return $quiz_response_summary;
}


function write_quiz_response_summary($args){
    global $wpdb;
    if(!isset($args['student_id'])){
        $args['student_id'] = get_current_user_id();
    }
    $quiz_meta = array(
            'status' => $args['status']);

    if(!isset($args['summary_id'])){
        $summary_id = 'Q'.$args['collection_id'].'S'.$args['student_id'];
        
        $data = array(
            'summary_id' => $summary_id,
            'collection_id' => $args['collection_id'],
            'student_id' => $args['student_id'],
            'quiz_meta' => maybe_serialize($quiz_meta)
            );
        $wpdb->insert(($wpdb->base_prefix).'quiz_response_summary', $data );
    }
    else{
        $summary_id = $args['summary_id'];
        $data = array('quiz_meta' => maybe_serialize($quiz_meta));
        $where_array = array('summary_id' => $summary_id);
        $wpdb->update(($wpdb->base_prefix).'quiz_response_summary', $data ,$where_array);
    }

    return $summary_id;

}

function write_quiz_question_response($args){
    global $wpdb;

    $quiz_details = read_quiz_response_summary(array('summary_id'=>$args['summary_id']));

    $quiz_module = get_single_quiz_module($quiz_details->collection_id);

    if(!$quiz_module->permissions['allow_skip'] && $args['status'] == 'skipped'){

            $args['status'] = 'wrong_answer';
        }

    $data = array(
            // 'qr_id' => $args['qr_id'],
            'summary_id' => $args['summary_id'],
            'content_piece_id' => $args['content_piece_id'],
            'question_response' => maybe_serialize($args['question_response']),
            'time_taken' => $args['time_taken'],
            'marks_scored' => $args['marks_scored'],
            'status' => $args['status']    );
    // save

    if(!isset($args['qr_id'])){
        $qr_id = 'CP'.$args['content_piece_id'].$args['summary_id'];
        $data['qr_id'] = $qr_id;
        
        

        $wpdb->insert(($wpdb->base_prefix).'quiz_question_response', $data );
    }
    // update
    else{
        $where_array = array('qr_id' => $args['qr_id']);


        //check for single attempt permission
        if ($quiz_module->permissions['single_attempt']){
            return false;
        }
        //get old question response data
        $question_response = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->base_prefix}quiz_question_response
                    where qr_id = %s",$data['qr_id']));

        if(!$quiz_module->permissions['allow_resubmit'] && $question_response->status !== 'skipped')            
            return false;

        $wpdb->update(($wpdb->base_prefix).'quiz_question_response', $data ,$where_array);

        $data['qr_id'] = $args['qr_id'];
    }

    return $data['qr_id'];
}

function read_quiz_question_response($id){
    global $wpdb;
    $quiz_question_response = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->base_prefix}quiz_question_response
                    where qr_id = %s",$id));
    return $quiz_question_response;
}

function get_all_quiz_question_responses($summary_id){
    global $wpdb;

    $data=array();

    $quiz_question_responses = $wpdb->get_results($wpdb->prepare("select * from {$wpdb->base_prefix}quiz_question_response
                    where summary_id like %s",$summary_id));

    foreach ($quiz_question_responses as $response) {

        $d = array(
            'summary_id'        => $response->summary_id,
            'qr_id'             => $response->qr_id,
            'content_piece_id'  => (int) $response->content_piece_id,
            'marks_scored'      => (int) $response->marks_scored,
            'question_response' => maybe_unserialize($response->question_response),
            'status'            => $response->status,
            'time_taken'        => (int) $response->time_taken
        );

        $data[]=$d;
    }

    return $data;
}


