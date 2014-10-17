<?php

function getvars_taught_in_class_student_mail($recipients_email,$comm_data){

	$template_data['name'] 		= 'taught-in-class-student-mail'; 
	$template_data['subject'] 	= 'Taught In Class - Student';

	$template_data['from_email'] = 'no-reply@synapselearning.net';
	$template_data['from_name'] = 'Synapse';
    
	$template_data['global_merge_vars'] = get_taught_in_class_template_data($comm_data);

	$template_data['merge_vars'] = array();

	foreach($recipients_email as $user_value){

	        $overwrite_vars = array();

	        $user = get_userdata($user_value->user_id );
	        $student_name = $user->display_name;

	        $overwrite_vars[] = array(
	            'name' => 'STUDENT_NAME',
	            'content' => $student_name
	        );

	        $template_data['merge_vars'][] = array(

	            'rcpt'=>$user_value->value,
	            'vars' => $overwrite_vars
	        ) ;
    }

	return $template_data;

}

function getvars_taught_in_class_parent_mail($recipients_email,$comm_data){
    
	$template_data['name'] 		= 'taught-in-class-parent-mail';
	$template_data['subject'] 	= 'Taught In Class - Parent';
    
	$template_data['from_email'] = 'no-reply@synapselearning.net';
	$template_data['from_name'] = 'Synapse Learning';

	$template_data['global_merge_vars'] = get_taught_in_class_template_data($comm_data);
	$template_data['merge_vars'] = array();

	foreach($recipients_email as $user_value){

	        $overwrite_vars = array();
	        
	        $user = get_userdata($user_value->user_id );

	        $child = get_user_meta($user_value->user_id, 'parent_of', true);

	        if($child){
	        	$studentdata 	= get_userdata($child);
	        	$student_name 	= $studentdata->display_name;
	        }

	        $parent_name = $user->display_name;

	        $overwrite_vars[] = array(
	            'name' => 'PARENT_NAME',
	            'content' => $parent_name
	        );
	        $overwrite_vars[] = array(
	            'name' => 'STUDENT_NAME',
	            'content' => $student_name
	        );

	        $template_data['merge_vars'][] = array(

	            'rcpt'=>$user_value->value,
	            'vars' => $overwrite_vars
	        ) ;
    }

	return $template_data;

}


function get_taught_in_class_template_data($comm_data){
	
	global $aj_comm;

	$data = array();

	$module_id   = $aj_comm->get_communication_meta($comm_data['id'],'module_id');
	$division   = $aj_comm->get_communication_meta($comm_data['id'],'division');

	$module_details= get_single_content_module($module_id);

    $module_data['module_name'] = $module_details->name;

    $module_end_date = get_module_end_date($module_id, $comm_data['blog_id']);

    $terms= $module_details->term_ids;

    $textbook_id = $terms['textbook'];

    $chapter_id = $terms['chapter'];

    $textbook_name = get_term_field('name', $textbook_id, 'textbook');

    if($chapter_id)
    	$chapter_name = get_term_field('name', $chapter_id, 'textbook');
   	else
   		$chapter_name = ' -- ';

    $taken_by = get_module_taken_by($module_id, $comm_data['blog_id']);

    $subject = get_textbook_subject($textbook_id);

    $division_data = fetch_single_division($division);
    $division  = $division_data['division'];

	$data[] = array('name' => 'MODULE',			'content' => $module_details->name);
	$data[] = array('name' => 'DIVISION',		'content' => $division);
	$data[] = array('name' => 'SUBJECT',		'content' => $subject);
	$data[] = array('name' => 'TEXTBOOK',		'content' => $textbook_name);
	$data[] = array('name' => 'CHAPTER',		'content' => $chapter_name);
	$data[] = array('name' => 'DATE_COMPLETED',	'content' => $module_end_date);
	$data[] = array('name' => 'TAKEN_BY',		'content' => $taken_by);

	return $data;

}