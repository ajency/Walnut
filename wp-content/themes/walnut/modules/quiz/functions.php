<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:47 PM
 */

function get_single_quiz_module ($id,$user_id=0, $division = 0) {

    #$myfile = fopen("log_ext.txt", "a");
    
    $taken_by_stud = [];

    $selected_quiz_id = $id;
    #fwrite($myfile, $selected_quiz_id);
    global $wpdb;

    if(!$user_id)
        $user_id = get_current_user_id();

    $select_query = $wpdb->prepare ("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id = %d", $selected_quiz_id);

    $data = $wpdb->get_row ($select_query);

    $terms = maybe_unserialize($data->term_ids);
    $textbook = $terms['textbook'];
    #fwrite($myfile, $textbook);
    
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

    $query_meta = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}collection_meta WHERE collection_id = %d",$selected_quiz_id);
    $quiz_details = $wpdb->get_results($query_meta);

    $data->permissions = $data->description = array();

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

            if(isset($description['instruction']))
                $data->description['instruction'] =wp_unslash($description['instruction']);

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

    $show_questions = true;
    $schedule       = array();

    if($data->quiz_type == 'class_test'){
        $schedule = get_quiz_schedule($id, $division);

        if($schedule)
            $data->schedule  = $schedule;        

        if(current_user_can('view_all_quizzes') || $schedule['is_active'] || $data->status =='completed')
            $show_questions = true;
        else
            $show_questions = false;
    }
    
    if ($data->content_layout && $show_questions){
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

        $data->taken_by_stud = num_students_taken_quiz($selected_quiz_id, $division);

        #fwrite($myfile, "\n".$data->taken_by_stud."\n");
       # $studeentttt = implode(",",$taken_by_stud);
       #fwrite($myfile, $studeentttt);
        
       # $data->stude_ids = $taken_by_stud;
        if ($data->taken_by_stud == 0){
            $data->taken_by = 0;
        }else{
        $data->taken_by = sizeof($data->taken_by_stud);
        }

        //$data->stud_ans_id = students_taj
        // students that have missed a quiz
        $data->missed_by = students_not_taken_quiz($selected_quiz_id, $division);
        
        $data->total_students = get_student_count_in_division($division);

    }
    
    #fwrite($myfile, $data->taken_by);
    #fwrite($myfile, $data->id);
    #fclose($myfile);
    return $data;
}

function num_students_taken_quiz($quiz_id, $division){

    global $wpdb;  

    #$myfile = fopen("log_ext.txt", "a");

    $taken_by = 0;

    $args=array(
            'role'=>'student',
            'division'=>$division,
        );

    $students=get_user_list($args);

    if($students){
        $student_ids=__u::pluck($students,'ID');

        if(sizeof($student_ids)>0){
            $students_str= join($student_ids,',');

            $taken_by_query = $wpdb->prepare("SELECT DISTINCT student_id
                FROM `{$wpdb->prefix}quiz_response_summary` where collection_id = %d
                AND quiz_meta like '%s'
                AND student_id in ($students_str)",
                $quiz_id, '%completed%');

            #fwrite($myfile, $taken_by_query);

            #fclose($myfile);

            $taken_by = $wpdb->get_col($taken_by_query);
        }
    }

    return $taken_by;

}


function students_not_taken_quiz($quiz_id, $division){

    global $wpdb;

    $not_taken_by = [];
    // $not_taken_by = 0;

    $args=array(
            'role'=>'student',
            'division'=>$division,
        );

    $students=get_user_list($args);

    if($students){
        $student_ids=__u::pluck($students,'ID');

        if(sizeof($student_ids)>0){
            $students_str= join($student_ids,',');

            $not_taken_by_query = $wpdb->prepare("SELECT DISTINCT student_id
                FROM `{$wpdb->prefix}quiz_response_summary` where collection_id = %d
                AND quiz_meta like '%s'
                AND student_id NOT IN ($students_str)",
                $quiz_id, '%completed%');

            $not_taken_by = $wpdb->get_results($not_taken_by_query);
        }
    }
    
    return $not_taken_by;

}

