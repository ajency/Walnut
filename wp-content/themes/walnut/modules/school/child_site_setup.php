<?php

function setup_childsite( $blog_id, $additional_details ) {

    //save the additional details of blog from setup. eg. licence validity
    $blog_details = maybe_serialize( $additional_details );
    update_blog_option( $blog_id, 'blog_meta', $blog_details );

    //setup the template and stylesheet for child sites
    update_blog_option( $blog_id, 'template', 'walnut' );
    update_blog_option( $blog_id, 'stylesheet', 'schoolsite' );

    switch_to_blog( $blog_id );

    setup_childsite_roles();

    setup_childsite_custom_pages();

    setup_childsite_tables();

    setup_childsite_menus($blog_id );

    create_temporary_folders();

    restore_current_blog();

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
            (`id` int(11) NOT NULL primary key AUTO_INCREMENT,
             `division` varchar(255) NOT NULL, 
             `class_id` INT NOT NULL)";

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

    $question_response_meta_table = "CREATE TABLE `{$wpdb->prefix}question_response_meta` (
                `qr_ref_id` varchar(30) NOT NULL,
              `meta_key` varchar(255) NOT NULL,
              `meta_value` text NOT NULL
            )";

    $wpdb->query( $question_response_meta_table );

    $quiz_summary_table = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}quiz_response_summary` (
        `summary_id` varchar(30) NOT NULL,
        `collection_id` int(11) NOT NULL,
        `student_id` bigint(20) NOT NULL,
        `taken_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `quiz_meta` text NOT NULL,
        PRIMARY KEY (`summary_id`)
      )";

    $wpdb->query( $quiz_summary_table );

    $quiz_responses_table = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}quiz_question_response` (
        `qr_id` varchar(50) NOT NULL,
        `summary_id` varchar(30) NOT NULL,
        `content_piece_id` bigint(20) NOT NULL,
        `question_response` text NOT NULL,
        `time_taken` int(11) NOT NULL,
        `marks_scored` decimal(10,1) NOT NULL DEFAULT '0.0',
        `status` varchar(30) NOT NULL,
        PRIMARY KEY (`qr_id`)
      )";

    $wpdb->query( $quiz_responses_table );

    $sync_apps_data_query = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}sync_apps_data` (
              `id` int(11) NOT NULL primary key AUTO_INCREMENT,
              `file_path` varchar(455) NOT NULL,
              `blog_id` int(11) NOT NULL,
              `meta` TEXT NOT NULL,
              `status` VARCHAR(30) NOT NULL
            )";

    $wpdb->query( $sync_apps_data_query );
}

function create_temporary_folders() {

    $uploads_dir = wp_upload_dir();

    if (!file_exists( $uploads_dir['basedir'] . '/tmp/' ))
        mkdir( $uploads_dir['basedir'] . '/tmp', 0755 );

    if (!file_exists( $uploads_dir['basedir'] . '/tmp/downsync' ))
        mkdir( $uploads_dir['basedir'] . '/tmp/downsync', 0755 );

    if (!file_exists( $uploads_dir['basedir'] . '/tmp/upsync' ))
        mkdir( $uploads_dir['basedir'] . '/tmp/upsync', 0755 );

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