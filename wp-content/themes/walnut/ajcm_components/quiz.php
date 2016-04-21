<?php

function getvars_quizzes_taken_report($recipients_email,$comm_data){

    global $aj_comm;

    $template_data['name']      = 'quizzes-taken-report';

    $template_data['subject']   = 'Synapse Notification: Quiz report for today';

    $template_data['from_email'] = 'no-reply@synapselearning.net';
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

    $template_data['from_email'] = 'no-reply@synapselearning.net';
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

    $template_data['from_email'] = 'no-reply@synapselearning.net';
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

function get_quiz_summary_data($quiz_id, $student_id){

    $data = array();

    $summary= get_latest_quiz_response_summary($quiz_id,$student_id);

    if($summary->negative_scored){
        $data[] = array('name' => 'NEG_MARKS',  'content' => $summary->negative_scored);
        $data[] = array('name' => 'SCORED',     'content' => $summary->marks_scored);
    }

    $quiz_status= get_quiz_status($quiz_id,$student_id);

    $data[] = array('name' => 'TOTAL_SCORED',   'content' => $summary->total_marks_scored);
    $data[] = array('name' => 'DATE',           'content' => date('d M Y', strtotime($summary->taken_on)));
    $data[] = array('name' => 'ATTEMPTS',       'content' => $quiz_status['attempts']);

    return $data;

}
