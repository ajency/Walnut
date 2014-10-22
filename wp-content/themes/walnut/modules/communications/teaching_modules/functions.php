<?php

#function to test communication processing
function test_comm(){
    global $aj_comm;

    $aj_comm->cron_process_communication_queue();
    echo "test";
    exit;
}

#add_action('init', 'test_comm');

//Invoking the communication plugin
function add_taught_in_class_student_mail($data, $comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];
    $meta_data['division'] = $meta['division'];

    $recipients = get_student_recipients($division=$meta['division']);

    foreach($meta['module_ids'] as $module_id){

        $meta_data['module_id']= $module_id;

        $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
    }

    return $comm;

}

//Invoking the communication plugin
function add_taught_in_class_parent_mail($data,$comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];
    $meta_data['division'] = $meta['division'];

    $recipients=get_parent_recipients($division=$meta['division']);

    foreach($meta['module_ids'] as $module_id){

        $meta_data['module_id']= $module_id;

        $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
    }

    return $comm;

}

function cron_teaching_modules_report_mail(){

    global $aj_comm;

    $comm_data = array(
        'component'             => 'teaching_modules',
        'communication_type'    => 'teaching_modules_report'
        );

    $meta_data = array();

    $args = array(
        'archived'  => 0,
        'deleted'   => 0
        );
 
    $blogs = wp_get_sites($args);

    foreach($blogs as $blog) {
        
        $comm_data['blog_id'] = $blog['blog_id'];
        
        $user_args= array(
            'blog_id' => $blog['blog_id'],
            'role' => 'school-admin'
        );

        $users = get_users($user_args);

        $recipients = array();

        foreach($users as $user){

            $recipients[] = array(                
                    'user_id'   => $user->ID,
                    'type'      => 'email',
                    'value'     => $user->user_email
                );
        }

        $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
    }

    return $comm;
}

add_action('queue_teaching_modules_report','cron_teaching_modules_report_mail');
