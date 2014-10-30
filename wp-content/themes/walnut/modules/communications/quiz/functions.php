<?php

function cron_quizzes_taken_report(){

    global $aj_comm;

    $comm_data = array(
        'component'             => 'quiz',
        'communication_type'    => 'quizzes_taken_report'
        );

    $args = array(
        'archived'  => 0,
        'deleted'   => 0
        );
 
    $blogs = wp_get_sites($args);

    foreach($blogs as $blog) {
    
        $comm_data['blog_id'] = $blog['blog_id'];

        $filepath= get_quiz_report_zip($blog['blog_id']);

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

    return $comm;
}

add_action('queue_quizzes_taken_report','cron_quizzes_taken_report');

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
	global $wpdb;

    $meta = $data['additional_data'];

    $meta_data['division'] = $meta['division'];

    foreach($meta['quiz_ids'] as $quiz_id){

    	$recipients = array();

    	switch_to_blog($comm_data['blog_id']);
    
	    $query = $wpdb->prepare("SELECT DISTINCT student_id 
	    	FROM {$wpdb->prefix}quiz_response_summary 
	    	WHERE quiz_meta LIKE %s
	    		AND collection_id = %d",
	    	array('%"completed";%', $quiz_id)
	    );

	    $student_ids= $wpdb->get_col($query);

	    if($student_ids){

		    $parents= get_parents_by_student_ids($student_ids);

		    if($parents){
			    foreach($parents as $user){
			    	$recipients[] = array(                
		                    'user_id'   => $user->ID,
		                    'type'      => 'email',
		                    'value'     => $user->user_email
		                ); 
			    }
			}

		    restore_current_blog();

	        $meta_data['quiz_id']= $quiz_id;

        	$comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
	    }
    }

    return $comm;

}

function get_quiz_report_zip($blog_id){

    $files= get_quiz_report_csv($blog_id);
    
    $uploads_dir=wp_upload_dir();

    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);

    if(!file_exists($upload_directory.'/tmp/reports'))
        mkdir($upload_directory.'/tmp/reports',0755);

    $random= rand(9999,99999);

    $upload_path= '/tmp/reports/quiz-report-'.$random.date('Ymdhis').'.zip';

    create_zip($files,$upload_directory.$upload_path);

    #echo $upload_url.$upload_path; exit;

    return $upload_directory.$upload_path;

}

function get_quiz_report_csv($blog_id){

    global $wpdb;

    $files = array();

    switch_to_blog($blog_id);

    $divisions= get_all_divisions();

    $headers = array('Student Name',
                'Roll Number',
                'Quiz Name',
                'Quiz Type',
                'Total Quiz Marks',
                'Total Scored',
                'Negative Marks',
                'Total Marks',
                'Quiz Time',
                'Time Taken by Student'
            );

    if($divisions){

        foreach($divisions as $div){

            switch_to_blog($blog_id);

            $students = get_students_by_division($div['id']);

            if(!$students)
                continue;

            $student_ids = __u::pluck($students, 'ID');
            $student_ids = join($student_ids, ',');

            $quizIDs_query= $wpdb->prepare("SELECT collection_id FROM {$wpdb->prefix}quiz_response_summary WHERE 
                        DATE(taken_on) LIKE %s AND student_id in ($student_ids)",
                        date('Y-m-d')
                );

            $quizIDs = $wpdb->get_col($quizIDs_query);

            // output the column headings
            $output= str_putcsv($headers);

            if($quizIDs && sizeof($quizIDs)>0){

                foreach($quizIDs as $quizID){

                    if($students && sizeof($students)>0){

                        foreach($students as $student){

                            $row = get_quiz_report_data($quizID, $student);

                            if($row)
                                $output .= str_putcsv($row);
                            
                        }
                    }
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

function get_quiz_report_data($quizID, $student){

    $quizData = get_single_quiz_module($quizID, $student->ID);
    $roll_number = get_user_meta($student->ID, 'student_rollno', true);
    $summary = get_latest_quiz_response_summary($quizID, $student->ID);

    if($quizData->quiz_type == 'practice')
        $quiz_type = 'Practice Quiz';
    else
        $quiz_type = 'Class Test';

    if($summary){

        $row = array($student->display_name,
            $roll_number,
            $quizData->name,
            $quiz_type,
            $quizData->marks,
            $summary->marks_scored,
            $summary->negative_scored,
            $summary->total_marks_scored,
            $quizData->duration,
            $summary->total_time_taken
        );
    }

    else 
        return false;

    return $row;

}