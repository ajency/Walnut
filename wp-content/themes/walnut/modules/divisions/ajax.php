<?php

require_once 'functions.php';

function fetch_divisions() {
    
    global $wpdb;
    
    $user_id= get_current_user_id();
    
    $class_ids= "";
    
    $classes_data = get_user_meta($user_id, 'classes');
    
    $classes= maybe_unserialize($classes_data);
    
    if($classes)
        $class_ids = implode(',',$classes[0]);
    
    $divisions_qry="select * from {$wpdb->prefix}class_divisions where class_id in (".$class_ids.")";
        
    $divisions = $wpdb->get_results($divisions_qry);

    wp_send_json(array('status'=>'OK', 'data'=>$divisions));
}

add_action('wp_ajax_get-divisions', 'fetch_divisions');