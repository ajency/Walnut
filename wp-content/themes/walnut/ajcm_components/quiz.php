<?php

function getvars_quizzes_taken_report($recipients_email,$comm_data){

    global $aj_comm;

    $template_data['name']      = 'quizzes-taken-report';

    $template_data['subject']   = 'Synapse Notification: Quiz report for today';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    $template_data['global_merge_vars'] = array();

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
    );

    $template_data['global_merge_vars'][] = get_mail_header($comm_data['blog_id']);
    $template_data['global_merge_vars'][] = get_mail_footer($comm_data['blog_id']);

    $zipfile        = $aj_comm->get_communication_meta($comm_data['id'],'filepath');

    if(file_exists($zipfile)){

        $template_data['attachments'][]= array(
            "type"      => "application/zip",
            "name"      => "quiz_reports.zip",
            "content"   => base64_encode(file_get_contents($zipfile))
        );

        unlink($zipfile);
    }

    return $template_data;

}

function getvars_quiz_completed_student_mail($recipients_email,$comm_data){

    global $aj_comm;

    $template_data['name']      = 'quiz-completed-student-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    $template_data['subject']   = $blog_data->blogname.': You have successfully completed a Quiz!';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $quiz_id        = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

    $quiz_data      = get_quiz_template_data($comm_data,$quiz_id);

    switch_to_blog($comm_data['blog_id']);
    $summary_data   = get_quiz_summary_data($quiz_id,$comm_data['user_id']);
    restore_current_blog();


    $template_data['global_merge_vars'] = array_merge($quiz_data,$summary_data);

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
    );

    return $template_data;

}

function getvars_quiz_completed_parent_mail($recipients,$comm_data){

    global $aj_comm;

    $template_data['name']      = 'quiz-completed-parent-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    $template_data['subject']   = $blog_data->blogname.':  Quiz report for student ';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $quiz_id   = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

    $division = $aj_comm->get_communication_meta($comm_data['id'],'division');

    $template_data['global_merge_vars'] = get_quiz_template_data($comm_data,$quiz_id);

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
    );

    switch_to_blog($comm_data['blog_id']);

    $template_data['merge_vars'] = array();

    foreach($recipients as $user){

        $student_ids = get_user_meta($user->user_id, 'parent_of', true);

        $student_ids = get_parent_of_formated($student_ids);

            foreach($student_ids as $child){
                $student    = get_userdata($child);

                $student_division = get_user_meta($student->ID,'student_division', true);

                 if($division != $student_division)
                     continue;

                $overwrite_vars = array();

                $overwrite_vars = get_quiz_summary_data($quiz_id,$child);

                $overwrite_vars[] = array(
                    'name' => 'STUDENT_NAME',
                    'content' => $student->display_name
                );

                $template_data['merge_vars'][] = array(

                    'rcpt'=>$user->value,
                    'vars' => $overwrite_vars
                ) ;

            }

        }

    restore_current_blog();

    return $template_data;

}

function getvars_quiz_published_student_mail($recipients_email,$comm_data){

    global $aj_comm;

    $template_data['name']      = 'quiz-published-student-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    $template_data['subject']   = $blog_data->blogname.': You have the a New Quiz!';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $quiz_id        = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

    $quiz_data      = get_quiz_template_data($comm_data,$quiz_id);

    switch_to_blog($comm_data['blog_id']);
    $summary_data   = get_quiz_summary_data($quiz_id,$comm_data['user_id']);
    restore_current_blog();


    $template_data['global_merge_vars'] = array_merge($quiz_data,$summary_data);

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
    );

    return $template_data;

}

function getvars_quiz_published_parent_mail($recipients,$comm_data){

    global $aj_comm;

    
    $template_data['name']      = 'quiz-published-parent-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    #$template_data['subject']   = $blog_data->blogname.':  Quiz List for student ';
    $template_data['subject']   =  'Go Nuts! More quizzes';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $quiz_id   = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

    $division = $aj_comm->get_communication_meta($comm_data['id'],'division');

    $template_data['global_merge_vars'] = get_quiz_list_template_data($comm_data,$quiz_id);

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">Click here</a>'
    );

    switch_to_blog($comm_data['blog_id']);

    $template_data['merge_vars'] = array();

    foreach($recipients as $user){

        $student_ids = get_user_meta($user->user_id, 'parent_of', true);

        #$student_ids = get_parent_of_formated($student_ids);

            #foreach($student_ids as $child){

                $student    = get_userdata($user->user_id);

                $student_division = get_user_meta($student->ID,'student_division', true);
                # if($division != $student_division)
                #     continue;

                $overwrite_vars = array();

                $overwrite_vars = get_quiz_summary_data($quiz_id,$child);

                $overwrite_vars[] = array(
                    'name' => 'STUDENT_NAME',
                    'content' => $student->display_name
                );

                $template_data['merge_vars'][] = array(

                    'rcpt'=>$user->value,
                    'vars' => $overwrite_vars
                ) ;

            #}

        }

    restore_current_blog();

    return $template_data;

}

