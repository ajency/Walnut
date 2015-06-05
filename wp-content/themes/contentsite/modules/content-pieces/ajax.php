<?php

require_once 'functions.php';
require_once 'content_pieces_import.php';

function ajax_save_content_element() {
    
    unset($_POST['action']);
    $element_details = $_POST;
    $meta_id = save_content_element($element_details);
    wp_send_json(array('meta_id'=>$meta_id));
}
add_action('wp_ajax_update-element', 'ajax_save_content_element');
add_action('wp_ajax_create-element', 'ajax_save_content_element');

function delete_content_element(){

    global $wpdb;

    $meta_id=$_POST['meta_id'];

    $result=delete_metadata_by_mid('post',$meta_id);

    wp_send_json(array('status'=>$result));

}

add_action('wp_ajax_delete-element', 'delete_content_element');


function ajax_save_content_piece() {

    unset($_POST['action']);

    $post_data =$_POST;

    $content_id = save_content_piece($post_data);

    wp_send_json(array('ID'=>$content_id));

}
add_action('wp_ajax_save-content-piece-json', 'ajax_save_content_piece');
add_action('wp_ajax_create-content-piece', 'ajax_save_content_piece');

function ajax_update_content_piece(){
    
    #currently this is used only to update the status.
    #for the actual create/update functions refer to function ajax_save_content_piece()
    
    $data= array('ID'=>$_POST['ID'],'post_status'=>$_POST['post_status']);
    $content_id = wp_update_post($data);
    
    wp_send_json(array('ID'=>$content_id));
    
}
add_action('wp_ajax_update-content-piece', 'ajax_update_content_piece');
