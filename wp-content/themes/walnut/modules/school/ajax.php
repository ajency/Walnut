<?php
require_once 'functions.php';
require_once "csv_export_tables.php";

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
    setup_childsite($blog_id);
    
}
add_action('wpmu_new_blog', 'new_school_setup');

function ajax_sync_database(){

    $blog_id= $_GET['blog_id'];

    $last_sync= (isset($_GET['last_sync']))? $_GET['last_sync']: '';

    $export_details= export_tables_for_app($blog_id, $last_sync);

    wp_send_json($export_details);

}
add_action( 'wp_ajax_sync-database', 'ajax_sync_database' );