<?php

function setup_childsite($blog_id){
    global $wpdb;   
    $blog_details=  maybe_serialize($_POST['blog_additional']);
    update_blog_option($blog_id, 'blog_meta',$blog_details);
    update_blog_option($blog_id, 'template','walnut');
    update_blog_option($blog_id, 'stylesheet','schoolsite');
    
    $current_blog= get_current_blog_id();
    switch_to_blog($blog_id);
    
    global $wp_roles;
    if(get_role('subscriber')!=NULL)remove_role( 'subscriber' );//removes the subscriber role
    if(get_role('contributor')!=NULL)remove_role( 'contributor' );//removes the contributor role
    if(get_role('author')!=NULL)remove_role( 'author' );//removes the author role
    if(get_role('editor')!=NULL)remove_role( 'editor' );//removes the editor role

       if(get_role('school-admin')==NULL)
         {
            $role_clone='administrator';
            $role_cloned = $wp_roles->get_role($role_clone);
            $role='school-admin';
            $role_name='School Admin';
            $wp_roles->add_role($role, $role_name, $role_cloned->capabilities);
         }
    add_role( 'student','Student');
    add_role( 'parent','Parent');
    
    
    if (!get_page_by_title('Dashboard')) {
        $post = array();
        $post['post_type'] = 'page'; //could be 'page' for example
        $post['post_author'] = get_current_user_id();
        $post['post_status'] = 'publish'; //draft
        $post['post_title'] = 'Dashboard';
        $dashboard_id = wp_insert_post($post);
                           
    }
    update_post_meta($dashboard_id, '_wp_page_template', 'dashboard.php');
   
    update_option( 'page_on_front', $dashboard_id );
    update_option( 'show_on_front', 'page' );
    
    $class_divisions_table= "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}class_divisions 
             (`id` INT NOT NULL AUTO_INCREMENT, `divisions` INT NOT NULL, 
             `class_id` INT NOT NULL, PRIMARY KEY (`id`))";

    $wpdb->query($class_divisions_table);
    
    switch_to_blog($current_blog);
    
    
    $parent_menus = wp_get_nav_menus();

    foreach($parent_menus as $p_menu){
        
        switch_to_blog($current_blog);
        $parent_menu_items = wp_get_nav_menu_items($p_menu->term_id);

        switch_to_blog($blog_id);
        $new_menu = wp_create_nav_menu($p_menu->name);
        
        foreach($parent_menu_items as $p_item){
           $p_item->post_status='publish';
           $post_id= wp_insert_post($p_item);
           $menu_data=array(
                'menu-item-db-id' => $post_id,
                'menu-item-object-id' => $p_item->object_id,
                'menu-item-object' => $p_item->object,
                'menu-item-parent-id' => $p_item->menu_item_parent,
                'menu-item-type' => $p_item->type,
                'menu-item-title' => $p_item->title,
                'menu-item-url' => $p_item->url,
                'menu-item-status' => 'publish'

           );
           wp_update_nav_menu_item( $new_menu,0, $menu_data);
        }
    }
    
    switch_to_blog($current_blog);
    
}