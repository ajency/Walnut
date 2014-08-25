<?php

require_once 'functions.php';

function ajax_create_content_element() {
    global $wpdb;
    unset($_POST['action']);
    $element_details=  maybe_serialize($_POST);

    $insert_element_qry= $wpdb->prepare("insert into {$wpdb->prefix}postmeta values ('',%d,'content_element',%s)", array(0,$element_details));
    $wpdb->query($insert_element_qry);

    $meta_id= $wpdb->insert_id;

    wp_send_json(array('meta_id'=>$meta_id));
}
add_action('wp_ajax_create-element', 'ajax_create_content_element');

function ajax_update_content_element() {
    global $wpdb;
    unset($_POST['action']);

    $element_details=  maybe_serialize($_POST);

    $meta_id = $_POST['meta_id'];
    $update_element_qry= $wpdb->prepare("update {$wpdb->prefix}postmeta set meta_value = %s where meta_id = %d", array($element_details,$meta_id));

    $wpdb->query($update_element_qry);

    wp_send_json(array('meta_id'=>$meta_id));
}
add_action('wp_ajax_update-element', 'ajax_update_content_element');

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