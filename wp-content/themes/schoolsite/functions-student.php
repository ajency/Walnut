<?php
function fetch_single_student_trainig_module($lecture_id) {
    $content_module= get_single_content_module($lecture_id);

    if(!is_wp_error($content_module))
        return (array('code' => 'OK', 'data' => $content_module));
    else
        return (array('code' => 'ERROR', 'error_msg' =>$content_module->get_error_message()));
}

function student_fetch_name(){
	global $wpdb;
	$current_user = wp_get_current_user();	
	$result       = $wpdb->get_results("select meta_value from wp_usermeta
	   	       						   WHERE user_id = '". $current_user->ID ."' 
	   	       						   and meta_key = 'first_name'");
	$fn = $result[0]->meta_value;

	$result       = $wpdb->get_results("select meta_value from wp_usermeta
	   	       						   WHERE user_id = '". $current_user->ID ."' 
	   	       						   and meta_key = 'last_name'");
	$ln = $result[0]->meta_value;	

	return $fn.' '.$ln;
}





function student_fetch_textbooks() { 
    $args=$_GET;
    $defaults['parent']= 0;
    if(isset($_GET['parent']))
      $defaults['fetch_all']= true;
    $args = wp_parse_args($args, $defaults);
    $textbooks=get_textbooks($args);
    return $textbooks;
}

function student_fetch_quizzes_by_textbook_id($texbook_id) {
	global $wpdb;
	$current_user = wp_get_current_user();	
	$query       = $wpdb->prepare(
			     "SELECT collection.id, collection.name as quiz_name, collection.term_ids, collection.duration, meta.meta_value as quiz_type 
			      FROM wp_content_collection collection
			      INNER JOIN wp_collection_meta meta on collection.id = meta.collection_id and meta.meta_key=%s
			      WHERE term_ids like %s and type=%s and post_status=%s
			      ORDER BY collection.last_modified_on desc",
			      array('quiz_type','%"'.$texbook_id.'";%', 'quiz', 'publish'));

	$result      = $wpdb->get_results($query);	


 
	$data        = array();
	foreach ($result as $key => $row) {
		$query2       = $wpdb->prepare(
				     "SELECT count(summary_id) AS attempts
				      FROM {$wpdb->prefix}quiz_response_summary
				      WHERE collection_id = %d and student_id=%d
				      ORDER BY taken_on DESC LIMIT 1",
				      array($row->id, $current_user->ID));

		$result2      = $wpdb->get_row($query2);
		//if($row->id == '747'){get-all-quiz-question-responses
		//	file_put_contents("a4.txt", $query2);
		//}
 	 
		$summary_result = $wpdb->prepare(
				     "SELECT * 
				      FROM {$wpdb->prefix}quiz_response_summary
				      WHERE collection_id = %d and student_id=%d
				      ORDER BY taken_on DESC LIMIT 1",
				      array($row->id, $current_user->ID));

		$attempts_result2      = $wpdb->get_row($summary_result);

		#$attempts = $attempts_result2->summary_id;

		$attempts = $result2->attempts;

		$total_marks_scored = "NA";
		$taken_on           = "NA";
		$status    = 1;
		if($attempts>0){
			$taken_on           =   date("d M Y", strtotime($attempts_result2->taken_on));
			$qt = maybe_unserialize($attempts_result2->quiz_meta);

		$sql_question = $wpdb->prepare(
									"SELECT meta_value
									FROM wp_collection_meta
									WHERE meta_key = 'quiz_meta' AND collection_id = ".$row->id
									);
		$quiz_meta      = $wpdb->get_row($sql_question);
		$quiz_data = maybe_unserialize($quiz_meta->meta_value);
			
				
			if($qt['marks_scored']){
					
					$total_marks_scored = (float) $qt['marks_scored']. ' / '.$quiz_data['marks'];
			}
			else{

				$quiz_summary       = compute_quiz_summaries_for_user($attempts_result2->summary_id, $qt);
				if($quiz_summary->marks_scored == '' )
					$quiz_summary->marks_scored = 0;
				$total_marks_scored = (float) $quiz_summary->marks_scored. ' / '.$quiz_data['marks'];
			}
			 			
			switch($qt['status']){
				case 'started' : $status = 0; 
				break;
				case 'completed' : $status = 2; 
				break;						
			}	
		}
		$terms      = maybe_unserialize($row->term_ids);
		$chapter_id = $terms['chapter'];
		$quiz_type = 0;

		switch($row->quiz_type){
			case 'practice' : $quiz_type = 0; 
			break;
			case 'test' : $quiz_type = 1; 
			break;
			case 'class_test' : $quiz_type = 2; 
			break;						
		}



		$args       = array('status'=>$status ,'quiz_type'=>$quiz_type ,'taken_on'=>$taken_on, 'total_marks_scored' => $total_marks_scored, 'attempts' => $attempts, 'quiz_id'=> $row->id, 'quiz_name'=>$row->quiz_name, 'duration' => $row->duration, 'chapter_id'=>$chapter_id); 
		array_push($data, $args);
	}
	#file_put_contents("a1.txt", print_r($data, true));
	return $data;
} 

function student_fetch_lectures_by_textbook_id($texbook_id) {
	global $wpdb;
	$query       = $wpdb->prepare(
			     "SELECT id, name as lecture_name, term_ids, duration 
			      FROM wp_content_collection
			      WHERE term_ids like %s and type=%s and post_status=%s",
			      array('%"'.$texbook_id.'";%', 'student-training', 'publish'));
	$result      = $wpdb->get_results($query);	
	$data        = array();
	foreach ($result as $key => $row) {
		$terms      = maybe_unserialize($row->term_ids);
		$chapter_id = $terms['chapter'];
		$args       = array('lecture_id'=> $row->id,'lecture_name'=>$row->lecture_name, 'duration' => $row->duration, 'chapter_id'=>$chapter_id); 
		array_push($data, $args);
	}
	return $data;
} 

function student_fetch_single_quiz ($quiz_id)
{
    $quiz_module = get_single_quiz_module ($quiz_id);
    if(!is_wp_error($quiz_module))
        return (array('code' => 'OK', 'data' => $quiz_module));
    else
        return (array('code' => 'ERROR', 'error_msg' =>$quiz_module->get_error_message()));
}







function pr($arr){
	echo "<pre>";
		print_r($arr);
	echo "</pre>";
}
function student_fetch_chapters($term_id){
    $defaults['parent']= $term_id;
    $defaults['fetch_all']= true;
    $args = wp_parse_args($args, $defaults);
    $chapters=get_textbooks($args);	
    return $chapters;
}

add_action('wp_logout','student_go_login');
function student_go_login(){
	$actual_link = "http://$_SERVER[HTTP_HOST]";
	#return ($actual_link."/#login");
	wp_redirect($actual_link."/#login");
	exit();
}

function student_fetch_division(){
	global $wpdb;
	$current_user = wp_get_current_user();	
	$query        = "SELECT division FROM {$wpdb->prefix}class_divisions divisions 
			         INNER JOIN wp_usermeta usermeta on divisions.id = usermeta.meta_value 
			         AND meta_key='student_division' and usermeta.user_id='". $current_user->ID ."'";	
	$result       = $wpdb->get_results($query);	
	$division     = $result[0]->division;
	return $division;
}

function student_my_upcoming_quizes($texbook_ids){
	global $wpdb;
	$current_user = wp_get_current_user();
	$term_ids = [];
	foreach ($texbook_ids as $key => $value) {
		$term_ids[] = "collection.term_ids like '%\"$value\";%'";
	}
	$term_ids = " and (".implode("OR ", $term_ids).") ";
	//$today = date("Y-m-d 00:00:00");
	$today = date("Y-m-d H:i:s");
	   $query = "SELECT collection.name as quiz_name,quiz_id, term_ids, schedule_from, meta.meta_value,summary.taken_on FROM wp_content_collection collection  
		LEFT OUTER JOIN {$wpdb->prefix}quiz_response_summary summary on collection.id = summary.collection_id  and student_id='".$current_user->ID."'
		INNER JOIN wp_collection_meta meta on collection.id = meta.collection_id and meta_key='content_layout'
		INNER JOIN {$wpdb->prefix}quiz_schedules schedules on collection.id = schedules.quiz_id 
		WHERE collection.type='quiz' and post_status='publish' ".$term_ids."
		and (schedule_from >= '".$today."' OR schedule_to >= '".$today."')
		GROUP BY collection.id ORDER BY schedules.schedule_from DESC";	

		$result = $wpdb->get_results($query);
		$data = [];
		foreach ($result as $key => $value) {
			if(isset($value->taken_on)){
				continue;
			}
			 $quiz_id  = $value->quiz_id;
			 $terms    = maybe_unserialize($value->term_ids);
			 $day      = date("d", strtotime($value->schedule_from));
			 $month    = date("M", strtotime($value->schedule_from));
			 $year     = date("Y", strtotime($value->schedule_from));
			 $data[]   = array('quiz_name'=>$value->quiz_name,'quiz_id'=>$quiz_id, 'textbook_id'=>$terms['textbook'], 'duration' =>'10AM - 11AM', 'day'=>$day, month=>$month, 'year' =>$year);
		}
		return $data;
}

function student_last_quiz_taken_on($book_id){
	global $wpdb;
	$current_user = wp_get_current_user($book_id);

	$query = $wpdb->prepare(
		"SELECT taken_on FROM {$wpdb->prefix}quiz_response_summary  summary INNER JOIN wp_content_collection collection on summary.collection_id = collection.id
		 WHERE student_id = %d  and term_ids like %s ORDER BY taken_on desc limit 1", 
		
		array($current_user->ID, '%"'.$book_id.'";%')
	);	
	$result = $wpdb->get_results($query);
	
	if(empty($result)){
		return false;
	}else{
		$taken_on_date_time = $result[0]->taken_on;
		$dt =   date("d M Y", strtotime($taken_on_date_time));
		$tm =   date("h:i A", strtotime($taken_on_date_time));
		return(array('date'=>$dt, 'time'=>$tm));		
	}
}
//-------------------END OF DASHBOARD FUNCTIONS

//-------------------START OF LECTURE LISTVIEW


function student_get_lectures(){

}











?>