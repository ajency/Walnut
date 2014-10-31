<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:47 PM
 */

function get_single_quiz_module ($id,$user_id=0, $division = 0) {
    global $wpdb;

    if(!$user_id)
        $user_id = get_current_user_id();

    $select_query = $wpdb->prepare ("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id = %d", $id);
    $data = $wpdb->get_row ($select_query);

    $terms = maybe_unserialize($data->term_ids);
    $textbook = $terms['textbook'];
    
    if (!user_has_access_to_textbook($textbook,$user_id)){
        return new WP_Error('No Access', __('You do not have access to this quiz') );
    }

    $data->id = (int)$data->id;
    $data->name = wp_unslash($data->name);

    $duration = (int)$data->duration;
    $data->term_ids = $terms;

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

        if ($value->meta_key == 'description'){
            $description = maybe_unserialize($value->meta_value);
            $data->instructions = wp_unslash($description['instruction']);
        }

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

    if($user_id){
        $quiz_status= get_quiz_status($id,$user_id);
        $data->taken_on= $quiz_status['date'];
        $data->status = $quiz_status['status'];

        if($data->quiz_type == 'practice')
            $data->attempts = (int) $quiz_status['attempts'];
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

    if($division){

        $taken_by=0;
        
        $args=array(
                'role'=>'student',
                'division'=>$division,
            );

        $students=get_user_list($args);

        if($students){
            $student_ids=__u::pluck($students,'ID');

            if(sizeof($student_ids)>0){
                $students_str= join($student_ids,',');

                $taken_by_query = $wpdb->prepare("SELECT count(DISTINCT student_id) 
                    FROM `{$wpdb->prefix}quiz_response_summary` where collection_id = %d
                    AND student_id in ($students_str)",
                    $id);

                $taken_by=(int) $wpdb->get_var($taken_by_query);
            }
        }

        $data->taken_by = $taken_by;
        
        $data->total_students = get_student_count_in_division($division);
    }

    return $data;
}

function get_quiz_status($quiz_id,$user_id){
    global $wpdb;
    
    $status = array();

    $query= $wpdb->prepare("SELECT taken_on, quiz_meta 
        FROM {$wpdb->prefix}quiz_response_summary qrs
        WHERE collection_id = %d
            AND student_id = %d",
        array($quiz_id,$user_id)
    );

    $result= $wpdb->get_results($query);

    if($result){
        $quiz_meta= maybe_unserialize(__u::last($result)->quiz_meta);

        $status['status']=$quiz_meta['status'];
        $status['date'] = __u::last($result)->taken_on;
        $status['attempts']= sizeof($result);
    }

    else $status['status']= 'not started';

    return $status;

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

    $user_id=0;
    
    $quiz_ids_search_str = '';

    if(isset($args['user_id']))
        $user_id=$args['user_id'];

    if(isset($args['quiz_ids']) && sizeof($args['quiz_ids'])>0){
        $quiz_ids_str = join(',', $args['quiz_ids']);
        $quiz_ids_search_str = " AND post.id in ($quiz_ids_str)";
    }


    $query_string = "SELECT DISTINCT post.id
            FROM {$wpdb->base_prefix}content_collection AS post,
                {$wpdb->base_prefix}collection_meta AS meta
            WHERE meta.collection_id = post.id
            AND post.type = %s
            AND post.post_status LIKE %s
            AND meta.meta_key = %s
            AND meta.meta_value LIKE %s
            AND post.term_ids LIKE %s".
            $quiz_ids_search_str;

    $post_status_prepare = "%".$args['post_status']."%";
    $quiz_type_prepare = "%".$args['quiz_type']."%";

    if (empty($args['textbook']))
        $textbook_prepare = '%%';
    
    else
        $textbook_prepare = '%"'.$args['textbook'].'"%';
    

    $query = $wpdb->prepare($query_string,'quiz',$post_status_prepare,'quiz_type',$quiz_type_prepare,
        $textbook_prepare);
    $quiz_ids = $wpdb->get_col($query);

    $result = array();


    if(isset($args['search_str']) && trim($args['search_str']) !=''){
        $quiz_ids = get_modules_by_search_string($args['search_str'],$quiz_ids);
    }
    $quiz_ids = __u::flatten($quiz_ids);

    foreach ($quiz_ids as $id){
        $quiz_data = get_single_quiz_module((int)$id,$user_id, $args['division']);
        
        if(!is_wp_error($quiz_data))
            $result[] = $quiz_data;
        
    }

    return $result;
}


function get_quiz_summaries_for_user($user_id, $quiz_id=0){

    global $wpdb;

    if(!$user_id)
        $user_id = get_current_user_id();

    if($quiz_id)
        $query = $wpdb->prepare("select summary_id from {$wpdb->prefix}quiz_response_summary
            where student_id = %d and collection_id = %d", $user_id,$quiz_id);
    else
        $query = $wpdb->prepare("select summary_id from {$wpdb->prefix}quiz_response_summary
            where student_id = %d", $user_id);

    $results = $wpdb->get_col($query);

    $data= array();

    if($results){
        foreach($results as $summary_id){
            $data[] = read_quiz_response_summary($summary_id);
        }
    }
    
    return $data;

}

function get_latest_quiz_response_summary($quiz_id, $user_id){

    global $wpdb;

    if(!$quiz_id || !$user_id)
        return false;

    $query = $wpdb->prepare("select summary_id from {$wpdb->prefix}quiz_response_summary
            where student_id = %d and collection_id = %d order by taken_on desc limit 1", $user_id,$quiz_id);

    $summary_id = $wpdb->get_var($query);

    $summary = read_quiz_response_summary($summary_id);

    return $summary;

}

function read_quiz_response_summary($summary_id){

    global $wpdb;

    if(!$summary_id)
        return false;

    $quiz_response_summary = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}quiz_response_summary
        where summary_id = %s", $summary_id));    
    
    if(!$quiz_response_summary)
        return false;

    $quiz_meta = maybe_unserialize($quiz_response_summary->quiz_meta);

    unset($quiz_response_summary->quiz_meta);

    $quiz_response_summary->status = $quiz_meta['status'];
    $quiz_response_summary->questions_order = $quiz_meta['questions_order'];

    $additional_details_qry = $wpdb->prepare(
        "SELECT 
            SUM(marks_scored) as total_marks_scored,

            SUM(
                CASE WHEN status = 'wrong_answer' THEN marks_scored ELSE 0 END
            ) as negative_scored,

            SUM( 
               CASE WHEN status <> 'wrong_answer' THEN marks_scored ELSE 0 END 
            ) as marks_scored, 

            SUM(time_taken) as total_time_taken
            FROM {$wpdb->prefix}quiz_question_response
        WHERE summary_id = %s", $quiz_response_summary->summary_id
    );

    $quiz_response_summary->collection_id = (int) $quiz_response_summary->collection_id;

    $quiz_response_summary->student_id = (int) $quiz_response_summary->student_id;

    $additional_details= $wpdb->get_row($additional_details_qry);   

    $quiz_response_summary->marks_scored = (float) $additional_details->marks_scored;

    $quiz_response_summary->negative_scored = (float) $additional_details->negative_scored;

    $quiz_response_summary->total_marks_scored = (float) $additional_details->total_marks_scored;
    
    $quiz_response_summary->total_time_taken =  $additional_details->total_time_taken;

    $questions_skipped_qry = $wpdb->prepare(
        "SELECT count(status) from {$wpdb->prefix}quiz_question_response
        WHERE status LIKE %s AND summary_id LIKE %s",
        array('skipped', $quiz_response_summary->summary_id)
    );

    $quiz_response_summary->num_skipped = $wpdb->get_var($questions_skipped_qry);

    return $quiz_response_summary;
}

function write_quiz_response_summary($args){
    global $wpdb;
    if(!isset($args['student_id'])){
        $args['student_id'] = get_current_user_id();
    }   

    $quiz_type = get_module_meta($args['collection_id'], 'quiz_type');
    
    $quiz_meta['status'] = $args['status'];
    $quiz_meta['questions_order'] = array_map('intval', $args['questions_order']);
    

    if(!isset($args['summary_id'])){

        $summary_id = 'Q'.$args['collection_id'].'S'.$args['student_id'];

        if ($quiz_type=='practice')
            $summary_id = $summary_id . '_' . date('dmyhis');
        
        $data = array(
            'summary_id' => $summary_id,
            'collection_id' => $args['collection_id'],
            'student_id' => $args['student_id'],
            'quiz_meta' => maybe_serialize($quiz_meta)
            );

        //handling sync status for standalone sites. 
        if (!is_multisite()) 
            $data['sync']=0;

        $wpdb->insert(($wpdb->prefix).'quiz_response_summary', $data );
    }
    else{
        $summary_id = $args['summary_id'];
        $data = array('quiz_meta' => maybe_serialize($quiz_meta));
        
        //handling sync status for standalone sites. 
        if (!is_multisite()) 
            $data['sync']=0;

        $where_array = array('summary_id' => $summary_id);
        $wpdb->update(($wpdb->prefix).'quiz_response_summary', $data ,$where_array);
    }

    return $summary_id;

}

function write_quiz_question_response($args){
    global $wpdb;

    $quiz_details = read_quiz_response_summary(array('summary_id'=>$args['summary_id']));

    $quiz_module = get_single_quiz_module($quiz_details->collection_id);

    $data = array(
            // 'qr_id' => $args['qr_id'],
            'summary_id' => $args['summary_id'],
            'content_piece_id' => $args['content_piece_id'],
            'question_response' => maybe_serialize($args['question_response']),
            'time_taken' => $args['time_taken'],
            'marks_scored' => $args['marks_scored'],
            'status' => $args['status']    );

    //handling sync status for standalone sites. 
    if (!is_multisite()) 
        $data['sync']=0;
    
    // save
    if(!isset($args['qr_id'])){
        $qr_id = 'CP'.$args['content_piece_id'].$args['summary_id'];
        $data['qr_id'] = $qr_id;

        $wpdb->insert(($wpdb->prefix).'quiz_question_response', $data );
    }
    // update
    else{

        $where_array = array('qr_id' => $args['qr_id']);

        //get old question response data
        $check_qry = $wpdb->prepare("select * from {$wpdb->prefix}quiz_question_response
                    where qr_id = %s",$args['qr_id']);

        $question_response = $wpdb->get_row($check_qry);
        
        if($question_response->status == 'paused' && $args['status'] == 'paused'){

            //handling sync status for standalone sites. 
            if (!is_multisite()) 
                $paused_data['sync']=0;

            $paused_data = array('status'=>'paused','time_taken' => $args['time_taken']);
            $wpdb->update(($wpdb->prefix).'quiz_question_response', $paused_data ,$where_array);

        }

        else{
            if($question_response->status != 'paused'){
                //check for single attempt permission
                if ($quiz_module->permissions['single_attempt']){
                    return false;
                }                

                if(!$quiz_module->permissions['allow_resubmit'] && $question_response->status !== 'skipped')            
                    return false;
            }

            $wpdb->update(($wpdb->prefix).'quiz_question_response', $data ,$where_array);
        }
        $data['qr_id'] = $args['qr_id'];
    }

    return $data['qr_id'];
}

function read_quiz_question_response($id){
    global $wpdb;
    $quiz_question_response = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}quiz_question_response
                    where qr_id = %s",$id));
    return $quiz_question_response;
}

function get_all_quiz_question_responses($summary_id){
    global $wpdb;

    $data=array();

    $quiz_question_responses = $wpdb->get_results($wpdb->prepare("select * from {$wpdb->prefix}quiz_question_response
                    where summary_id like %s",$summary_id));

    foreach ($quiz_question_responses as $response) {

        $d = array(
            'summary_id'        => $response->summary_id,
            'qr_id'             => $response->qr_id,
            'content_piece_id'  => (int) $response->content_piece_id,
            'marks_scored'      => (float) $response->marks_scored,
            'question_response' => maybe_unserialize($response->question_response),
            'status'            => $response->status,
            'time_taken'        => (int) $response->time_taken
        );

        $data[]=$d;
    }

    return $data;
}


function quiz_status_for_textbook($book_id,$student_id){
    global $wpdb;

    $query= $wpdb->prepare(
        "SELECT cc.id,cm.meta_value as quiz_type, qr.quiz_meta 
            FROM  {$wpdb->prefix}quiz_response_summary qr, 
                {$wpdb->base_prefix}content_collection cc,
                {$wpdb->base_prefix}collection_meta cm 
            WHERE qr.collection_id = cc.id
                AND cm.collection_id = cc.id 
                AND cm.meta_key like %s
                AND cc.post_status LIKE %s 
                AND qr.student_id = %d
                AND cc.term_ids like %s",

        array('quiz_type','publish',$student_id, '%"'.$book_id.'";%' )
    );
    
    $result= $wpdb->get_results($query);

    $class_test_completed = $practice_completed =$class_test_in_progress = $practice_in_progress = array();

    foreach ($result as $res) {
        $quiz_meta= maybe_unserialize($res->quiz_meta);
        $status = $quiz_meta['status'];

        if($status === 'completed'){
            if($res->quiz_type==='test')
                $class_test_completed[]=$res->id;
            else{
                #add practice quiz in completed array only if it isnt in progress
                if(!in_array($res->id, $practice_in_progress))
                    $practice_completed[]=$res->id;
           }
        }
        else{
            if($res->quiz_type==='test')
                $class_test_in_progress[]=$res->id;
            else{
                $practice_in_progress[]=$res->id;
                #if practice quiz has one attempt in progress remove it from completed array
                if(in_array($res->id, $practice_completed))
                    $practice_completed= __u::without($practice_completed,$res->id);
            }
        }
    }

    if(sizeof($practice_completed>0))
        $count_practice_completed = sizeof(__u::uniq($practice_completed));

    if(sizeof($practice_in_progress>0))
        $count_practice_in_progress = sizeof(__u::uniq($practice_in_progress));

    $data=array(
        'class_test_completed'      => sizeof($class_test_completed), 
        'practice_completed'        => $count_practice_completed,
        'class_test_in_progress'    => sizeof($class_test_in_progress),
        'practice_in_progress'      => $count_practice_in_progress,
    );

    return $data;
        
}

function delete_quiz_response_summary($summary_id){

    global $wpdb;

    if(!$summary_id)
        return false;

    $summary_delete_qry = $wpdb->prepare("
        DELETE FROM {$wpdb->prefix}quiz_response_summary WHERE summary_id LIKE %s",
        $summary_id
    );

    $wpdb->query($summary_delete_qry);

    $responses_delete_qry = $wpdb->prepare("
        DELETE FROM {$wpdb->prefix}quiz_question_response WHERE summary_id LIKE %s",
        $summary_id
    );

    $wpdb->query($responses_delete_qry);

    return true;

}

