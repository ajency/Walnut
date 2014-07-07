<?php
require_once 'functions.php';

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