function getvars_quiz_summary_student_mail($recipients_email,$comm_data){


    global $aj_comm;

    $template_data['name']      = 'quiz-summary-student-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    $template_data['subject']   = $blog_data->blogname.': You have a summary of quizzes!';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $quiz_id        = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

    $quiz_data      = get_quiz_template_data($comm_data,$quiz_id);

    switch_to_blog($comm_data['blog_id']);
    $summary_data   = get_quiz_summary_data($quiz_id,$comm_data['user_id']);
    restore_current_blog();


    $template_data['global_merge_vars'] = array_merge($quiz_data,$summary_data);

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
    );

    return $template_data;

}

function getvars_quiz_summary_parent_mail($recipients,$comm_data){

    global $aj_comm;
    global $wpdb;

    $template_data['name']      = 'quiz-summary-parent-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    #$template_data['subject']   = $blog_data->blogname.':  Quiz summary for student ';
    $template_data['subject']   =  'Nuts Ah-oye! Some nutlets for you!';

    $template_data['from_email'] = 'no-reply@walnutedu.org';
    $template_data['from_name'] = 'Synapse';

    $quiz_id   = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

    $division = $aj_comm->get_communication_meta($comm_data['id'],'division');

    $start_date = $aj_comm->get_communication_meta($comm_data['id'],'start_date');

    $end_date = $aj_comm->get_communication_meta($comm_data['id'],'end_date');

    $comm_data['start_date'] = $start_date;

    $comm_data['end_date'] = $end_date;


    #$template_data['global_merge_vars'] = get_quiz_template_data($comm_data,$quiz_id);

    $template_data['global_merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a target="_blank" href="'.$blog_data->siteurl.'">Click here</a>'
    );

    switch_to_blog($comm_data['blog_id']);

    $template_data['merge_vars'] = array();

    foreach($recipients as $user){

        $student_ids = get_user_meta($user->user_id, 'parent_of', true);

       # $student_ids = get_parent_of_formated($student_ids);

            #foreach($student_ids as $child){
                $student    = get_userdata($user->user_id);

                $studId = $student->ID;
                $parent_email = "%parent_email%";
                $parent_email_value = $student->user_email;

                if($student->caps['parent'] == '1') {

                    $student_subs = $wpdb->prepare("SELECT user_id FROM {$wpdb->base_prefix}usermeta WHERE meta_key like %s AND meta_value = %s", $parent_email, $parent_email_value);
                    $studId = $wpdb->get_var($student_subs);


                }

                

                $student_division = get_user_meta($student->ID,'student_division', true);

                #if($division != $student_division)
                    #continue;

                $overwrite_vars = array();

                $overwrite_vars = get_quiz_summary_report_data($comm_data, $quiz_id, $studId, $division);

                $overwrite_vars[] = array(
                    'name' => 'STUDENT_NAME',
                    'content' => $student->display_name
                );

                $template_data['merge_vars'][] = array(

                    'rcpt'=>$user->value,
                    'vars' => $overwrite_vars
                ) ;

            #}

        }

    restore_current_blog();

    return $template_data;

}

function get_quiz_template_data($comm_data,$quiz_id, $division = 0){

    global $aj_comm;

    $data = array();

    $current_blog=get_current_blog_id();

    if(!$division){
        if($comm_data['communication_type'] == 'quiz_completed_student_mail')
            $division   = get_user_meta($comm_data['user_id'],'student_division', true);

        else
            $division   = $aj_comm->get_communication_meta($comm_data['id'],'division');
    }

    $siteurl = get_site_url();

    $data[] = array(
        'name' => 'QUIZ_URL',
        'content' => "<a target='_blank' href='$siteurl/#view-quiz/$quiz_id'>Click here</a>"
    );

    switch_to_blog($comm_data['blog_id']);

    $school_admin = get_school_admin_for_cronjob($comm_data['blog_id']);
    #file_put_contents("b1.txt", print_r($school_admin, true));
    #file_put_contents("b2.txt", print_r($quiz_id, true));


    $quiz_details= get_single_quiz_module($quiz_id,$school_admin);
    if ($comm_data['communication_type'] == 'quiz_published_parent_mail'){
        $quiz_details= get_single_quiz_module($quiz_id, $comm_data['user_id']);
    }

    $terms= $quiz_details->term_ids;

    $textbook_id = $terms['textbook'];

    $chapter_id = $terms['chapter'];

    switch_to_blog(1);
    $textbook_name = get_term_field('name', $textbook_id, 'textbook');

    if($chapter_id)
        $chapter_name = get_term_field('name', $chapter_id, 'textbook');
    else
        $chapter_name = ' -- ';

    $division_data = fetch_single_division($division,$comm_data['blog_id']);

    $division  = $division_data['division'];

    if($quiz_details->quiz_type == 'practice'){
        $quiz_type = 'Practice Quiz';
        $data[] = array('name' => 'PRACTICE', 'content' => 'true');
    }
    else
        $quiz_type = 'Class Test';


    $data[] = array('name' => 'QUIZ_NAME',      'content' => $quiz_details->name);
    $data[] = array('name' => 'QUIZ_TYPE',      'content' => $quiz_type);
    $data[] = array('name' => 'CLASS',          'content' => $division);
    $data[] = array('name' => 'TEXTBOOK',       'content' => $textbook_name);
    $data[] = array('name' => 'CHAPTER',        'content' => $chapter_name);
    $data[] = array('name' => 'QUIZ_MARKS',     'content' => $quiz_details->marks);

    $data[] = get_mail_header($comm_data['blog_id']);
    $data[] = get_mail_footer($comm_data['blog_id']);
    switch_to_blog($current_blog);

    return $data;

}

