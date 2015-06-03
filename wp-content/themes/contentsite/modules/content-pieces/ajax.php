<?php

require_once 'functions.php';
require_once 'content_pieces_import.php';

function ajax_save_content_element() {
    global $wpdb;
    unset($_POST['action']);
    
    $element_details = $_POST;
    #make sure all post values are without slashes before serializing
    foreach($element_details as $key=>$value)
        $element_details[$key]= wp_unslash($value);

    $meta_id = $_POST['meta_id'];
    
    if($meta_id)
        update_metadata_by_mid('post', $meta_id, $element_details, 'content_element');

    else{
        $element_details=  maybe_serialize($element_details);
        $query= $wpdb->prepare("insert into {$wpdb->prefix}postmeta values ('',%d,'content_element',%s)", array(0,$element_details));
        $wpdb->query($query);
        $meta_id= $wpdb->insert_id;
    }
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