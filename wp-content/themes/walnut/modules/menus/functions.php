<?php

function get_site_menu($user_role) {
    
    //check if user_id is passed instead of user_role
    if(is_int($user_role)){
        $user = new WP_User( $user_role );
        $user_role= $user->roles[0];
    }
    
    if($user_role=='' || $user_role==null){
        wp_send_json( array('error'=>'user role not defined or incorrect user id') );
        die;
    }
    
    $menu_name = $user_role.'-menu';
    $wp_menu = get_menu_to_array( $menu_name );
    
    if($wp_menu['code']=='ERROR')
        $wp_menu= array('error'=>'menu does not exist');
        
    return $wp_menu;
    
}


/**
 * Retuns the menu data
 *
 * @param unknown $menu_id The menu Id
 */
function get_menu_to_array( $mn , $by = 'name') {
   
    $menu = get_term_by( $by, $mn, 'nav_menu' );

    if ( $menu === false )
        return array( 'code' => 'ERROR', 'message' => 'Invalid menu id' );

    $m = wp_get_nav_menu_items( $menu->term_id );

    $sorted_menu_items =  array();

    //create all top level menu
    foreach ( (array) $m as $menu_item ) {

        $mn = array(
            'ID'                => $menu_item->ID,
            'menu-order'        => $menu_item->menu_order,
            'post_title'        => $menu_item->title,
            'menu_item_link'    => $menu_item->url,
            'menu_id'           => $menu->term_id
        );

        if ( (int)$menu_item->menu_item_parent === 0 ) {

            $sorted_menu_items[] = $mn;
        }

    }

    //add submenus
    foreach ( (array) $m as $menu_item ) {

        $mn = array(
            'ID'                => $menu_item->ID,
            'order'             => $menu_item->menu_order,
            'post_title'        => $menu_item->title,
            'menu_item_link'    => $menu_item->url,
            'menu_id'           => (int)$menu->term_id
        );

        if ( (int)$menu_item->menu_item_parent !== 0 ) {
            $sorted_menu_items[]['subMenu'][] = $mn;
        }

    }
    $wp_menu = array(
        'id'            => (int)$menu->term_id,
        'menu_name'     => $menu->name,
        'menu_slug'     => $menu->slug,
        'menu_description'   => $menu->description,
        'menu_items'    => $sorted_menu_items
    );

    return $wp_menu['menu_items'];
}