<?php


add_action( 'wp_ajax_get-user-data', 'get_user_data' );

function get_user_data() {
        if(is_user_logged_in()){
            $user_data=get_userdata(get_current_user_id());
            echo(wp_send_json(array('data'=>$user_data, 'success'=>true)));
        }
        else
            echo(wp_send_json(array("error"=>"User not logged in.")));
	die;
}

add_action( 'wp_ajax_logout_user', 'logout_current_user' );

function logout_current_user() {
        wp_logout();
        echo(wp_send_json(array("success"=>"User logged out.")));
	die;
}