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

function ajax_read_user() {

    $user_data = get_user_by_id( $_GET['ID'] );

    wp_send_json( $user_data );

}

add_action( 'wp_ajax_read-user', 'ajax_read_user' );

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

function ajax_auth_sync_user(){

    //Check for empty username or password
	$password = $_POST['passwd'];
	$blog_id = $_POST['blog_id'];
	
	$blog_details = get_blog_details($blog_id);
	
	$username = $blog_details->blogname.'syncuser';
    if(empty($username) || empty($password)){
        return false;
    } else {
        //Login using username and password 
        $auth = wp_authenticate($username, $password );

       // Check for any error 
        if( is_wp_error($auth) ) { 
            wp_logout();
            wp_clear_auth_cookie();     
            $response = array('status'=>false);
        } else {
            //get the user id
            $user_id = $auth->data->ID;

            //Set expiration time
            $expiration = time() + apply_filters( 'auth_cookie_expiration', 14 * DAY_IN_SECONDS, $user_id, strtotime( '+14 days' ) );

            //Needed for the login grace period in wp_validate_auth_cookie().
            $expire = $expiration + ( 12 * HOUR_IN_SECONDS );


            if ( '' === $secure ) {
                $secure = is_ssl();
            }

            // Frontend cookie is secure when the auth cookie is secure and the site's home URL is forced HTTPS.
            $secure_logged_in_cookie = $secure && 'https' === parse_url( get_option( 'home' ), PHP_URL_SCHEME );

            //Filter whether the connection is secure.
            $secure = apply_filters( 'secure_auth_cookie', $secure, $user_id );

            //Filter whether to use a secure cookie when logged-in.
            $secure_logged_in_cookie = apply_filters( 'secure_logged_in_cookie', $secure_logged_in_cookie, $user_id, $secure );

            if ( $secure ) {
                $auth_cookie_name = SECURE_AUTH_COOKIE;
                $scheme = 'secure_auth';
            } else {
                $auth_cookie_name = AUTH_COOKIE;
                $scheme = 'auth';
            }

            //Generate token
            $manager = WP_Session_Tokens::get_instance( $user_id );
            $token = $manager->create( $expiration );

            //Generate logged-in and auth cookie
            $auth_cookie = wp_generate_auth_cookie( $user_id, $expiration, $scheme, $token );
            $logged_in_cookie = wp_generate_auth_cookie( $user_id, $expiration, 'logged_in', $token );

            //Fires immediately before the authentication cookie is set.
            do_action( 'set_auth_cookie', $auth_cookie, $expire, $expiration, $user_id, $scheme );

            //Fires immediately before the secure authentication cookie is set.
            do_action( 'set_logged_in_cookie', $logged_in_cookie, $expire, $expiration, $user_id, 'logged_in' );

            setcookie($auth_cookie_name, $auth_cookie, $expire, PLUGINS_COOKIE_PATH, COOKIE_DOMAIN, $secure, true);
            setcookie($auth_cookie_name, $auth_cookie, $expire, ADMIN_COOKIE_PATH, COOKIE_DOMAIN, $secure, true);
            setcookie(LOGGED_IN_COOKIE, $logged_in_cookie, $expire, COOKIEPATH, COOKIE_DOMAIN, $secure_logged_in_cookie, false);
            if ( COOKIEPATH != SITECOOKIEPATH )
                setcookie(LOGGED_IN_COOKIE, $logged_in_cookie, $expire, SITECOOKIEPATH, COOKIE_DOMAIN, $secure_logged_in_cookie, false);

            
            /*$response = array('status'=> 'true',
                'logged_in' => $logged_in_cookie,
                'authentication' =>  $auth_cookie
                );*/


            $response = array('status'=> true,'user_id' => $user_id,'logged_in_cookie_key'=>LOGGED_IN_COOKIE,'logged_in_cookie_value'=>$logged_in_cookie,'auth_cookie_key'=>$auth_cookie_name,'auth_cookie_value'=>$auth_cookie);

        }

        $response = json_encode( $response );

        header( "Content-Type: application/json" );

        echo $response;

        exit;

    }   
}
add_action( 'wp_ajax_nopriv_auth-sync-user', 'ajax_auth_sync_user' );
add_action( 'wp_ajax_auth-sync-user', 'ajax_auth_sync_user' );

function reset_user_password(){

    $email = $_REQUEST['email'];

    if(!$email)
        return false;

    $user = get_user_by('email', $email);

    if(!$user)
        return false;

    $comm = add_user_reset_password_mail($user);

    if( is_wp_error( $comm ) ) {

        $error= $comm->get_error_message();

        $response=array('error'=>$error);
    }
    else
        $response=array(
            'communication_id'=>$comm,
            'status'=>'OK'
            ); 

    wp_send_json($response);

}
add_action('wp_ajax_nopriv_reset-user-password', 'reset_user_password');