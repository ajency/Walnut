<?php

require_once 'functions.php';

function ajax_create_content_module() {

    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'term_ids' => $_POST['term_ids'],
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours'],
        'type' => $_POST['type'],
//        save status
        'post_status' => $_POST['post_status']
    );

    $id = save_content_module($data);

    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $id)));
}

add_action('wp_ajax_create-content-group', 'ajax_create_content_module');

function ajax_update_content_module() {

    global $wpdb;

    if (isset($_POST['changed']) && $_POST['changed']=='module_details') {
        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'term_ids' => $_POST['term_ids'],
            'duration' => $_POST['duration'],
            'minshours' => $_POST['minshours'],
            'type' => $_POST['type'],
            //        save status
            'post_status'    => $_POST['post_status']
        );
        $content_module = save_content_module($data);
    }

    if (isset($_POST['changed']) && ($_POST['changed']=='content_pieces')) {
        $data = array(
            'id' => $_POST['id'],
            'content_pieces' => $_POST['content_pieces']
        );
        $update_module_content_pieces=update_module_content_pieces($data);
    }
    wp_send_json(array('code' => 'OK', 'data' => array('id'=> (int) $_POST['id'])));
}

add_action('wp_ajax_update-content-group', 'ajax_update_content_module');

function ajax_update_content_module_status(){
   
    $ids = $_POST['IDs'];
    
    if(!isset($_POST['IDs']) || empty($_POST['IDs']) || !isset($_POST['status']))
        return new WP_Error('invalid_request_data', __('Invalid ID or status') );
    
    global $wpdb;
    global $user_ID;
    
    $data = array(
        'post_status'       => $_POST['status'],
        'last_modified_on'  => date('y-m-d H:i:s'),
        'last_modified_by'  => $user_ID
    );
    
    foreach ($ids as $id){
        if(!$id) continue;
        $updated= $wpdb->update($wpdb->base_prefix . 'content_collection', $data, array('id' => $id)); 
    }
    
    return wp_send_json(array('code' => 'OK'));
}
add_action('wp_ajax_update-content-module-status', 'ajax_update_content_module_status');