function get_quiz_schedule($quiz_id, $division){

    global $wpdb;
    global $user_ID;

    if(!$division)
        $division=get_user_meta($user_ID,'student_division',true);

    if(!$quiz_id || !$division)
        return false;

    $query = $wpdb->prepare("SELECT schedule_from, schedule_to 
                        FROM {$wpdb->prefix}quiz_schedules 
                        WHERE quiz_id = %d AND division_id = %d",
                    array($quiz_id, $division)
            );

    $result = $wpdb->get_row($query);

    if(!$result)
        return false;

    $today = date('Y-m-d');

    $from   = $result->schedule_from;
    $to     = $result->schedule_to;
    
    if( ($today >= $from) && ($today <= $to))
        $active = true;
    else
        $active = false;

    if($today > $to)
        $expired = true;
    
    else
        $expired = false;

    return array(
        'from'      => $from,
        'to'        => $to,
        'is_active' => $active,
        'is_expired'=> $expired
        );
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
    #$textbookss = [];
    $textbook_prepare[0] = $textbook_prepare[1] = $$textbook_prepare[2] = $textbook_prepare[3] = $textbook_prepare[4] = $textbook_prepare[5] = '%"xyz"%';
    
    $myfile = fopen("log.txt", "a");
    $textbookss = $args['textbook'];

    #file_put_contents('abc.txt', print_r($textbookss, true));

    $type = is_array($args['textbook']) ? '1' : '0';


    if ($args['post_status'] =='any'){
        $args['post_status1'] = '';
        $args['post_status2'] = '';
        }

    if ($args['post_status'] =='published'){
        $args['post_status1'] = 'publish';
        $args['post_status2'] = 'archive';
    }

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

    if (empty($args['textbook']))
        $textbook_prepare[0] = "%xy@@@zz%";
        $term_id_query = " AND post.term_ids LIKE ";


    if($type == 0){

        //onload and quiz report since textbook id is 1
         $textbook_prepare[0] = '%"'.$textbookss.'"%';
            $term_id_query = " AND post.term_ids LIKE %s";
            #fwrite($myfile, "string");
            #fwrite($myfile, $term_id_querys);


    }

    else if ($type == 1) {
    #if its == 1
        $size_text_data = sizeof($textbookss);
        //$text_ids = implode(",",$textbookss);
        #fwrite($myfile, "size of array " . $size_text_data."\n");
        
        //  '%\"636\"%'
        if ($size_text_data == '1'){
            $text = $textbookss[0];
            $textbook_prepare[0] = "%".$textbookss[0]."%";
            $term_id_query = " AND post.term_ids LIKE %s";
           // $term_id_query .= $text;
           # fwrite($myfile, "1"."\n");
        }
        else{
            $term_id_query_inside = '';
            #$textbook_prepare = 'xyz';
            #$term_id_query = " AND ()";
            foreach ($textbookss as $key => $text_id) {
            #fwrite($myfile, "key ".$key."\n");
           # fwrite($myfile, "size_text_data ".$size_text_data-1."\n");
            $textbook_prepare[$key] = '%"'.$text_id.'"%';
            $term_id_query_inside = $term_id_query_inside . "post.term_ids LIKE %s OR ";

            if( $key == $size_text_data-1){
                $term_id_query_inside = $term_id_query_inside . "post.term_ids LIKE %s";
            }
            #file_put_contents('abcasd.txt', print_r($term_id_query_inside, true));
            
            #$key
            }
            $term_id_query = " AND ($term_id_query_inside)";

            #$textbook_prepare = '%"638"%';
            #$textbook_prepare1 = '%"636"%';
            #$term_id_query = "AND ( post.term_ids LIKE %s OR post.term_ids LIKE %s)";
           # file_put_contents('abca.txt', print_r($term_id_query, true));

        }
        #$term_id_query = " AND post.term_ids LIKE %s";




        #fwrite($myfile, $textbook_prepare);
        #$term_id_query = " AND post.term_ids LIKE %s";
    }


    $query_string = "SELECT DISTINCT post.id
            FROM {$wpdb->base_prefix}content_collection AS post,
                {$wpdb->base_prefix}collection_meta AS meta
            WHERE meta.collection_id = post.id
            AND post.type = 'quiz'
            AND (post.post_status LIKE %s OR post.post_status LIKE %s)
            AND meta.meta_key = %s
            AND meta.meta_value LIKE %s".
            $term_id_query.
            $quiz_ids_search_str;


    $post_status_prepare = "%".$args['post_status1']."%";
    $post_status_prepare2 = "%".$args['post_status2']."%";

    $quiz_type_prepare = "%".$args['quiz_type']."%";



    

    $query = $wpdb->prepare($query_string,$post_status_prepare,$post_status_prepare2,'quiz_type',$quiz_type_prepare,
        $textbook_prepare[0],
        $textbook_prepare[1],
        $textbook_prepare[2],
        $textbook_prepare[3],
        $textbook_prepare[4],
        $textbook_prepare[5]);

   # fwrite($myfile, $query);

    file_put_contents('abc.txt', print_r($query, true));

    $quiz_ids = $wpdb->get_col($query);
    #fwrite($myfile, $query);


    $result = array();


    if(isset($args['search_str']) && trim($args['search_str']) !=''){
        $quiz_ids = get_modules_by_search_string($args['search_str'],$quiz_ids);
    }
    $quiz_ids = __u::flatten($quiz_ids);


    foreach ($quiz_ids as $id){
        #fwrite($myfile, $id);
        $quiz_data = get_single_quiz_module((int)$id,$user_id, $args['division']);
        #fwrite($myfile, $quiz_data);
        
        if(!is_wp_error($quiz_data)){
            #fwrite($myfile, "NO error wit quiz data");
            $result[] = $quiz_data;
            #fwrite($myfile, $id);
           # fclose($myfile);
        }
        
    }
    
    $result= __u::sortBy($result, function($item){
                        return $item->last_modified_on;
                    });               
    fclose($myfile);  
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

    $summary = read_quiz_response_summary($summary_id, $user_id);

    return $summary;

}


