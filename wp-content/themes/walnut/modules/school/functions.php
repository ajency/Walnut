<?php

function admin_scripts_styles($hook) {
    if(($hook=='site-new.php') || $hook=='site-settings.php'){
        wp_enqueue_script('theme-js', get_template_directory_uri() .
            '/modules/school/js/additional_fields.js', array(), false, true);
        wp_enqueue_script('jquery-ui-datepicker');
        wp_enqueue_style('jquery-style', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/jquery-ui.css');

    }
}

add_action('admin_enqueue_scripts', 'admin_scripts_styles', 100);

function new_school_setup( $blog_id ){
    global $wpdb;   
    $blog_details=  maybe_serialize($_POST['blog_additional']);
    update_blog_option($blog_id, 'blog_meta',$blog_details);
    update_blog_option($blog_id, 'template','schoolsite');
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
        $postid = wp_insert_post($post);
                            
    }
    update_post_meta($postid, '_wp_page_template', 'dashboard.php');
    
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
add_action('wpmu_new_blog', 'new_school_setup');




/*
  gcb_extend_blog_settings_fields
 * Function to add the university dropdown in the settings of the chapter.
 * @param int $blog_id
 */
function edit_additional_school_fields($blog_id)
{
    require_once 'additional_school_fields.php';     
        wp_enqueue_script('theme-js', get_template_directory_uri() .
            '/modules/school/js/wp_global.js', array(), false, true);
    
}
add_action( 'wpmueditblogaction', 'edit_additional_school_fields' );

/*
  agc_update_blog_settings_fields
 * Function to update the school for a chapter.
 */
function update_additional_school_fields($blog_id)
{
    //$blog_id = get_current_blog_id();
    if(isset($_POST['blog_additional'])){
        //print_r($_POST['blog_additional']);
        $blog_details=  maybe_serialize($_POST['blog_additional']);
       // echo $blog_details; exit;
        update_blog_option($blog_id, 'blog_meta',$blog_details);
    }
}

add_action( 'wpmu_update_blog_options','update_additional_school_fields');