// quiz summary template data

function get_quiz_summary_template_data($comm_data,$quiz_id, $division = 0){

    global $aj_comm;

    $studeny_taken_quiz_id = [];

    $current_student = $comm_data['student_id'];

    $data = array();

    $current_blog=get_current_blog_id();


    if(!$division){
        if($comm_data['communication_type'] == 'quiz_summary_student_mail')
            $division   = get_user_meta($comm_data['user_id'],'student_division', true);

        else
            $division   = $aj_comm->get_communication_meta($comm_data['id'],'division');
    }

    $siteurl = get_site_url();

    $data[] = array(
        'name' => 'QUIZ_URL',
        'content' => "<a target='_blank' href='$siteurl/#quiz-report/div/$division/quiz/$quiz_id'>here</a>"
    );

    switch_to_blog($comm_data['blog_id']);

    $school_admin = get_school_admin_for_cronjob($comm_data['blog_id']);

    $quiz_details= get_single_quiz_module($quiz_id,$school_admin,$division);


    // id's of students that have taken the quiz
    $studeny_taken_quiz_id = $quiz_details->taken_by_stud;

    $it = new RecursiveIteratorIterator(new RecursiveArrayIterator($studeny_taken_quiz_id));
    $vi = '';
    foreach($it as $v) {
        $vi = $v.', '.$vi;
    }

    $vi = rtrim($vi);

    $taken_by_studs_ids = explode(",", $vi);

    if (in_array($current_student, $taken_by_studs_ids))
    {
       $quiz_details->num = 2;
    }
    else
    {
        $quiz_details->num = '';
    }


    $taken = $quiz_details->taken_by;

    $terms= $quiz_details->term_ids;

    $textbook_id = $terms['textbook'];

    $chapter_id = $terms['chapter'];

    switch_to_blog(1);
    $textbook_name = get_term_field('name', $textbook_id, 'textbook');

    if($chapter_id)
        $chapter_name = get_term_field('name', $chapter_id, 'textbook');
    else
        $chapter_name = ' -- ';

    $division_data = fetch_single_division($division,$comm_data['blog_id']);

    $division  = $division_data['division'];

    if($quiz_details->quiz_type == 'practice'){
        $quiz_type = 'Practice Quiz';
        $data[] = array('name' => 'PRACTICE', 'content' => 'true');
    }
    else
        $quiz_type = 'Class Test';

    $data[] = array('name' => 'STUDENT_ANS',    'content' => $quiz_details->num);
    $data[] = array('name' => 'QUIZ_NAME',      'content' => $quiz_details->name);
    $data[] = array('name' => 'QUIZ_TYPE',      'content' => $quiz_type);
    $data[] = array('name' => 'CLASS',          'content' => $division);
    $data[] = array('name' => 'TEXTBOOK',       'content' => $textbook_name);
    $data[] = array('name' => 'CHAPTER',        'content' => $chapter_name);
    $data[] = array('name' => 'QUIZ_MARKS',     'content' => $quiz_details->marks);
    $data[] = array('name' => 'TAKEN',          'content' => $taken);

    $data[] = get_mail_header($comm_data['blog_id']);
    $data[] = get_mail_footer($comm_data['blog_id']);
    switch_to_blog($current_blog);
    return $data;

}


