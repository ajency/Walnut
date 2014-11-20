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

function quiz_completed_parent_mail_preview($data){

    require_once get_template_directory()."/ajcm_components/quiz.php";

    $comm_data = array(
        'component'=>$data['component'],
        'communication_type'=>$data['communication_type']
        );

    $recipient=$data['additional_data']['recipient'];
    $division =$data['additional_data']['division'];

    //print_r($recipient); exit;

    $template_data['template_name']              = 'quiz-completed-parent-mail'; 
    $template_data['template_content']           = array(); 
    $template_data['merge_vars'] = get_quiz_template_data($comm_data,$recipient['quiz_id'], $division);

    $quiz_summary = get_quiz_summary_data($recipient['quiz_id'],$recipient['student_id']);
    
    $template_data['merge_vars'] = array_merge($template_data['merge_vars'],$quiz_summary);
    $template_data['merge_vars'][]=array(
        'name'=>'STUDENT_NAME',
        'content'=>$recipient['student_name']
        );
    #print_r($template_data['global_merge_vars']);exit;
    $blog_data= get_blog_details($comm_data['blog_id'], true);
    $template_data['merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
    );

    return $template_data;

}