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

function ajax_fetch_users() {

    $user_data = get_user_list( $_GET );

    wp_send_json( $user_data );

}

add_action( 'wp_ajax_get-users', 'ajax_fetch_users' );

function redirect_user_to_primary_blog(){
    
    if ( ! is_admin()){
        
        global $user_ID;
    
        $blog=get_primary_blog_details($user_ID);

        if($user_ID && get_site_url() !== $blog['site_url']){
            wp_safe_redirect($blog['site_url']);
            exit;
        }
        
    }

}

add_action('init', 'redirect_user_to_primary_blog');