//for select quiz email preview
function get_quiz_list_template_data($comm_data,$quiz_id, $division = 0){

    global $aj_comm;

    $data = array();

    $current_blog=get_current_blog_id();

    if(!$division){
        if($comm_data['communication_type'] == 'quiz_published_student_mail')
            $division   = get_user_meta($comm_data['user_id'],'student_division', true);

        else
            $division   = $aj_comm->get_communication_meta($comm_data['id'],'division');
    }

    $siteurl = get_site_url();


    switch_to_blog($comm_data['blog_id']);

    $school_admin = get_school_admin_for_cronjob($comm_data['blog_id']);

    foreach ($quiz_id as $quizID) {
         $quiz_detail[] = get_single_quiz_module($quizID,$comm_data['user_id']);

    }

    foreach ($quiz_detail as $key => $quiz_details) {

    $terms= $quiz_details->term_ids;

    $textbook_id = $terms['textbook'];

    $chapter_id = $terms['chapter'];

    switch_to_blog(1);
    $textbook_name = get_term_field('name', $textbook_id, 'textbook');

    if($chapter_id)
        $chapter_name = get_term_field('name', $chapter_id, 'textbook');
    else
        $chapter_name = ' -- ';

    $division_data = fetch_single_division($division,$comm_data['blog_id']);

    $division  = $division_data['division'];

    if($quiz_details->quiz_type == 'practice'){
        $quiz_type = 'Practice Quiz';
        $data[] = array('name' => 'PRACTICE', 'content' => 'true');
    }
    else
        $quiz_type = 'Class Test';

        if($key == 0){
        $key= '';
    }


    $data[] = array('name' => 'QUIZ_URL'.$key.'',       'content' => $quiz_details->quiz_url);
    $data[] = array('name' => 'QUIZ_NAME'.$key.'',      'content' => $quiz_details->name);
    $data[] = array('name' => 'QUIZ_TYPE',      'content' => $quiz_type);
    $data[] = array('name' => 'CLASS',          'content' => $division);
    $data[] = array('name' => 'TEXTBOOK'.$key.'',       'content' => $textbook_name);
    $data[] = array('name' => 'CHAPTER'.$key.'',        'content' => $chapter_name);
    $data[] = array('name' => 'QUIZ_MARKS',     'content' => $quiz_details->marks);

    }


    $data[] = get_mail_header($comm_data['blog_id']);
    $data[] = get_mail_footer($comm_data['blog_id']);
    switch_to_blog($current_blog);
    
    return $data;

}

function get_quiz_summary_data($quiz_id, $student_id, $quizz_type=''){

    $data = array();

    $summary= get_latest_quiz_response_summary($quiz_id,$student_id, $quizz_type);

    if($summary->negative_scored){
        $data[] = array('name' => 'NEG_MARKS',  'content' => $summary->negative_scored);
        $data[] = array('name' => 'SCORED',     'content' => $summary->marks_scored);
    }

    $quiz_status= get_quiz_status($quiz_id,$student_id);

    $data[] = array('name' => 'HIGHEST_HISTORICAL_SCORE',   'content' => $summary->highest_hist_score);
    $data[] = array('name' => 'AVG_HISTORICAL_SCORE',   'content' => $summary->avg_hist_score);
    $data[] = array('name' => 'HIGHEST_Y_DIVISION_STUDENT',   'content' => $summary->high_student);    
    $data[] = array('name' => 'HIGHEST_Y_DIVISION_SCORED',   'content' => $summary->highest_score);
    $data[] = array('name' => 'AVG_Y_DIVISION_SCORED',   'content' => $summary->avg_division_score);
    $data[] = array('name' => 'RANK',   'content' => $summary->rank);
    $data[] = array('name' => 'ALL_RANK',   'content' => $summary->all_rank);
    $data[] = array('name' => 'TOTAL_SCORED',   'content' => $summary->total_marks_scored);
    $data[] = array('name' => 'DATE',           'content' => date('d M Y', strtotime($summary->taken_on)));
    $data[] = array('name' => 'ATTEMPTS',       'content' => $quiz_status['attempts']);

    #file_put_contents('a8.txt', print_r($data, true));

    return $data;

}

