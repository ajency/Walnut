<?php

require_once 'functions.php';
require_once 'wpadmin-custom-menus.php';

function fetch_divisions() {


    if(isset($_REQUEST['user_id']))
        $user_id= $_REQUEST['user_id'];
    else
        $user_id= get_current_user_id();
    
    $data=  get_all_divisions($user_id);
    
    wp_send_json(array('status'=>'OK', 'data'=>$data));
}

add_action('wp_ajax_get-divisions', 'fetch_divisions');

function ajax_fetch_single_division() {
    
    $data= fetch_single_division($_GET['id']);
    
    wp_send_json($data);
}

add_action('wp_ajax_read-division', 'ajax_fetch_single_division');


function fetch_schools() {

	global $wpdb;
	$current_user = wp_get_current_user();	
	$query       = $wpdb->prepare(
			     "SELECT * FROM wp_blogs ");
 
	$data      = $wpdb->get_results($query);	
 
    
    wp_send_json(array('status'=>'OK', 'data'=>$data));
}

add_action('wp_ajax_get-schools', 'fetch_schools');