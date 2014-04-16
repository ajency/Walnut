<?php

require_once 'functions.php';

function fetch_divisions() {
    
    global $wpdb;
    global $classids;
    
    $user_id= get_current_user_id();
    
    $class_ids= "";
    
    $classes_data = get_user_meta($user_id, 'classes');
    
    $classes= maybe_unserialize($classes_data);
    
    if($classes)
        $class_ids = implode(',',$classes[0]);
    
    $divisions_qry="select * from {$wpdb->prefix}class_divisions where class_id in (".$class_ids.")";

        
    $divisions = $wpdb->get_results($divisions_qry);
    
    foreach($divisions as $key=>$div){
        $data[$key]=$div;
        $data[$key]->class_label= $classids[$div->class_id]['label'];
    }
    
    wp_send_json(array('status'=>'OK', 'data'=>$data));
}

add_action('wp_ajax_get-divisions', 'fetch_divisions');

function fetch_single_division() {
    
    global $wpdb;
    global $classids;
    
    $divisions_qry="select * from {$wpdb->prefix}class_divisions where id=".$_GET['id'];
        
    $division_data = $wpdb->get_results($divisions_qry);
    
    foreach($division_data as $division){
        $data['id']         = $division->id;
        $data['division']   = $division->division;
        $data['class_id']   = $division->class_id;
        $data['class_label']= $classids[$division->class_id]['label'];
    }
    
    wp_send_json($data);
}

add_action('wp_ajax_read-division', 'fetch_single_division');