// quiz summary data for summary report
function get_quiz_summary_report_data($comm_data, $quiz_id, $student_id, $division, $quizz_type=''){

    global $wpdb;

    $student_ans ='';
    $marks_below='';
    $current_student_max_quizes = '';
    $current_student_id = $student_id;
    $studs_taken_quiz = '';

    $data = array();


    $quizids = implode(", ", $quiz_id);

    $num_of_quizes_selected = sizeof($quiz_id);


    $start_date = $comm_data['start_date'];
    $end_date = $comm_data['end_date'];

    //how many quizzes a student has taken
    $query0 = $wpdb->prepare(" SELECT DISTINCT collection_id 
                    FROM {$wpdb->prefix}quiz_response_summary 
                    WHERE taken_on BETWEEN %s AND %s
                    AND quiz_meta like %s
                    AND student_id = %d
                    AND collection_id in ($quizids)", $start_date, $end_date, '%completed%', $student_id);
    $stud_quiz_data = $wpdb->get_col($query0);

    if ($stud_quiz_data == '') {
        $quizzes_taken_by_stud = 0;
        $student_ans ='';
    }
    else
        $quizzes_taken_by_stud = sizeof($stud_quiz_data);
    

    //student has taken any one of the selected quizzes
    if($quizzes_taken_by_stud > 0){
        $student_ans ='answered';

    
    //max marks in which quiz
     $query3 = $wpdb->prepare("SELECT SUM(marks_scored) as marks_scored, collection.name, meta.meta_value, collection.term_ids, collection.id
                FROM {$wpdb->prefix}quiz_response_summary as summary
                LEFT JOIN {$wpdb->prefix}quiz_question_response as question
                ON summary.summary_id = question.summary_id
                LEFT JOIN {$wpdb->base_prefix}content_collection as collection
                ON summary.collection_id = collection.id
                LEFT JOIN {$wpdb->base_prefix}collection_meta as meta
                ON summary.collection_id = meta.collection_id
                WHERE summary.taken_on BETWEEN %s AND %s
                AND summary.quiz_meta like %s
                AND summary.student_id = %d
                AND summary.collection_id in ($quizids)
                AND meta.meta_key = 'quiz_meta'
                GROUP BY question.summary_id
                ORDER BY marks_scored desc", $start_date, $end_date, '%completed%', $student_id);


    if($num_of_quizes_selected == 1){
        $student_data = $wpdb->get_row($query3);

        $max_marks_scored = $student_data->marks_scored;
        $quiz_name = $student_data->name;
        $meta_value = $student_data->meta_value;
        $term_ids = $student_data->term_ids;
    }
    else{
        $student_data = $wpdb->get_results($query3);

        foreach ($student_data as $key => $student) {

            $marks_scored = $student->marks_scored;
            $term_ids = $student->term_ids;
            $meta_value = $student->meta_value;

            $meta_data = maybe_unserialize($meta_value);
            $out_of = $meta_data['marks'];

            $percent_marks_scored[] = ($marks_scored/$out_of)*100;

        }

        $maxs = array_keys($percent_marks_scored, max($percent_marks_scored));

        $key = $maxs[0];


        $max_marks_scored = $student_data[$key]->marks_scored;
        $quiz_name = $student_data[$key]->name;
        $meta_value = $student_data[$key]->meta_value;
        $term_ids = $student_data[$key]->term_ids;

}

    $term_ids = maybe_unserialize($term_ids);
    $current_blog_id = get_current_blog_id();
    switch_to_blog(1);
    $textbook_id = $term_ids['textbook'];
    $my_max_subj_name = get_term_field('name', $textbook_id, 'textbook');
    switch_to_blog($current_blog_id);
          

    $meta_data = maybe_unserialize($meta_value);
    $out_of = $meta_data['marks'];

    //MARKS_BELOW
    $percent = ($max_marks_scored/$out_of)*100;

    if($percent < 80){
        $marks_below = 'true';
    }

    }



    // all students from that division
    $query2 = $wpdb->prepare("SELECT DISTINCT um1.user_id
        FROM {$wpdb->base_prefix}usermeta AS um1
        LEFT JOIN {$wpdb->base_prefix}usermeta AS um2
        ON um1.user_id = um2.user_id
        WHERE um1.meta_key LIKE %s
        AND um1.meta_value LIKE %s
        AND um2.meta_key LIKE %s
        AND um2.meta_value = %d",
        array('%capabilities','%student%','student_division', $division)
        );

    $student_ids = $wpdb->get_col($query2);

    $studentIDS = implode(", ", $student_ids);


    foreach ($student_ids as $student) {
    
    // max qiuz taker
    $query1 = $wpdb->prepare(" SELECT count(DISTINCT summary.collection_id) as collection_id, summary.student_id, users.display_name
                    FROM {$wpdb->prefix}quiz_response_summary as summary
                    LEFT JOIN {$wpdb->base_prefix}users as users
                    ON summary.student_id = users.ID
                    WHERE summary.taken_on BETWEEN %s AND %s
                    AND summary.quiz_meta like %s
                    AND summary.student_id = %d
                    AND summary.collection_id in ($quizids)", $start_date, $end_date, '%completed%', $student);

    $summary_data_all[] = $wpdb->get_row($query1);
    }

    

    $max =array_keys($summary_data_all, max($summary_data_all));

    $max = implode("", $max);
    foreach ($summary_data_all as $key => $summary_data) {
        if($key == $max){
       $max_quizes_taken = $summary_data->collection_id;
       $max_quiz_taker_name = $summary_data->display_name;
       $max_quiz_taker_id = $summary_data->student_id;

        }
    }

    if ($max_quiz_taker_id == $current_student_id)
        $current_student_max_quizes = 'true';

    // top scorer

    $query14 = $wpdb->prepare("SELECT SUM(marks_scored) as marks_scored,  users.display_name, summary.student_id, collection.term_ids, meta.meta_value
                FROM {$wpdb->prefix}quiz_response_summary as summary
                LEFT JOIN {$wpdb->base_prefix}users as users
                ON summary.student_id = users.ID
                LEFT JOIN {$wpdb->prefix}quiz_question_response as question
                ON summary.summary_id = question.summary_id
                LEFT JOIN {$wpdb->base_prefix}content_collection as collection
                ON summary.collection_id = collection.id
                LEFT JOIN {$wpdb->base_prefix}collection_meta as meta
                ON summary.collection_id = meta.collection_id
                WHERE summary.taken_on BETWEEN %s AND %s
                AND summary.quiz_meta like %s
                AND summary.student_id IN ($studentIDS)
                AND summary.collection_id IN ($quizids)
                AND meta.meta_key = 'quiz_meta'
                AND question.status = 'correct_answer'
                GROUP BY question.summary_id
                ORDER BY marks_scored desc", $start_date, $end_date, '%completed%');


    if($num_of_quizes_selected == 1){
        $top_scorer_data = $wpdb->get_row($query14);

        $class_top_scor = $top_scorer_data->marks_scored;
        $class_top_scorer_name = $top_scorer_data->display_name;
        $class_top_scorer_id = $top_scorer_data->student_id;
        $term_ids = $top_scorer_data->term_ids;

        if($top_scorer_data->student_id == '')
            $studs_taken_quiz = '';
        else
            $studs_taken_quiz = 'taken';
    }else{

        $top_scorer_data = $wpdb->get_results($query14);

        foreach ($top_scorer_data as $key => $top_scorer) {
                
                $marks_scored = $top_scorer->marks_scored;
                $term_ids = $top_scorer->term_ids;
                $meta_value = $top_scorer->meta_value;

                $meta_data = maybe_unserialize($meta_value);
                $out_of = $meta_data['marks'];

                $percent_marks_scored_top[] = ($marks_scored/$out_of)*100;
        }


        $max = array_keys($percent_marks_scored_top, max($percent_marks_scored_top));


        $keys = $max[0];


        $class_top_scor = $top_scorer_data[$keys]->marks_scored;
        $class_top_scorer_name = $top_scorer_data[$keys]->display_name;
        $class_top_scorer_id = $top_scorer_data[$keys]->student_id;
        $term_ids = $top_scorer_data[$keys]->term_ids;

        if($top_scorer_data[$keys]->student_id == '')
            $studs_taken_quiz = '';
        else
            $studs_taken_quiz = 'taken';

    }

    $term_ids = maybe_unserialize($term_ids);
    $current_blog_id = get_current_blog_id();

    switch_to_blog(1);
    $textbook_id = $term_ids['textbook'];
    $textbook_name = get_term_field('name', $textbook_id, 'textbook');
    switch_to_blog($current_blog_id);


    if($class_top_scorer_id == $current_student_id)
        $current_student_top_scorer = 'true';
    else
        $current_student_top_scorer ='';


     $data[] = array('name' => 'START_DATE',   'content' => $start_date);
     $data[] = array('name' => 'END_DATE',   'content' => $end_date);
     $data[] = array('name' => 'NUM_QUIZS_TAKEN',   'content' => $quizzes_taken_by_stud);
     $data[] = array('name' => 'STUDENT_ANS',   'content' => $student_ans);
     $data[] = array('name' => 'MAX_MARKS_QUIZ',   'content' => $max_marks_scored);
     $data[] = array('name' => 'MAX_MARKS_QUIZ_NAME',   'content' => $quiz_name);
     $data[] = array('name' => 'MARKS_BELOW',   'content' => $marks_below);
     $data[] = array('name' => 'MAX_QUIZ_TAKEN_STUDENT_NAME',   'content' => $max_quiz_taker_name);
     $data[] = array('name' => 'MAX_QUIZ_NUMBER',   'content' => $max_quizes_taken);
     $data[] = array('name' => 'CURRENT_STUDENT_MAX_QUIZES',   'content' => $current_student_max_quizes);
     $data[] = array('name' => 'CURRENT_STUDENT_MAX_SCORE',   'content' => $current_student_top_scorer);

     $data[] = array('name' => 'MAX_SCORE_SUBJECT_NAME',   'content' => $textbook_name);
     $data[] = array('name' => 'MY_MAX_SUBJECT_NAME',   'content' => $my_max_subj_name);
     $data[] = array('name' => 'CLASS_TOP_SCORER',   'content' => $class_top_scorer_name);
     $data[] = array('name' => 'STUDENTS_HAV_TAKEN_QUIZ',   'content' => $studs_taken_quiz);
     $data[] = array('name' => 'CLASS_TOP_SCOR',   'content' => $class_top_scor);
     
    return $data;

}

// quiz summary data for summary report
function get_quiz_summary_report_data($comm_data, $quiz_id, $student_id, $division, $quizz_type=''){

    global $wpdb;

    $student_ans ='';
    $marks_below='';
    $current_student_max_quizes = '';
    $current_student_id = $student_id;
    $studs_taken_quiz = '';

    $data = array();


    $quizids = implode(", ", $quiz_id);

    $num_of_quizes_selected = sizeof($quiz_id);


    $start_date = $comm_data['start_date'];
    $end_date = $comm_data['end_date'];

    //how many quizzes a student has taken
    $query0 = $wpdb->prepare(" SELECT DISTINCT collection_id 
                    FROM {$wpdb->prefix}quiz_response_summary 
                    WHERE taken_on BETWEEN %s AND %s
                    AND quiz_meta like %s
                    AND student_id = %d
                    AND collection_id in ($quizids)", $start_date, $end_date, '%completed%', $student_id);
    $stud_quiz_data = $wpdb->get_col($query0);

    if ($stud_quiz_data == '') {
        $quizzes_taken_by_stud = 0;
        $student_ans ='';
    }
    else
        $quizzes_taken_by_stud = sizeof($stud_quiz_data);
    

    //student has taken any one of the selected quizzes
    if($quizzes_taken_by_stud > 0){
        $student_ans ='answered';

    
    //max marks in which quiz
     $query3 = $wpdb->prepare("SELECT SUM(marks_scored) as marks_scored, collection.name, meta.meta_value, collection.term_ids, collection.id
                FROM {$wpdb->prefix}quiz_response_summary as summary
                LEFT JOIN {$wpdb->prefix}quiz_question_response as question
                ON summary.summary_id = question.summary_id
                LEFT JOIN {$wpdb->base_prefix}content_collection as collection
                ON summary.collection_id = collection.id
                LEFT JOIN {$wpdb->base_prefix}collection_meta as meta
                ON summary.collection_id = meta.collection_id
                WHERE summary.taken_on BETWEEN %s AND %s
                AND summary.quiz_meta like %s
                AND summary.student_id = %d
                AND summary.collection_id in ($quizids)
                AND meta.meta_key = 'quiz_meta'
                GROUP BY question.summary_id
                ORDER BY marks_scored desc", $start_date, $end_date, '%completed%', $student_id);


    if($num_of_quizes_selected == 1){
        $student_data = $wpdb->get_row($query3);

        $max_marks_scored = $student_data->marks_scored;
        $quiz_name = $student_data->name;
        $meta_value = $student_data->meta_value;
        $term_ids = $student_data->term_ids;
    }
    else{
        $student_data = $wpdb->get_results($query3);

        foreach ($student_data as $key => $student) {

            $marks_scored = $student->marks_scored;
            $term_ids = $student->term_ids;
            $meta_value = $student->meta_value;

            $meta_data = maybe_unserialize($meta_value);
            $out_of = $meta_data['marks'];

            $percent_marks_scored[] = ($marks_scored/$out_of)*100;

        }

        $maxs = array_keys($percent_marks_scored, max($percent_marks_scored));

        $key = $maxs[0];


        $max_marks_scored = $student_data[$key]->marks_scored;
        $quiz_name = $student_data[$key]->name;
        $meta_value = $student_data[$key]->meta_value;
        $term_ids = $student_data[$key]->term_ids;

}

    $term_ids = maybe_unserialize($term_ids);
    $current_blog_id = get_current_blog_id();
    switch_to_blog(1);
    $textbook_id = $term_ids['textbook'];
    $my_max_subj_name = get_term_field('name', $textbook_id, 'textbook');
    switch_to_blog($current_blog_id);
          

    $meta_data = maybe_unserialize($meta_value);
    $out_of = $meta_data['marks'];

    //MARKS_BELOW
    $percent = ($max_marks_scored/$out_of)*100;

    if($percent < 80){
        $marks_below = 'true';
    }

    }



    // all students from that division
    $query2 = $wpdb->prepare("SELECT DISTINCT um1.user_id
        FROM {$wpdb->base_prefix}usermeta AS um1
        LEFT JOIN {$wpdb->base_prefix}usermeta AS um2
        ON um1.user_id = um2.user_id
        WHERE um1.meta_key LIKE %s
        AND um1.meta_value LIKE %s
        AND um2.meta_key LIKE %s
        AND um2.meta_value = %d",
        array('%capabilities','%student%','student_division', $division)
        );

    $student_ids = $wpdb->get_col($query2);

    $studentIDS = implode(", ", $student_ids);


    foreach ($student_ids as $student) {
    
    // max qiuz taker
    $query1 = $wpdb->prepare(" SELECT count(DISTINCT summary.collection_id) as collection_id, summary.student_id, users.display_name
                    FROM {$wpdb->prefix}quiz_response_summary as summary
                    LEFT JOIN {$wpdb->base_prefix}users as users
                    ON summary.student_id = users.ID
                    WHERE summary.taken_on BETWEEN %s AND %s
                    AND summary.quiz_meta like %s
                    AND summary.student_id = %d
                    AND summary.collection_id in ($quizids)", $start_date, $end_date, '%completed%', $student);

    $summary_data_all[] = $wpdb->get_row($query1);
    }

    

    $max =array_keys($summary_data_all, max($summary_data_all));

    $max = implode("", $max);
    foreach ($summary_data_all as $key => $summary_data) {
        if($key == $max){
       $max_quizes_taken = $summary_data->collection_id;
       $max_quiz_taker_name = $summary_data->display_name;
       $max_quiz_taker_id = $summary_data->student_id;

        }
    }

    if ($max_quiz_taker_id == $current_student_id)
        $current_student_max_quizes = 'true';

    // top scorer

    $query14 = $wpdb->prepare("SELECT SUM(marks_scored) as marks_scored,  users.display_name, summary.student_id, collection.term_ids, meta.meta_value
                FROM {$wpdb->prefix}quiz_response_summary as summary
                LEFT JOIN {$wpdb->base_prefix}users as users
                ON summary.student_id = users.ID
                LEFT JOIN {$wpdb->prefix}quiz_question_response as question
                ON summary.summary_id = question.summary_id
                LEFT JOIN {$wpdb->base_prefix}content_collection as collection
                ON summary.collection_id = collection.id
                LEFT JOIN {$wpdb->base_prefix}collection_meta as meta
                ON summary.collection_id = meta.collection_id
                WHERE summary.taken_on BETWEEN %s AND %s
                AND summary.quiz_meta like %s
                AND summary.student_id IN ($studentIDS)
                AND summary.collection_id IN ($quizids)
                AND meta.meta_key = 'quiz_meta'
                AND question.status = 'correct_answer'
                GROUP BY question.summary_id
                ORDER BY marks_scored desc", $start_date, $end_date, '%completed%');


    if($num_of_quizes_selected == 1){
        $top_scorer_data = $wpdb->get_row($query14);

        $class_top_scor = $top_scorer_data->marks_scored;
        $class_top_scorer_name = $top_scorer_data->display_name;
        $class_top_scorer_id = $top_scorer_data->student_id;
        $term_ids = $top_scorer_data->term_ids;

        if($top_scorer_data->student_id == '')
            $studs_taken_quiz = '';
        else
            $studs_taken_quiz = 'taken';
    }else{

        $top_scorer_data = $wpdb->get_results($query14);

        foreach ($top_scorer_data as $key => $top_scorer) {
                
                $marks_scored = $top_scorer->marks_scored;
                $term_ids = $top_scorer->term_ids;
                $meta_value = $top_scorer->meta_value;

                $meta_data = maybe_unserialize($meta_value);
                $out_of = $meta_data['marks'];

                $percent_marks_scored_top[] = ($marks_scored/$out_of)*100;
        }


        $max = array_keys($percent_marks_scored_top, max($percent_marks_scored_top));


        $keys = $max[0];


        $class_top_scor = $top_scorer_data[$keys]->marks_scored;
        $class_top_scorer_name = $top_scorer_data[$keys]->display_name;
        $class_top_scorer_id = $top_scorer_data[$keys]->student_id;
        $term_ids = $top_scorer_data[$keys]->term_ids;

        if($top_scorer_data[$keys]->student_id == '')
            $studs_taken_quiz = '';
        else
            $studs_taken_quiz = 'taken';

    }

    $term_ids = maybe_unserialize($term_ids);
    $current_blog_id = get_current_blog_id();

    switch_to_blog(1);
    $textbook_id = $term_ids['textbook'];
    $textbook_name = get_term_field('name', $textbook_id, 'textbook');
    switch_to_blog($current_blog_id);


    if($class_top_scorer_id == $current_student_id)
        $current_student_top_scorer = 'true';
    else
        $current_student_top_scorer ='';


     $data[] = array('name' => 'START_DATE',   'content' => $start_date);
     $data[] = array('name' => 'END_DATE',   'content' => $end_date);
     $data[] = array('name' => 'NUM_QUIZS_TAKEN',   'content' => $quizzes_taken_by_stud);
     $data[] = array('name' => 'STUDENT_ANS',   'content' => $student_ans);
     $data[] = array('name' => 'MAX_MARKS_QUIZ',   'content' => $max_marks_scored);
     $data[] = array('name' => 'MAX_MARKS_QUIZ_NAME',   'content' => $quiz_name);
     $data[] = array('name' => 'MARKS_BELOW',   'content' => $marks_below);
     $data[] = array('name' => 'MAX_QUIZ_TAKEN_STUDENT_NAME',   'content' => $max_quiz_taker_name);
     $data[] = array('name' => 'MAX_QUIZ_NUMBER',   'content' => $max_quizes_taken);
     $data[] = array('name' => 'CURRENT_STUDENT_MAX_QUIZES',   'content' => $current_student_max_quizes);
     $data[] = array('name' => 'CURRENT_STUDENT_MAX_SCORE',   'content' => $current_student_top_scorer);

     $data[] = array('name' => 'MAX_SCORE_SUBJECT_NAME',   'content' => $textbook_name);
     $data[] = array('name' => 'MY_MAX_SUBJECT_NAME',   'content' => $my_max_subj_name);
     $data[] = array('name' => 'CLASS_TOP_SCORER',   'content' => $class_top_scorer_name);
     $data[] = array('name' => 'STUDENTS_HAV_TAKEN_QUIZ',   'content' => $studs_taken_quiz);
     $data[] = array('name' => 'CLASS_TOP_SCOR',   'content' => $class_top_scor);
     
    return $data;

}
