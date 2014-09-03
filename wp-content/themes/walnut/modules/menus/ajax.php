<?php
require_once 'functions.php';
add_action( 'wp_ajax_get-menus', 'get_menus' );

function get_menus() {
    global $user_ID;
    
    // GET USER ROLE
    $user = new WP_User( $user_ID );
    $user_role= $user->roles[0];
    
    //FETCH MENU
    $menu=get_site_menu($user_role);
    wp_send_json($menu);
}

function get_menus_response() {
    global $user_ID;
    
    // GET USER ROLE
    $user = new WP_User( $user_ID );
    $user_role= $user->roles[0];
    
    //FETCH MENU
    $menu=get_site_menu($user_role);
    return $menu;
}

function get_submenu_struct($sub_menuarray){
    $submenustruct = '<ul class="sub-menu" style="display: none;">';
    foreach ($sub_menuarray as $submenu){
      $submenustruct .='<li class=""><a href="'.$submenu['menu_item_link'].'">'.$submenu['post_title'].'</a></li>';  
    }
    $submenustruct .='</ul>';
    return $submenustruct;
}

