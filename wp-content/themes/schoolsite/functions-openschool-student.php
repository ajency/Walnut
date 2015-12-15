<?php
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


function student_redirect(){
	$current_user = wp_get_current_user();	
	$meta = get_user_meta($current_user->ID);
	if(isset($meta['thechamp_provider']) && $current_user->ID!=0 && !isset($meta['student_division']) && !strpos($_SERVER['REQUEST_URI'],'register-redirect-student')){
	   
		/*print_r($_SERVER);
	
		exit;*/
	   wp_redirect(site_url().'/register-redirect-student');
	    exit;
	}/*else if($current_user->ID == 0  && (!strpos($_SERVER['REDIRECT_URL'],'social-login-student' || !strpos($_SERVER['REDIRECT_URL'],'social-login-student'))){
	    wp_redirect(site_url().'/social-login-student');
	    exit;
	}*/
}
//add_action('init', 'student_redirect');
?>