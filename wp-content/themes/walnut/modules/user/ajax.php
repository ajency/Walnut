<?php

require_once 'functions.php';
add_action( 'wp_ajax_get-user-data', 'get_user_data' );

function get_user_data() {
        if(is_user_logged_in()){
            $user_data=get_userdata(get_current_user_id());
            wp_send_json(array('data'=>$user_data, 'success'=>true));
        }
        else
           wp_send_json(array("error"=>"User not logged in."));
}

add_action( 'wp_ajax_logout_user', 'logout_current_user' );

function logout_current_user() {
        wp_logout();
        wp_send_json(array("success"=>"User logged out."));
}



add_action( 'wp_ajax_nopriv_get-user-profile', 'authenticate_web_login' );

function authenticate_web_login() {
	$login_data=$_POST['data'];
	$login_check=wp_authenticate($login_data['txtusername'],$login_data['txtpassword']);
	if(is_wp_error($login_check))
		wp_send_json(array("error"=>"Invalid Username or Password"));
	else{
		wp_set_auth_cookie( $login_check->ID );
		wp_send_json($login_check);
	}
}

add_action( 'wp_ajax_nopriv_get-user-profile', 'authenticate_app_login' );

function authenticate_app_login() {
	$login_data=$_POST['data'];
	$login_check=wp_authenticate($login_data['txtusername'],$login_data['txtpassword']);
	if(is_wp_error($login_check))
		wp_send_json(array("error"=>"Invalid Username or Password"));
	else
            wp_send_json($login_check);
	
}