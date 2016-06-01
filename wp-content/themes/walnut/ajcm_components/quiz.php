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

    file_put_contents("getvarsReci.txt", print_r($comm_data, true));
    file_put_contents("getVarsComm.txt", print_r($recipients, true));
    $template_data['name']      = 'quiz-published-parent-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    #$template_data['subject']   = $blog_data->blogname.':  Quiz List for student ';
    $template_data['subject']   =  'Go Nuts! More quizzes';

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

    file_put_contents("getvarsReciSUMM.txt", print_r($comm_data, true));
    file_put_contents("getVarsCommSUMM.txt", print_r($recipients, true));

    $template_data['name']      = 'quiz-summary-parent-mail';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

    #$template_data['subject']   = $blog_data->blogname.':  Quiz summary for student ';
    $template_data['subject']   =  'Nuts Ah-oye! Some nutlets for you!';

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

    $quiz_details= get_single_quiz_module($quiz_id,$school_admin);


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

    $myfile = fopen("log_tempa.txt", "a");


    #file_put_contents('log_tempa.txt', print_r($comm_data, true));

    $current_student = $comm_data['student_id'];
    #fwrite($myfile, $current_student);

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


#file_put_contents('log_tempa.txt', print_r($taken_by_studs_ids, true));
    #file_put_contents('log_tempa.txt', print_r($quiz_details->taken_by_stud, true));

    #$num = sizeof($studeny_taken_quiz_id);
    
    #fwrite($myfile, $num);
    


    if (in_array($current_student, $taken_by_studs_ids))
    {
       $quiz_details->num = 2;
    }
    else
    {
        $quiz_details->num = '';
    }

    #fwrite($myfile, $quiz_details->num);

    $taken = $quiz_details->taken_by;

    #fwrite($myfile, $taken);

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
    fclose($myfile);
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

    $data[] = array(
        'name' => 'QUIZ_URL',
        'content' => "<a target='_blank' href='$siteurl/#view-quiz/$quiz_id'>here</a>"
    );

    switch_to_blog($comm_data['blog_id']);

    $school_admin = get_school_admin_for_cronjob($comm_data['blog_id']);

    $quiz_details= get_single_quiz_module($quiz_id,$school_admin);


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

    file_put_contents('log_tempa.txt', print_r($data, true));

    return $data;

}
