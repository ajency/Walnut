<?php

function getvars_taught_in_class_student_mail($recipients_email,$comm_data){

	global $aj_comm;

	$template_data['name'] 		= 'taught-in-class-parent-mail';

	$blog_data= get_blog_details($comm_data['blog_id']);

	$template_data['subject'] 	= $blog_data->blogname.': Training module completed';

	$template_data['from_email'] = 'no-reply@walnutedu.org';
	$template_data['from_name'] = 'Synapse';

    $module_id   = $aj_comm->get_communication_meta($comm_data['id'],'module_id');
	$division   = $aj_comm->get_communication_meta($comm_data['id'],'division');

	$template_data['global_merge_vars'] = get_taught_in_class_template_data($comm_data,$module_id,$division);

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

    global $aj_comm;

	$template_data['name'] 		= 'taught-in-class-parent-mail';

	$blog_data= get_blog_details($comm_data['blog_id']);

	$template_data['subject'] 	= $blog_data->blogname.': Training module completed';

	$template_data['from_email'] = 'no-reply@walnutedu.org';
	$template_data['from_name'] = 'Synapse Learning';

	$module_id   = $aj_comm->get_communication_meta($comm_data['id'],'module_id');
	$division   = $aj_comm->get_communication_meta($comm_data['id'],'division');

	$template_data['global_merge_vars'] = get_taught_in_class_template_data($comm_data, $module_id, $division);

	$template_data['merge_vars'] = array();

	foreach($recipients_email as $user_value){

	        $overwrite_vars = array();

	        $user = get_userdata($user_value->user_id );

	        $child = get_user_meta($user_value->user_id, 'parent_of', true);

                $child = get_parent_of_formated($child);

                $student_name = '';
	        if(!empty($child)){
                    foreach($child as $child_val){
	        	$studentdata 	= get_userdata($child_val);
                        $division = $aj_comm->get_communication_meta($comm_data['id'],'division');
                        $student_division = get_user_meta($studentdata->ID,'student_division', true);

                        if($division != $student_division)
                            continue;

                        if($student_name != ''){
                            $student_name .= ',';
                        }
	        	$student_name 	.= $studentdata->display_name;
                    }
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


function get_taught_in_class_template_data($comm_data, $module_id, $division){

    $data = array();

    switch_to_blog($comm_data['blog_id']);


    $school_admin = get_school_admin_for_cronjob($comm_data['blog_id']);

    $module_details= get_single_content_module($module_id,$division,$school_admin);

    $module_end_date = get_module_end_date($module_id, $comm_data['blog_id']);

    $terms= $module_details->term_ids;

    $textbook_id = $terms['textbook'];

    $chapter_id = $terms['chapter'];

    switch_to_blog(1);
    $textbook_name = get_term_field('name', $textbook_id, 'textbook');

    if($chapter_id)
    	$chapter_name = get_term_field('name', $chapter_id, 'textbook');
   	else
   		$chapter_name = ' -- ';
   	restore_current_blog();


    $division_data = fetch_single_division($division,$comm_data['blog_id']);
    $division  = $division_data['division'];

    switch_to_blog($comm_data['blog_id']);
    $taken_by = get_module_taken_by($module_id, $division_data['id']);
    restore_current_blog();

	$data[] = array('name' => 'MODULE',			'content' => $module_details->name);
	$data[] = array('name' => 'DIVISION',		'content' => $division);
	$data[] = array('name' => 'TEXTBOOK',		'content' => $textbook_name);
	$data[] = array('name' => 'CHAPTER',		'content' => $chapter_name);
	$data[] = array('name' => 'DATE_COMPLETED',	'content' => $module_end_date);
	$data[] = array('name' => 'TAKEN_BY',		'content' => $taken_by);

	$data[] = get_mail_header($comm_data['blog_id']);
	$data[] = get_mail_footer($comm_data['blog_id']);

	return $data;

}

function getvars_teaching_modules_report($recipients_email,$comm_data){

	global $aj_comm;

	$template_data['name'] 		= 'training-modules-report';

	$template_data['subject'] 	= 'Synapse Notification: Training module report for today';

	$template_data['from_email'] = 'no-reply@walnutedu.org';
	$template_data['from_name'] = 'Synapse';

    $blog_data= get_blog_details($comm_data['blog_id'], true);

	$template_data['global_merge_vars'] = array();

	$template_data['global_merge_vars'][]=array(
		'name' 		=> 'BLOG_URL',
		'content' 	=> '<a href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
	);

	$template_data['global_merge_vars'][]=array(
		'name'		=> 'TRAINING_MODULES_TABLE',
		'content' 	=> get_training_modules_report_data($comm_data['blog_id'])
	);
	restore_current_blog();

	$zipfile   		= $aj_comm->get_communication_meta($comm_data['id'],'filepath');

	if(file_exists($zipfile)){

		$template_data['attachments'][]= array(
			"type" 		=> "application/zip",
	        "name" 		=> "training-modules-report.zip",
	        "content" 	=> base64_encode(file_get_contents($zipfile))
	    );

	    unlink($zipfile);
	}

	$template_data['global_merge_vars'][] = get_mail_header($comm_data['blog_id']);
	$template_data['global_merge_vars'][] = get_mail_footer($comm_data['blog_id']);

	return $template_data;

}

function get_training_modules_report_data($blog_id){

    global $wpdb;

    switch_to_blog($blog_id);

    $tbody = '';

    $style= " style='border:1px solid #000; color:#000; padding: 5px; font-size:14px'";

    $today = date('Y-m-d');

    $query = $wpdb->prepare("SELECT collection_id, division FROM {$wpdb->prefix}question_response
                WHERE DATE(start_date) LIKE %s OR DATE(end_date) LIKE %s",
                $today,$today
            );

    $modules = $wpdb->get_results($query, ARRAY_A);

    if($modules){
        $modules_for_div = __u::groupBy($modules, 'division');

        foreach($modules_for_div as $div=>$mod){

            $division = fetch_single_division($div,$blog_id);
            $division_label = $division['division'];

            $completed = $pending = 0;
            $ids = array();
            $ids = __u::pluck($mod,'collection_id');
            $ids = __u::uniq($ids,'collection_id');

            foreach($ids as $id){

                switch_to_blog($blog_id);

                $status = get_content_module_status($id, $div);
                if($status['status'] === 'completed')
                    $completed++;

            }

            $taken = sizeof($ids);

            $tbody .= "<tr>
                        <td $style>$division_label</td>
                        <td $style>$taken</td>
                        <td $style>$completed</td>
                    </tr>";

        }
    }

    if (!$tbody)
        $tbody = "<tr>
                <td colspan=3 $style>No Modules were taught today</td>
            </tr>";

    $data= "<table>
                <thead>
                    <tr>
                        <td $style>Class</td>
                        <td $style>Training modules taken</td>
                        <td $style>Training modules completed</td>
                    </tr>
                </thead>
                <tbody>$tbody
                </tbody>
            </table>";

    return $data;

}
