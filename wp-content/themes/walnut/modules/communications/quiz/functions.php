<?php

function cron_quizzes_taken_report(){

    global $aj_comm;

    $comm_data = array(
        'component'             => 'quiz',
        'communication_type'    => 'quizzes_taken_report'
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