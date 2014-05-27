<?php

require_once 'functions.php';

function ajax_get_content_pieces() {

    $args = $_GET;

    $defaults = array(
        'post_type' => 'content-piece'
    );

    $args = wp_parse_args($args, $defaults);

    $content_pieces = get_content_pieces($args);

    wp_send_json($content_pieces);
}

add_action('wp_ajax_get-content-pieces', 'ajax_get_content_pieces');

function ajax_get_single_content_piece() {
    
    $id=$_GET['ID'];
    $content_pieces = get_single_content_piece($id);

    wp_send_json($content_pieces);
}

add_action('wp_ajax_read-content-piece', 'ajax_get_single_content_piece');

function ajax_create_content_group() {

    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'term_ids' => $_POST['term_ids'],
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours']
    );

    $id = save_content_group($data);
    
    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $id)));
}

add_action('wp_ajax_create-content-group', 'ajax_create_content_group');

function ajax_update_content_group() {

    global $wpdb;

    if (isset($_POST['changed']) && $_POST['changed']=='module_details') {
        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'term_ids' => $_POST['term_ids'],
            'duration' => $_POST['duration'],
            'minshours' => $_POST['minshours']
        );
        $content_group = save_content_group($data);
    }
   
    if (isset($_POST['changed']) && ($_POST['changed']=='content_pieces')) {
        $data = array(
          'id' => $_POST['id'],
          'content_pieces' => $_POST['content_pieces']
        );
        $update_group_content_pieces=update_group_content_pieces($data);
    }
    
    if (isset($_POST['changed']) && ($_POST['changed']=='status')) {
        if($_POST['status'] == 'scheduled'){
            $data = array(
              'id' => $_POST['id'],
              'status' => $_POST['status'],
              'division' => $_POST['division'],
              'training_date' => $_POST['training_date']
            );
            $update_training_module_status=update_training_module_status($data);
        }
    }
    
    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $_POST['id'])));
}

add_action('wp_ajax_update-content-group', 'ajax_update_content_group');

function ajax_fetch_content_groups() {
    
    $args= $_GET;
    
    $content_groups= get_all_content_groups($args);
  
    wp_send_json(array('code' => 'OK', 'data' => $content_groups));
}

add_action('wp_ajax_get-content-groups', 'ajax_fetch_content_groups');

function ajax_fetch_single_content_group() {
    
    $id=$_GET['id'];
    $content_groups= get_single_content_group($id);
  
    wp_send_json(array('code' => 'OK', 'data' => $content_groups));
}
add_action('wp_ajax_read-content-group', 'ajax_fetch_single_content_group');

function ajax_save_content_piece() {

    unset($_POST['action']);

    $content_id=$_POST['content_id'];

    $post_data =$_POST;

    if($content_id and $content_id != NaN)
        update_content_piece($content_id,$post_data);

    else
        $content_id = save_content_piece($post_data);

    wp_send_json(array('ID'=>$content_id));

}

add_action('wp_ajax_save-content-piece-json', 'ajax_save_content_piece');

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


function get_blog_media() {
    $id = $_GET ['id'];
    $current_blog_id= get_current_blog_id();
    switch_to_blog(1);

    $media = wp_prepare_attachment_for_js ( $id );
    switch_to_blog($current_blog_id);

    wp_send_json ( array (
        'code' => 'OK',
        'data' => $media
    ) );


}
add_action ( 'wp_ajax_read-media', 'get_blog_media' );