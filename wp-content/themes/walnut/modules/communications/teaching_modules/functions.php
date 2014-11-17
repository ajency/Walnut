<?php

#function to test communication processing
function test_comm(){
    global $aj_comm;
    
    if(isset($_GET['testing'])){
        #cron_quizzes_taken_report();

        #cron_teaching_modules_report_mail();
    
        $aj_comm->cron_process_communication_queue();
        echo "test";
        exit;
    }
}

add_action('init', 'test_comm');

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
        
        if($blog['blog_id'] != 1){

            $comm_data['blog_id'] = $blog['blog_id'];
            
            $filepath= get_teaching_modules_report_zip($blog['blog_id']);

            $meta_data = array('filepath'=>$filepath);

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
    
    }

    return $comm;
}

add_action('queue_teaching_modules_report','cron_teaching_modules_report_mail');


function get_teaching_modules_report_zip($blog_id){

    $files= get_teaching_modules_report_csv($blog_id);
    
    $uploads_dir=wp_upload_dir();

    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);

    if(!file_exists($upload_directory.'/tmp/reports'))
        mkdir($upload_directory.'/tmp/reports',0755);

    $random= rand(9999,99999);

    $upload_path= '/tmp/reports/teaching-modules-report-'.$random.date('Ymdhis').'.zip';

    $zip = create_zip($files,$upload_directory.$upload_path);

    return $zip;

}

function get_teaching_modules_report_csv($blog_id){

    global $wpdb;

    $files = array();

    switch_to_blog($blog_id);

    $divisions= get_all_divisions();

    $headers = array('Training module name',
                'Status',
                'Teacher'
            );

    if($divisions){

        foreach($divisions as $div){

            switch_to_blog($blog_id);

            $modules_query= $wpdb->prepare("SELECT collection_id FROM {$wpdb->prefix}question_response WHERE 
                        ( DATE(start_date) LIKE %s OR DATE(end_date) LIKE %s ) 
                        AND division LIKE %s",
                        date('Y-m-d'), date('Y-m-d'), $div['id']
                );

            $moduleIDs = $wpdb->get_col($modules_query);

            // output the column headings
            $output= str_putcsv($headers);

            if($moduleIDs && sizeof($moduleIDs)>0){

                $moduleIDs = __u::uniq($moduleIDs);

                foreach($moduleIDs as $moduleID){

                    $row = get_teaching_module_report_data($moduleID, $div['id']);

                    if($row)
                        $output .= str_putcsv($row);
                }
            }

            $files[]= array(
                    'name'  => $div['division'],
                    'data'  => $output
                );
        }
    }

    restore_current_blog();

    return $files;

}

function get_teaching_module_report_data($moduleID, $division){

    $moduleData = get_single_content_module($moduleID, $division);

    $taken_by= get_module_taken_by($moduleID,$division);

    if($moduleData->status == 'completed')
        $status = 'Completed';
    else
        $status = 'In Progress';

    if($moduleData){

        $row = array(
            $moduleData->name,
            $status,
            $taken_by
        );
    }

    else 
        return false;

    return $row;

}
