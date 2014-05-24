<?php

require_once 'functions.php';
require_once "csv_export_tables.php";

function get_user_data() {
    if(is_user_logged_in()){
        $user_data=get_userdata(get_current_user_id());
        wp_send_json(array('data'=>$user_data, 'success'=>true));
    }
    else
        wp_send_json(array("error"=>"User not logged in."));
}
add_action( 'wp_ajax_get-user-data', 'get_user_data' );

function logout_current_user() {
    wp_logout();
    wp_send_json(array("success"=>"User logged out."));
}
add_action( 'wp_ajax_logout_user', 'logout_current_user' );

function authenticate_web_login() {

    $login_details = authenticate_login($_POST['data']);
    if(!isset($login_details['error']))
        wp_set_auth_cookie( $login_details['login_details']->ID );

    wp_send_json($login_details);

}
add_action( 'wp_ajax_nopriv_get-user-profile', 'authenticate_app_login' );

function authenticate_app_login() {

    $login_details = authenticate_login($_POST['data']);

    if(!isset($login_details['error'])){

        $blog_id= $login_details['blog_details']['blog_id'];

        $login_details['exported_csv_url'] = export_tables_for_app($blog_id);

    }

    wp_send_json($login_details);

}
add_action( 'wp_ajax_nopriv_get-user-app-profile', 'authenticate_app_login' );

function ajax_fetch_users(){

    $user_data=get_user_list($_GET);

    wp_send_json($user_data);

}
add_action( 'wp_ajax_get-users', 'ajax_fetch_users' );