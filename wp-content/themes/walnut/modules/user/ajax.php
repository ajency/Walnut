<?php

require_once 'functions.php';

function get_user_data() {
    if (is_user_logged_in()) {
        $user_data = get_userdata( get_current_user_id() );
        wp_send_json( array( 'data' => $user_data, 'success' => true ) );
    } else
        wp_send_json( array( "error" => "User not logged in." ) );
}

add_action( 'wp_ajax_get-user-data', 'get_user_data' );

function logout_current_user() {
    wp_logout();
    wp_send_json( array( "success" => "User logged out." ) );
}

add_action( 'wp_ajax_logout_user', 'logout_current_user' );

function authenticate_web_login() {

    $login_details = authenticate_login( $_POST['data'] );

    if (!isset($login_details['error']))
        wp_set_auth_cookie( $login_details['login_details']->ID );

    wp_send_json( $login_details );

}

add_action( 'wp_ajax_nopriv_get-user-profile', 'authenticate_web_login' );

add_action( 'wp_ajax_nopriv_get-user-app-profile', 'authenticate_web_login' );
add_action( 'wp_ajax_get-user-app-profile', 'authenticate_web_login' );

//test functions to check timeout and cookie invalidation for devices
function my_deletecookie() {

    if(!wp_validate_auth_cookie())
        wp_clear_auth_cookie();
}
add_action( 'init', 'my_deletecookie' );
add_action( 'admin_init', 'my_deletecookie' );

add_filter( 'auth_cookie_expiration', 'timeout_time' );

function timeout_time ( $expirein ) {

    return 5-HOUR_IN_SECONDS; 

}
//end temporary functions for cookie management check

function ajax_fetch_users() {

    $user_data = get_user_list( $_GET );

    wp_send_json( $user_data );

}

add_action( 'wp_ajax_get-users', 'ajax_fetch_users' );