// report doesnt show coz of this function
function read_quiz_response_summary($summary_id,$user_id=0){

    global $wpdb;

    $summ_id = $summary_id;
    //also need class id

    /*if(!$summary_id)

        return false;*/
    file_put_contents("filenamestud.txt", $user_id);

    if ($user_id != 0){
    //from student id get the division id
    $query = $wpdb->prepare("SELECT DISTINCT meta_value FROM {$wpdb->base_prefix}usermeta WHERE meta_key = 'student_division' AND user_id = %d", $user_id);

    $division = $wpdb->get_results($query);
    /*$student_ids = $wpdb->get_row($wpdb->prepare("SELECT DISTINCT um1.user_id
                    FROM {$wpdb->base_prefix}usermeta AS um1
                    LEFT JOIN {$wpdb->base_prefix}usermeta AS um2
                    WHERE um1.meta_key = 'student_division'
                    AND um2.meta_key = 'student_division'
                    AND um2.meta_value = $user_id
                    AND um1.meta_value = um2. 
                    "));*/

    //select all students from that division

    foreach ($division as $divisions) {
        $division = $divisions->meta_value;

    }
    $query1 = $wpdb->prepare("SELECT DISTINCT um1.user_id
        FROM {$wpdb->base_prefix}usermeta AS um1
        LEFT JOIN {$wpdb->base_prefix}usermeta AS um2
        ON um1.user_id = um2.user_id
        WHERE um1.meta_key LIKE %s
        AND um1.meta_value LIKE %s
        AND um2.meta_key LIKE %s
        AND um2.meta_value = %s",
        array('%capabilities','%student%','student_division', $division)
        );
 
    $his_students = $wpdb->prepare("SELECT user_id FROM {$wpdb->base_prefix}usermeta
        WHERE meta_key = 'student_division'
        AND meta_value IN (SELECT id FROM {$wpdb->prefix}class_divisions
                            WHERE class_id = (SELECT class_id FROM {$wpdb->prefix}class_divisions
                                WHERE id = $division))");

    //for each student find their max scores based on quiz summary
    $hist_student = $wpdb->get_col($his_students);

    $it = new RecursiveIteratorIterator(new RecursiveArrayIterator($hist_student));
    $stu_his = '';
    foreach($it as $v) {
        $stu_his = $v.', '.$stu_his;
    }

    $stu_his = trim($stu_his, ", ");

    $query = $wpdb->prepare("SELECT DISTINCT summary_id FROM {$wpdb->prefix}quiz_response_summary WHERE student_id IN ($stu_his)");

    $summid = $wpdb->get_col($query);

    #$it = new RecursiveIteratorIterator(new RecursiveArrayIterator($summid));
    #$summid_his = '';
    #foreach($it as $v) {
    #    $summid_his = '\''.$v.'\''.', '.$summid_his;
    #}

    #$summid_his = trim($summid_his, ", ");

    foreach ($summid as $summID) {
   
    $maks_scored_hist = $wpdb->prepare("SELECT SUM(marks_scored) FROM {$wpdb->prefix}quiz_question_response WHERE summary_id = %s", $summID);

    $marks_hist = $wpdb->get_col($maks_scored_hist);
        $marks_historical[] = $marks_hist; 
     }

    $it = new RecursiveIteratorIterator(new RecursiveArrayIterator($marks_historical));
    $vi = '';
    foreach($it as $v) {
        if ($v == '')
            continue;
        $vi = $v.', '.$vi;
    }

    $vi = rtrim($vi);

    $marrks_historical = explode(",", $vi);

    file_put_contents("filenameqqq.txt", $marrks_historical."wsws");

    $highest_scoreH = max($marrks_historical);

    $sizeH = sizeof($marrks_historical);
    $totlH = 0;
    foreach ($marrks_historical as $total_students_marksH) {
        $totlH = $totlH + $total_students_marksH;
    }

    $avgH = $totlH/$sizeH;

    $student_ids = $wpdb->get_results($query1);
    foreach ($student_ids as $student) {

        $query = $wpdb->prepare("SELECT DISTINCT summary_id FROM {$wpdb->prefix}quiz_response_summary WHERE student_id = %d", $student->user_id);

    $summary_id = $wpdb->get_results($query);
    $summary[] = $summary_id;
    }

    $it = new RecursiveIteratorIterator(new RecursiveArrayIterator($summary));
    $vi = '';
    foreach($it as $v) {
        $vi = $v.', '.$vi;
    }

    $vi = rtrim($vi);

    $sum = explode(",", $vi);

     foreach ($sum as $summary_id) {
        //fetch the marks
            $maks_scored = $wpdb->prepare("SELECT SUM(marks_scored) FROM {$wpdb->prefix}quiz_question_response WHERE summary_id = %s", $summary_id);

            $mak = $wpdb->get_col($maks_scored);

            $maks[] = $mak;

        }


    $it = new RecursiveIteratorIterator(new RecursiveArrayIterator($maks));
    $vi = '';
    foreach($it as $v) {
        if ($v == '')
            continue;
        $vi = $v.', '.$vi;
        fwrite($myfile, "times"."\n");
    }

    $vi = rtrim($vi);

    $marrks = explode(",", $vi);

    $highest_score = max($marrks);

    $size = sizeof($marrks);
    $totl = 0;
    foreach ($marrks as $total_students_marks) {
        $totl = $totl + $total_students_marks;
    }

    $avg = $totl/$size;

}
    $quiz_response_summary = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}quiz_response_summary
        where summary_id = %s", $summ_id));    
    
    /*if(!$quiz_response_summary)
        return false;*/

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

    $quiz_response_summary->highest_hist_score = $highest_scoreH;

    $quiz_response_summary->avg_hist_score = round($avgH,2);

    $quiz_response_summary->avg_division_score = round($avg,2);

    $quiz_response_summary->highest_score = $highest_score;

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

    $home_test_completed = $practice_completed =$home_test_in_progress = $practice_in_progress = array();

    foreach ($result as $res) {
        $quiz_meta= maybe_unserialize($res->quiz_meta);
        $status = $quiz_meta['status'];

        if($status === 'completed'){
            if($res->quiz_type==='test')
                $home_test_completed[]=$res->id;
            else{
                #add practice quiz in completed array only if it isnt in progress
                if(!in_array($res->id, $practice_in_progress))
                    $practice_completed[]=$res->id;
           }
        }
        else{
            if($res->quiz_type==='test')
                $home_test_in_progress[]=$res->id;
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
        'home_test_completed'      => sizeof($home_test_completed),
        'practice_completed'        => $count_practice_completed,
        'home_test_in_progress'    => sizeof($home_test_in_progress),
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

function save_quiz_schedule($data){

    global $wpdb;

    if(!$data['schedule'] || !$data['schedule']['from'] || !$data['schedule']['to'])
        return false;

    #$from   = date('Y-m-d', strtotime($data['schedule']['from']));
    #$to     = date('Y-m-d', strtotime($data['schedule']['to']));

    $from = $data['schedule']['from'];
    $to = $data['schedule']['to'];
    
    $scheduledata = array(
        'quiz_id'       => $data['quiz_id'],
        'division_id'   => $data['division'],
        'schedule_from' => $from,
        'schedule_to'   => $to
        );

    if (!is_multisite())
        $scheduledata['sync']=0;

    $check_query = $wpdb->prepare("SELECT quiz_id FROM {$wpdb->prefix}quiz_schedules
                                        WHERE quiz_id = %d AND division_id = %d",
                                    array($data['quiz_id'],$data['division'])
                                );
    $schedule_exists = $wpdb->get_var($check_query);

    if($schedule_exists){

        $schedule_id = (int) $schedule_exists;

        $save = $wpdb->update(
            $wpdb->prefix.'quiz_schedules',
            $scheduledata,
            array(
                'quiz_id'       => $data['quiz_id'],
                'division_id'   => $data['division']
            ),
            array('%d','%d','%s','%s')
        );
    }
    else{
        $save = $wpdb->insert($wpdb->prefix.'quiz_schedules', $scheduledata, array('%d','%d','%s','%s'));
        $schedule_id= $wpdb->insert_id;
    }

    return $schedule_id;

}

function clear_quiz_schedule($quiz_id, $division){

    global $wpdb;

    $del = $wpdb->delete(
            $wpdb->prefix.'quiz_schedules',
            array(
                'quiz_id' => $quiz_id,
                'division_id' => $division
                )
        );

    return $del;

}