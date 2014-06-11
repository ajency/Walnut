<?php

function setup_childsite( $blog_id, $additional_details ) {

    //save the additional details of blog from setup. eg. licence validity
    $blog_details = maybe_serialize( $additional_details );
    update_blog_option( $blog_id, 'blog_meta', $blog_details );

    //setup the template and stylesheet for child sites
    update_blog_option( $blog_id, 'template', 'walnut' );
    update_blog_option( $blog_id, 'stylesheet', 'schoolsite' );

    $current_blog = get_current_blog_id();
    switch_to_blog( $blog_id );

    setup_childsite_roles();

    setup_childsite_custom_pages();

    setup_childsite_tables();

    setup_childsite_menus( $current_blog, $blog_id );

    create_temporary_folders();

    switch_to_blog( $current_blog );

}

function setup_childsite_roles() {

    global $wp_roles;
    if (get_role( 'subscriber' ) != NULL) remove_role( 'subscriber' ); //removes the subscriber role
    if (get_role( 'contributor' ) != NULL) remove_role( 'contributor' ); //removes the contributor role
    if (get_role( 'author' ) != NULL) remove_role( 'author' ); //removes the author role
    if (get_role( 'editor' ) != NULL) remove_role( 'editor' ); //removes the editor role

    if (get_role( 'school-admin' ) == NULL) {
        $role_clone = 'administrator';
        $role_cloned = $wp_roles->get_role( $role_clone );
        $role = 'school-admin';
        $role_name = 'School Admin';
        $wp_roles->add_role( $role, $role_name, $role_cloned->capabilities );
    }
    add_role( 'student', 'Student' );
    add_role( 'teacher', 'Teacher' );
    add_role( 'parent', 'Parent' );


}

function setup_childsite_custom_pages() {

    if (!get_page_by_title( 'Dashboard' )) {
        $post = array();
        $post['post_type'] = 'page'; //could be 'page' for example
        $post['post_author'] = get_current_user_id();
        $post['post_status'] = 'publish'; //draft
        $post['post_title'] = 'Dashboard';
        $dashboard_id = wp_insert_post( $post );

    }
    update_post_meta( $dashboard_id, '_wp_page_template', 'dashboard.php' );

    update_option( 'page_on_front', $dashboard_id );
    update_option( 'show_on_front', 'page' );

}

function setup_childsite_tables() {
    global $wpdb;

    $class_divisions_table = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}class_divisions
            (`id` varchar(255),
             `division` varchar(255) NOT NULL, 
             `class_id` INT NOT NULL, 
             PRIMARY KEY (`id`))";

    $wpdb->query( $class_divisions_table );

    $question_response_table = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}question_response` (
              `ref_id` varchar(255) NOT NULL,
              `teacher_id` int(11) NOT NULL,
              `content_piece_id` int(11) NOT NULL,
              `collection_id` int(11) NOT NULL,
              `division` int(11) NOT NULL,
              `question_response` varchar(255) NOT NULL,
              `time_taken` varchar(255) NOT NULL DEFAULT '0',
              `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              `end_date` datetime NOT NULL,
              `status` varchar(50) NOT NULL
            )";

    $wpdb->query( $question_response_table );

    $sync_apps_data_query = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}sync_apps_data` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `file_path` varchar(455) NOT NULL,
              `blog_id` int(11) NOT NULL,
              `meta` TEXT NOT NULL,
              `status` VARCHAR(30) NOT NULL
            )";

    $wpdb->query( $sync_apps_data_query );
}

function setup_childsite_menus( $current_blog, $blog_id ) {

    switch_to_blog( $current_blog );

    $parent_menus = wp_get_nav_menus();

    foreach ($parent_menus as $p_menu) {

        switch_to_blog( $current_blog );
        $parent_menu_items = wp_get_nav_menu_items( $p_menu->term_id );

        switch_to_blog( $blog_id );
        $new_menu = wp_create_nav_menu( $p_menu->name );

        foreach ($parent_menu_items as $p_item) {
            $p_item->post_status = 'publish';
            $post_id = wp_insert_post( $p_item );
            $menu_data = array(
                'menu-item-db-id' => $post_id,
                'menu-item-object-id' => $p_item->object_id,
                'menu-item-object' => $p_item->object,
                'menu-item-parent-id' => $p_item->menu_item_parent,
                'menu-item-type' => $p_item->type,
                'menu-item-title' => $p_item->title,
                'menu-item-url' => $p_item->url,
                'menu-item-status' => 'publish'
            );
            wp_update_nav_menu_item( $new_menu, 0, $menu_data );
        }
    }
}

function create_temporary_folders() {

    $uploads_dir = wp_upload_dir();
    // TODO: change file permission form 0777 to something else. This is read write execute access
    if (!file_exists( $uploads_dir['basedir'] . '/tmp/' ))
        mkdir( $uploads_dir['basedir'] . '/tmp', 0777 );

    if (!file_exists( $uploads_dir['basedir'] . '/tmp/downsync' ))
        mkdir( $uploads_dir['basedir'] . '/tmp/downsync', 0777 );

    if (!file_exists( $uploads_dir['basedir'] . '/tmp/upsync' ))
        mkdir( $uploads_dir['basedir'] . '/tmp/upsync', 0777 );

}

function school_delete_site( $blog_id, $drop ) {

    // clear all extra tables here
    switch_to_blog( $blog_id );
    global $wpdb;

    $drop_tables = array( $wpdb->prefix . "question_response",
        $wpdb->prefix . "class_divisions",
        $wpdb->prefix . "sync_apps_data" );

    foreach ((array)$drop_tables as $table) {
        $wpdb->query( "DROP TABLE IF EXISTS `$table`" );
    }
    restore_current_blog();
}

add_action( 'delete_blog', 'school_delete_site', 100, 2 );