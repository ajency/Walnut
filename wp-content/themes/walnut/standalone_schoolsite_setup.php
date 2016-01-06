<?php
/*
 * File name : standalone_schoolsite_setup.php
 * ONLY FOR STANDALONE SCHOOL INSTALLATION ON LOCAL SCHOOL SERVER # NOT FOR NETWORK SITES
 * 1. creates custom tables:
 *      textbook_relationships
 *      class_divisions
 *      content_collection
 *      collection_meta
 *      comm_module
 *      comm_module_meta
 *      question_response
 *      question_response_meta
 *
 * 2. Removes roles that are not required: administrator, subscriber, contributor, editor, author
 * 3. Adds new roles: school-admin, student, teacher, parent
 * 4. Create page Dashboard. Make it as Front Page
 * 5. Assign custom template and stylesheet to site
 *
 */

//require_once( '../../../wp-load.php');
//require_once('../../../wp-admin/includes/plugin.php');

/**
 *
 */


run_standalone_school_setup();

function run_standalone_school_setup(){
    create_custom_tables();
    add_new_roles_main_site();

    //setup the template and stylesheet for child sites
    update_option( 'template', 'walnut' );
    update_option( 'stylesheet', 'schoolsite' );
    update_option( 'permalink_structure', '/%postname%/' );

    add_pages_to_main_site();

    activate_school_data_sync_plugin('school-data-sync/school_data_sync.php');
    
    activate_plugins(array(
        'custom-taxonomy-order-ne/customtaxorder.php',
        'wp-crontrol/wp-crontrol.php'));
    
    #schedule the communication cron
    wp_schedule_event( current_time( 'timestamp' ), 'hourly', 'ajcm_process_communication_queue');
    
    //wp_redirect(site_url().'/wp-admin/options-general.php?page=school_data_sync');
}

function create_custom_tables(){
    global $wpdb;

    $textbook_class_relations_table= "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}textbook_relationships
             (`id` INT NOT NULL AUTO_INCREMENT, `textbook_id` INT NOT NULL, 
             `class_id` varchar(255) NOT NULL,
             `tags` varchar(255) NOT NULL, 
             PRIMARY KEY (`id`))";

    $wpdb->query($textbook_class_relations_table);

    $class_divisions_table= "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}class_divisions
             (`id` INT NOT NULL AUTO_INCREMENT, 
             `division` varchar(255) NOT NULL,
             `class_id` INT NOT NULL, 
             PRIMARY KEY (`id`))";

    $wpdb->query($class_divisions_table);

    $content_collection_table = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}content_collection` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(255) NOT NULL,
            `created_on` datetime NOT NULL,
            `created_by` int(11) NOT NULL,
            `last_modified_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `last_modified_by` int(11) NOT NULL,
            `published_on` datetime NOT NULL,
            `published_by` int(11) NOT NULL,
            `post_status` varchar(255) NOT NULL,
            `type` varchar(255) NOT NULL,
            `term_ids` varchar(255) NOT NULL,
            `duration` int(11) NOT NULL COMMENT 'in minutes',
            PRIMARY KEY (`id`)
          )";

    $wpdb->query($content_collection_table);

    $collection_meta = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}collection_meta` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `collection_id` int(11) NOT NULL,
            `meta_key` varchar(255) NOT NULL,
            `meta_value` text NOT NULL,
            PRIMARY KEY (`id`)
          )";

    $wpdb->query($collection_meta);

    $communication_module_table = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}comm_module` (
              `id` int(200) NOT NULL AUTO_INCREMENT,
              `message_type` varchar(200) NOT NULL,
              `recipients` varchar(200) NOT NULL,
              `blog` int(11) NOT NULL,
              `mode` varchar(50) NOT NULL COMMENT 'sms or email',
              `status` varchar(200) NOT NULL DEFAULT 'pending',
              `priority` varchar(200) NOT NULL,
              `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`)
            )";

    $wpdb->query($communication_module_table);

    $communication_module_meta_table = "
        CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}comm_module_meta` (
          `id` int(100) NOT NULL AUTO_INCREMENT,
          `comm_module_id` int(100) NOT NULL,
          `meta_key` varchar(200) NOT NULL,
          `meta_value` varchar(200) NOT NULL,
          PRIMARY KEY (`id`)
        )";

    $wpdb->query($communication_module_meta_table);


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
              `status` varchar(50) NOT NULL,
              `sync` int(1)
            )";

    $wpdb->query( $question_response_table );

    $question_response_meta_table = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}question_response_meta` (
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
        `sync` int(1),
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
        `sync` int(1),
        PRIMARY KEY (`qr_id`)
      )";

    $wpdb->query( $quiz_responses_table );

    $quiz_schedules_table = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}quiz_schedules` (
      `quiz_id` int(11) NOT NULL,
      `division_id` int(11) NOT NULL,
      `schedule_from` date NOT NULL,
      `schedule_to` date NOT NULL,              
      `sync` int(1)
    )";

  $wpdb->query( $quiz_schedules_table );


}

/**
 *
 * add_new_roles
 * Function to add custom roles.
 */
function add_new_roles_main_site()
{
    global $wp_roles;
    $role_cloned_teacher = $wp_roles->get_role('author');
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
   // add_role( 'teacher','Teacher');
    $wp_roles->add_role('teacher', 'Teacher', $role_cloned_teacher->capabilities);
;
    
    $role = get_role( 'teacher' );
    $role->add_cap( 'manage_options' ); 

}

function add_pages_to_main_site()
{
    if (!get_page_by_title('Dashboard')) {
        $post = array();
        $post['post_type'] = 'page'; //could be 'page' for example
        $post['post_author'] = get_current_user_id();
        $post['post_status'] = 'publish'; //draft
        $post['post_title'] = 'Dashboard';
        $postid = wp_insert_post($post);

        update_post_meta($postid, '_wp_page_template', 'dashboard.php');

        update_option( 'page_on_front', $postid );
        update_option( 'show_on_front', 'page' );
    }
    
    if (!get_page_by_title('Sync Site Content')) {
        $post = array();
        $post['post_type'] = 'page'; //could be 'page' for example
        $post['post_author'] = get_current_user_id();
        $post['post_status'] = 'publish'; //draft
        $post['post_title'] = 'Sync Site Content';
        $postid = wp_insert_post($post);

        update_post_meta($postid, '_wp_page_template', 'site-sync.php');

    }    

}

function activate_school_data_sync_plugin($plugin){

    $current = get_option( 'active_plugins' );
    $plugin = plugin_basename( trim( $plugin ) );

    if ( !in_array( $plugin, $current ) ) {
        $current[] = $plugin;
        sort( $current );
        do_action( 'activate_plugin', trim( $plugin ) );
        update_option( 'active_plugins', $current );
        do_action( 'activate_' . trim( $plugin ) );
        do_action( 'activated_plugin', trim( $plugin) );
    }

    set_sds_plugin_options();
}
