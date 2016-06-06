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

function add_quiz_published_student_mail($data, $comm_data){

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

function add_quiz_published_parent_mail($data, $comm_data){

    global $aj_comm;

    file_put_contents("aaaaaaaa.txt", print_r($data, true));
    file_put_contents("aaaaaaaab.txt", print_r($comm_data, true));

    $meta = $data['additional_data'];

    $meta_data['division'] = $meta['division']; 

    $raw_recipients = $meta['raw_recipients'];
    $meta_data['quiz_id'] = $meta['quiz_ids'];

    foreach($meta['quiz_ids'] as $quiz_id){
        $recipients = array();

        #$meta_data['quiz_id']= $quiz_id;

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

function add_quiz_summary_student_mail($data, $comm_data){

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

function add_quiz_summary_parent_mail($data, $comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];

    $meta_data['division'] = $meta['division']; 

    $raw_recipients = $meta['raw_recipients'];

    file_put_contents("a.txt", print_r($raw_recipients, true));

    $meta_data['quiz_id'] = $meta['quiz_ids'];

    $meta_data['start_date'] = $meta['start_date'];
    $meta_data['end_date'] = $meta['end_date'];

    foreach($meta['quiz_ids'] as $quiz_id){
        $recipients = array();

        #$meta_data['quiz_id']= $quiz_id;

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

        }


        
    }

    $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);

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

/*quiz summary parent email recipients*/
function quiz_summary_parent_mail_recipients($quiz_id,$division){

    global $wpdb;

    if(!$quiz_id)
        return false;

    $parents=$students= array();
    
    //for all student id's (students hav division)
    $query1 = $wpdb->prepare("SELECT DISTINCT um1.user_id
        FROM {$wpdb->base_prefix}usermeta AS um1
        LEFT JOIN {$wpdb->base_prefix}usermeta AS um2
        ON um1.user_id = um2.user_id
        WHERE um1.meta_key LIKE %s
        AND um1.meta_value LIKE %s
        AND um2.meta_key LIKE %s
        AND um2.meta_value = %d",
        array('%capabilities','%student%','student_division', $division)
        );

    #$txt = $query1." - QUERY..";
    #fwrite($myfile, "\n". $txt);
    $student_ids= $wpdb->get_col($query1);

    foreach($student_ids as $student){

            $students[]=$student;
    }
    
    if(sizeof($students)>0)
        $parents= get_parents_by_student_ids($student_ids);

    #fclose($myfile);
    return $parents;
    
}


/* Recipients who haven't taken the quiz*/
function quiz_published_parent_mail_recipients($quiz_id){

    global $wpdb;
    #file_put_contents("abc.txt", print_r($quiz_id, true));

    if(!$quiz_id)
        return false;

    $parents=$students= $recipients = $divison = $stud_report_ids = array();
    
    // for studs who have taken the quiz
   /* $query = $wpdb->prepare("SELECT DISTINCT student_id 
        FROM {$wpdb->prefix}quiz_response_summary 
        WHERE quiz_meta LIKE %s
            AND collection_id = %d",
        array('%"completed";%', $quiz_id)
    );*/

    // textbook id for that particular quiz id
    $select_query = $wpdb->prepare ("SELECT * FROM {$wpdb->prefix}content_collection
        WHERE id = %d", $quiz_id);
    $data = $wpdb->get_row ($select_query);
    $terms = maybe_unserialize($data->term_ids);
    $textbook = $terms['textbook'];

    //for the textbook id's get the class id's
    $class_id_query = $wpdb->prepare("SELECT class_id
        FROM {$wpdb->prefix}textbook_relationships
        WHERE textbook_id = %d", $textbook);
    $class_ids = $wpdb->get_row($class_id_query);
    $classes = maybe_unserialize($class_ids->class_id);
    $class = implode(",",$classes);



    //from class id's get division id's
    $div_query = $wpdb->prepare("SELECT id
        FROM {$wpdb->prefix}class_divisions
        WHERE class_id IN ($class)");

    $division = $wpdb->get_col($div_query);
    $division_ids = implode(',', $division);



/*
    //report of quiz email list
   if (get_current_blog_id() == 1){

    $blog_id_query = $wpdb->prepare("SELECT DISTINCT blog_id
        FROM {$wpdb->base_prefix}blogs
        WHERE blog_id != 1");

    $blog_ids = $wpdb->get_col($blog_id_query); 

    foreach ($blog_ids as $blog) {
        $tablename = "wp_".$blog."_quiz_response_summary";
        $query_report = $wpdb->prepare("SELECT DISTINCT student_id 
        FROM $tablename 
        WHERE quiz_meta LIKE %s
            AND collection_id = %d",
        array('%completed%', $quiz_id)
        );  

    $stud_report_ids = $wpdb->get_col($query_report);
    $stud_report_ids = implode(',',$stud_report_ids);
    $stud_id[] = $stud_report_ids;
    }//foreach ends here
    $stud_id = implode(',',$stud_id);
    $stud_id = trim($stud_id,",");

   }else{

        $query_report = $wpdb->prepare("SELECT DISTINCT student_id 
        FROM {$wpdb->prefix}quiz_response_summary 
        WHERE quiz_meta LIKE %s
            AND collection_id = %d",
        array('%"completed";%', $quiz_id)
    );
    $stud_report_ids = $wpdb->get_col($query_report);
    $stud_id = implode(',',$stud_report_ids);
   }*/

    //for all student id's (students hav division)
    $query1 = $wpdb->prepare("SELECT DISTINCT um1.user_id
        FROM {$wpdb->base_prefix}usermeta AS um1
        LEFT JOIN {$wpdb->base_prefix}usermeta AS um2
        ON um1.user_id = um2.user_id
        WHERE um1.meta_key LIKE %s
        AND um1.meta_value LIKE %s
        AND um2.meta_key LIKE %s
        AND um2.meta_value IN ($division_ids)",
        array('%capabilities','%student%','student_division')
        );

    $student_ids= $wpdb->get_col($query1);

    foreach($student_ids as $student){

            $students[]=$student;
    }

    if(sizeof($students)>0)
        $parents= get_parents_by_student_ids($student_ids);

    return $parents;
    //return $student_ids;
    
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


/* quiz summary email recipients function */
function prepare_quiz_summary_parent_mail_recipients($data){

    $recipients= array();

    $division = $data['additional_data']['division'];
    $quiz_ids = $data['additional_data']['quiz_ids'];
    foreach ($quiz_ids as $quiz){
        $users = quiz_summary_parent_mail_recipients($quiz,$division);
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


/** for students who haven't given taken the quiz*/

function prepare_quiz_published_parent_mail_recipients($data){

    #file_put_contents("fwwwilename.txt", print_r($data, true));

    $recipients= array();

    #$division = $data['additional_data']['division'];
    $quiz_ids = $data['additional_data']['quiz_ids'];
    $quiz = $quiz_ids[0];
    // get all student ids here
    file_put_contents("a1.txt", print_r($quiz_ids, true));



    //foreach ($quiz_ids as $quiz){
        $users = quiz_published_parent_mail_recipients($quiz);
        foreach($users as $user){
            $student = get_userdata($user->student_id);
            $division = get_user_meta($user->student_id,'student_division',true);
            $data=array(
                'parent_name'   => $user->display_name,
                'parent_id'     => $user->ID,
                'parent_email'  => $user->user_email,
                'quiz_id'       => $quiz,
                'quiz_name'     => get_module_name($quiz),
                'student_id'    => $user->student_id,
                'student_name'  => $student->display_name,
                'student_division'=> $division
                );
            $recipients[]=$data;
        }
        
    //}

    return $recipients;
    //return $users;
}

function quiz_completed_parent_mail_preview($data){

    require_once get_template_directory()."/ajcm_components/quiz.php";

    $comm_data = array(
        'component'=>$data['component'],
        'communication_type'=>$data['communication_type'],
        'blog_id'   => get_current_blog_id()
        );

    $recipient=$data['additional_data']['preview_recipient'];
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

// preview for email summary 
function quiz_summary_parent_mail_preview($data){

    require_once get_template_directory()."/ajcm_components/quiz.php";
#$myfile = fopen("abc.txt", "a");
    $comm_data = array(
        'component'=>$data['component'],
        'communication_type'=>$data['communication_type'],
        'blog_id'   => get_current_blog_id(),
        'student_id' => $data['additional_data']['preview_recipient']['student_id'],
        'start_date' =>$data['additional_data']['start_date'],
        'end_date' =>$data['additional_data']['end_date']
        );

    $recipient=$data['additional_data']['preview_recipient'];
    $division =$data['additional_data']['division'];
#fwrite($myfile, $recipient['student_id']);
#fclose($myfile);
    //print_r($recipient); exit;

    $template_data['template_name']              = 'quiz-summary-parent-mail'; 
    $template_data['template_content']           = array(); 

    #$template_data['merge_vars'] = get_quiz_summary_template_data($comm_data,$data['additional_data']['quiz_ids'], $division);

    //fetch all student specific data
    $template_data['merge_vars'] = get_quiz_summary_report_data($comm_data, $data['additional_data']['quiz_ids'],$recipient['student_id'], $division);
    
    #$template_data['merge_vars'] = array_merge($template_data['merge_vars'],$quiz_summary);

    $template_data['merge_vars'][]=array(
        'name'=>'STUDENT_NAME',
        'content'=>$recipient['student_name']
        );
    #print_r($template_data['global_merge_vars']);exit;
    $blog_data= get_blog_details($comm_data['blog_id'], true);
    $template_data['merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a href="'.$blog_data->siteurl.'">Click here</a>'
    );
   file_put_contents("atemplate_data.txt", print_r($template_data, true));
    return $template_data;

}

//preview of email for selected quizes
function quiz_published_parent_mail_preview($data){

    $quizes_id = [];

    #file_put_contents("abc.txt", print_r($data, true));

    require_once get_template_directory()."/ajcm_components/quiz.php";

    $comm_data = array(
        'component'=>$data['component'],
        'communication_type'=>$data['communication_type'],
        'blog_id'   => get_current_blog_id()
        );

    $recipient=$data['additional_data']['preview_recipient'];
    $quizes_id = $data['additional_data']['quiz_ids'];
    //$division =$data['additional_data']['preview_recipient']['student_division'];

    //print_r($recipient); exit;

    $template_data['template_name']              = 'quiz-published-parent-mail'; 
    $template_data['template_content']           = array(); 
    $template_data['merge_vars'] = get_quiz_list_template_data($comm_data,$quizes_id, $recipient['student_division']);
    $quiz_tyyype = 'quiz-list';

    $quiz_summary = get_quiz_summary_data($recipient['quiz_id'],$recipient['student_id'],$quiz_tyyype);
    
    $template_data['merge_vars'] = array_merge($template_data['merge_vars'],$quiz_summary);
    $template_data['merge_vars'][]=array(
        'name'=>'STUDENT_NAME',
        'content'=>$recipient['student_name']
        );
    #print_r($template_data['global_merge_vars']);exit;
    $blog_data= get_blog_details($comm_data['blog_id'], true);
    $template_data['merge_vars'][]=array(
        'name'      => 'BLOG_URL',
        'content'   => '<a href="'.$blog_data->siteurl.'">Click here</a>'
    );

    return $template_data;

}