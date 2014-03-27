<?php
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