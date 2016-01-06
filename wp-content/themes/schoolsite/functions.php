<?php
require_once('functions-student.php');
require_once('functions-student-change-password.php');

function fetch_all_divisions(){
	global $wpdb;
	$current_user = wp_get_current_user();	
	$result       = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}class_divisions");
	return $result;
}

function my_profile() {
	// reset a users password
	if(isset($_POST['student_action']) && $_POST['student_action'] == 'update-my-profile') {
		$_POST['primary_blog'] =14;
		$_POST['source_domain']='universal.synapselearning.net';

		$current_user = wp_get_current_user();
		$meta = get_user_meta($current_user->ID);
		foreach ($_POST as $meta_key => $meta_value) {
			if(isset($meta[$meta_key])){
				update_user_meta( $current_user->ID, $meta_key, $meta_value);
			}else{
				add_user_meta( $current_user->ID, $meta_key, $meta_value);
			}
		}	
		wp_redirect( site_url()."/dashboard-student", $status );
		exit;
	}	
}		
add_action('init', 'my_profile');
?>