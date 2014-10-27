<?php

function getvars_quizzes_taken_report($recipients_email,$comm_data){

	$template_data['name'] 		= 'quizzes-taken-report'; 

	$template_data['subject'] 	= 'Synapse Notification: Quiz report for today';

	$template_data['from_email'] = 'no-reply@synapselearning.net';
	$template_data['from_name'] = 'Synapse';
    
    $blog_data= get_blog_details($comm_data['blog_id'], true);

	$template_data['global_merge_vars'] = array();

	$template_data['global_merge_vars'][]=array(
		'name' 		=> 'BLOG_URL',
		'content' 	=> '<a href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
	);

	$template_data['global_merge_vars'][] = get_mail_header($comm_data['blog_id']);
	$template_data['global_merge_vars'][] = get_mail_footer($comm_data['blog_id']);

	$template_data['attachments'][]= array(
		"type" 		=> "text/plain",
        "name" 		=> "myfile.txt",
        "content" 	=> "ZXhhbXBsZSBmaWxl"
    );

	$zipfile= get_quiz_report_zip($comm_data['blog_id']);
	
	$template_data['attachments'][]= array(
		"type" 		=> "application/zip",
        "name" 		=> "csv.zip",
        "content" 	=> base64_encode($zipfile)
    );

	return $template_data;

}

if(!function_exists('str_putcsv'))
{
    function str_putcsv($input, $delimiter = ',', $enclosure = '"')
    {
        // Open a memory "file" for read/write...
        $fp = fopen('php://temp', 'r+');
        // ... write the $input array to the "file" using fputcsv()...
        fputcsv($fp, $input, $delimiter, $enclosure);
        // ... rewind the "file" so we can read what we just wrote...
        rewind($fp);
        // ... read the entire line into a variable...
        $data = fread($fp, 1048576);
        // ... close the "file"...
        fclose($fp);
        // ... and return the $data to the caller, with the trailing newline from fgets() removed.
        return $data;
    }
}

function get_quiz_report_zip($blog_id){

	$files= get_quiz_report_csv($blog_id);
	
	$uploads_dir=wp_upload_dir();

    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);

    $random= rand(9999,99999);

    $upload_path= '/tmp/quiz-report-csvs-'.$random.date('Ymdhis').'.zip';

	create_zip($files,$upload_directory.$upload_path);

	#echo $upload_url.$upload_path; exit;

	return $upload_url.$upload_path;

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
			    	'name' 	=> $div['division'],
			    	'data' 	=> $output
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

function getvars_quiz_completed_student_mail($recipients_email,$comm_data){

	global $aj_comm;

	$template_data['name'] 		= 'quiz-completed-student-mail'; 

    $blog_data= get_blog_details($comm_data['blog_id'], true);

	$template_data['subject'] 	= $blog_data->blogname.': You have successfully completed a Quiz!';

	$template_data['from_email'] = 'no-reply@synapselearning.net';
	$template_data['from_name'] = 'Synapse';
    
	$quiz_id   		= $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

	$quiz_data 		= get_quiz_template_data($comm_data,$quiz_id);

	switch_to_blog($comm_data['blog_id']);
	$summary_data 	= get_quiz_summary_data($quiz_id,$comm_data['user_id']);
	restore_current_blog();


	$template_data['global_merge_vars'] = array_merge($quiz_data,$summary_data);

	$template_data['global_merge_vars'][]=array(
		'name' 		=> 'BLOG_URL',
		'content' 	=> '<a href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
	);

	return $template_data;

}

function getvars_quiz_completed_parent_mail($recipients,$comm_data){

	global $aj_comm;

	$template_data['name'] 		= 'quiz-completed-parent-mail'; 

    $blog_data= get_blog_details($comm_data['blog_id'], true);

	$template_data['subject'] 	= $blog_data->blogname.':  Quiz report for student ';

	$template_data['from_email'] = 'no-reply@synapselearning.net';
	$template_data['from_name'] = 'Synapse';
    
    $quiz_id   = $aj_comm->get_communication_meta($comm_data['id'],'quiz_id');

	$template_data['global_merge_vars'] = get_quiz_template_data($comm_data,$quiz_id);

	$template_data['global_merge_vars'][]=array(
		'name' 		=> 'BLOG_URL',
		'content' 	=> '<a href="'.$blog_data->siteurl.'">'.$blog_data->blogname.'</a>'
	);

	switch_to_blog($comm_data['blog_id']);
	
	$template_data['merge_vars'] = array();

	foreach($recipients as $user){

        $student_id = get_user_meta($user->user_id, 'parent_of', true);

		$student 	= get_userdata($student_id);

		$overwrite_vars = array();

		$overwrite_vars = get_quiz_summary_data($quiz_id,$student_id);

        $overwrite_vars[] = array(
            'name' => 'STUDENT_NAME',
            'content' => $student->display_name
        );

        $template_data['merge_vars'][] = array(

            'rcpt'=>$user->value,
            'vars' => $overwrite_vars
        ) ;			
    }

	restore_current_blog();

	return $template_data;

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
	
	$quiz_details= get_single_quiz_module($quiz_id); 

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


	$data[] = array('name' => 'QUIZ_NAME',		'content' => $quiz_details->name);
	$data[] = array('name' => 'QUIZ_TYPE',		'content' => $quiz_type);
	$data[] = array('name' => 'CLASS',			'content' => $division);
	$data[] = array('name' => 'SUBJECT',		'content' => $subject);
	$data[] = array('name' => 'TEXTBOOK',		'content' => $textbook_name);
 	$data[] = array('name' => 'CHAPTER',		'content' => $chapter_name);
	$data[] = array('name' => 'QUIZ_MARKS',		'content' => $quiz_details->marks);
	
	$data[] = get_mail_header($comm_data['blog_id']);
	$data[] = get_mail_footer($comm_data['blog_id']);

	return $data;

}

function get_quiz_summary_data($quiz_id, $student_id){

	$data = array();

	$summary= get_latest_quiz_response_summary($quiz_id,$student_id); 

	if($summary->negative_scored){
		$data[] = array('name' => 'NEG_MARKS',	'content' => $summary->negative_scored);
		$data[] = array('name' => 'SCORED',		'content' => $summary->marks_scored);		
	}

	$quiz_status= get_quiz_status($quiz_id,$student_id);

	$data[] = array('name' => 'TOTAL_SCORED',	'content' => $summary->total_marks_scored);	
	$data[] = array('name' => 'DATE',			'content' => date('d M Y', strtotime($summary->taken_on)));
	$data[] = array('name' => 'ATTEMPTS',		'content' => $quiz_status['attempts']);

	return $data;

}