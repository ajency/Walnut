<?php

function add_quiz_completed_student_mail($data, $comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];

    $user = get_userdata(get_current_user_id());

    $recipients[] = array(
                'user_id'   => $user->ID,
                'type'      => 'email',
                'value'     => $user->user_email
            );

    $meta_data['quiz_id']= $meta['quiz_id'];

    $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);

    return $comm;

}

function add_quiz_completed_parent_mail($data, $comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];

    $meta_data['division'] = $meta['division']; 

    $raw_recipients = $meta['raw_recipients'];

    foreach($meta['quiz_ids'] as $quiz_id){
        $recipients = array();

        $meta_data['quiz_id']= $quiz_id;

        if(sizeof($raw_recipients)>0){

            foreach($raw_recipients as $key=>$user){

                if($user['quiz_id']==$quiz_id){
                    $recipients[] = array(                
                            'user_id'   => $user['parent_id'],
                            'type'      => 'email',
                            'value'     => $user['parent_email']
                        ); 
                    unset($raw_recipients[$key]);
                }
            }

            $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
        }
        
    }

    return $comm;

}

function quiz_completed_parent_mail_recipients($quiz_id,$division){

    global $wpdb;

    if(!$quiz_id)
        return false;

    $parents=$students= $recipients = array();
    
    $query = $wpdb->prepare("SELECT DISTINCT student_id 
        FROM {$wpdb->prefix}quiz_response_summary 
        WHERE quiz_meta LIKE %s
            AND collection_id = %d",
        array('%"completed";%', $quiz_id)
    );

    $student_ids= $wpdb->get_col($query);

    foreach($student_ids as $student){
        $student_division = get_user_meta($student,'student_division',true);
        if($student_division == $division)
            $students[]=$student;
    }
    
    if(sizeof($students)>0)
        $parents= get_parents_by_student_ids($students);

    return $parents;
    
}

function prepare_quiz_completed_parent_mail_recipients($data){

    $recipients= array();

    $division = $data['additional_data']['division'];
    $quiz_ids = $data['additional_data']['quiz_ids'];
    foreach ($quiz_ids as $quiz){
        $users = quiz_completed_parent_mail_recipients($quiz,$division);
        foreach($users as $user){
            $student = get_userdata($user->student_id);
            $data=array(
                'parent_name'   => $user->display_name,
                'parent_id'     => $user->ID,
                'parent_email'  => $user->user_email,
                'quiz_id'       => $quiz,
                'quiz_name'     => get_module_name($quiz),
                'student_id'    => $user->student_id,
                'student_name'  => $student->display_name
                );
            $recipients[]=$data;
        }
        
    }

    return $recipients;
}

function get_quiz_template_data($comm_data,$quiz_id){
    
    global $aj_comm;

    $data = array();    
    
    if($comm_data['communication_type'] == 'quiz_completed_student_mail')
        $division   = get_user_meta($comm_data['user_id'],'student_division', true);

    else
        $division   = $aj_comm->get_communication_meta($comm_data['id'],'division');


    $siteurl = get_site_url();

    $data[] = array(
        'name' => 'QUIZ_URL',       
        'content' => "<a href='$siteurl/#view-quiz/$quiz_id'>here</a>"
    );
    
    switch_to_blog($comm_data['blog_id']);

    $school_admin = get_users(array('role'=>'school-admin','fields'=>'ID'));

    $quiz_details= get_single_quiz_module($quiz_id,$school_admin[0]);   

    restore_current_blog();

    $terms= $quiz_details->term_ids;

    $textbook_id = $terms['textbook'];

    $chapter_id = $terms['chapter'];

    $textbook_name = get_term_field('name', $textbook_id, 'textbook');

    if($chapter_id)
        $chapter_name = get_term_field('name', $chapter_id, 'textbook');
    else
        $chapter_name = ' -- ';

    $subject = get_textbook_subject($textbook_id);

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
    $data[] = array('name' => 'SUBJECT',        'content' => $subject);
    $data[] = array('name' => 'TEXTBOOK',       'content' => $textbook_name);
    $data[] = array('name' => 'CHAPTER',        'content' => $chapter_name);
    $data[] = array('name' => 'QUIZ_MARKS',     'content' => $quiz_details->marks);
    
    $data[] = get_mail_header($comm_data['blog_id']);
    $data[] = get_mail_footer($comm_data['blog_id']);

    return $data;

}