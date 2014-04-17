<?php

require_once 'functions.php';

function fetch_divisions() {
    
    $user_id= get_current_user_id();
    
    $data=  get_all_divisions($user_id);
    
    wp_send_json(array('status'=>'OK', 'data'=>$data));
}

add_action('wp_ajax_get-divisions', 'fetch_divisions');

function fetch_single_division() {
    
    $data= get_single_division($_GET['id']);
    
    wp_send_json($data);
}

add_action('wp_ajax_read-division', 'fetch_single_division');