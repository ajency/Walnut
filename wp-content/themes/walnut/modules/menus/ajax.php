<?php
require_once 'functions.php';
add_action( 'wp_ajax_get-menus', 'get_menus' );

function get_menus() {
    global $user_ID;
    
    // GET USER ROLE
    $user = new WP_User( $user_ID );
    $user_role= '';
    foreach($user->roles as $role){
        $user_role = $role;
    }
    //FETCH MENU
    $menu=get_site_menu($user_role);
    wp_send_json($menu);
}

function get_menus_response() {
    global $user_ID;
    
    // GET USER ROLE
    $user = new WP_User( $user_ID );
    $user_role= '';
    foreach($user->roles as $role){
        $user_role = $role;
    }
    //FETCH MENU
    $menu=get_site_menu($user_role);
    return $menu;
}

