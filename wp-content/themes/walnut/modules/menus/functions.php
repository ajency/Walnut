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

    $index=0;
    
    foreach ( (array) $m as $menu_item ) {
        
        //FETCH TOP LEVEL MENU ITEMS
        if ( (int)$menu_item->menu_item_parent === 0 ){ 
            
            $mn= compose_menu_item($menu_item);
            
            $sorted_menu_items[$index] = $mn;
            
            //FETCH SUBMENUS FOR CURRENT TOP LEVEL MENU
            foreach($m as $submenu_item){
                
                if($submenu_item->menu_item_parent==$menu_item->ID){
                    $smn= compose_menu_item($submenu_item);
                    $sorted_menu_items[$index]['submenu'][] = $smn;
                }
            }
            $index++;
        }
        
    }

    return $sorted_menu_items;
}

//make a presentable menu item as per the what the frontend website view needs.

function compose_menu_item($menu_item){
    
    $menu_url = $menu_item->url;
    if(strpos($menu_url, '#') === 0)
        $menu_url = get_site_url() .'/'.$menu_item->url;

    $mn = array(
        'ID'                => $menu_item->ID,
        'menu-order'        => $menu_item->menu_order,
        'post_title'        => $menu_item->title,
        'menu_item_link'    => $menu_url,
        'menu_id'           => $menu->term_id
    );
    
    return $mn;
    
}