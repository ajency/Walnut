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