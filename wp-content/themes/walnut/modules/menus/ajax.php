<?php

add_action( 'wp_ajax_get-menus', 'get_menus' );

function get_menus() {
    global $user_ID;
    // GET USER ROLE
    $user = new WP_User( $user_ID );
    $user_role= $user->roles[0];
    $menu=get_site_menu($user_role);
    
    echo(json_encode($menu['menu_items']));
    die;
}

