<?php
require_once 'functions.php';
require_once 'wpadmin-custom-menus.php';

add_action( 'wp_ajax_read-schools', 'fetch_school' );

function fetch_school(){

    $current_blog= get_current_blog_id();
    if(current_blog==1){

    }
    else {

    }
    $school_logo=get_site_url().'/themes/walnut/images/walnutlearn.png';
    echo(wp_send_json(array('school_logo'=>$school_logo)));

}

function new_school_setup( $blog_id ){

    require_once 'child_site_setup.php';

    //additional details of blog from setup. eg. licence validity
    $additional_details = $_POST['blog_additional'];

    setup_childsite($blog_id, $additional_details);

}
add_action('wpmu_new_blog', 'new_school_setup');

function delete_blog_custom_tables(){

    global $wpdb;

    $wpdb->query("DROP TABLE {$wpdb->prefix}class_divisions");
    $wpdb->query("DROP TABLE {$wpdb->prefix}question_response");
    $wpdb->query("DROP TABLE {$wpdb->prefix}question_response_meta");
    $wpdb->query("DROP TABLE {$wpdb->prefix}quiz_question_response");
    $wpdb->query("DROP TABLE {$wpdb->prefix}quiz_response_summary");
    $wpdb->query("DROP TABLE {$wpdb->prefix}quiz_schedules");
    $wpdb->query("DROP TABLE {$wpdb->prefix}sync_apps_data");

}

add_action('delete_blog', 'delete_blog_custom_tables');