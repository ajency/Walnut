<?php

require_once 'functions.php';

function fetch_content_pieces() {

    $args = $_GET;

    $defaults = array(
        'post_type' => 'content-piece'
    );

    $args = wp_parse_args($args, $defaults);

    $content_pieces = get_content_pieces($args);

    wp_send_json($content_pieces);
}

add_action('wp_ajax_get-content-pieces', 'fetch_content_pieces');

function fetch_single_content_piece() {
    
    $id=$_GET['ID'];
    $content_pieces = get_single_content_piece($id);

    wp_send_json($content_pieces);
}

add_action('wp_ajax_read-content-piece', 'fetch_single_content_piece');
function create_content_group() {

    $data = array(
        'name' => $_POST['name'],
        'description' => maybe_serialize($_POST['description']),
        'term_ids' => maybe_serialize($_POST['term_ids']),
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours']
    );

    $id = save_content_group($data);
    
    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $id)));
}

add_action('wp_ajax_create-content-group', 'create_content_group');

function update_content_group() {

    global $wpdb;
    if (!isset($_POST['changed'])) {
        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => maybe_serialize($_POST['description']),
            'term_ids' => maybe_serialize($_POST['term_ids'])
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
        $data = array(
          'id' => $_POST['id'],
          'status' => $_POST['status'],
          'division' => $_POST['division'],
          'training_date' => $_POST['training_date']
        );
        $update_training_module_status=update_training_module_status($data);
    }
    
    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $_POST['id'])));
}

add_action('wp_ajax_update-content-group', 'update_content_group');

function fetch_content_groups() {
    
    $args= $_GET;
    
    $content_groups= get_all_content_groups($args);
  
    wp_send_json(array('code' => 'OK', 'data' => $content_groups));
}

add_action('wp_ajax_get-content-groups', 'fetch_content_groups');

function fetch_single_content_group() {
    
    $id=$_GET['id'];
    $content_groups= get_single_content_group($id);
  
    wp_send_json(array('code' => 'OK', 'data' => $content_groups));
}

add_action('wp_ajax_read-content-group', 'fetch_single_content_group');

function save_content_piece_json() {

    $content_id=$_POST['content_id'];
    $json =$_POST['json'];
    if($content_id and $content_id != NaN)
        update_content_piece_layout_meta($content_id,$json);

    else
        $content_id = save_content_piece_layout($json);

    wp_send_json(array('ID'=>$content_id));
}

add_action('wp_ajax_save-content-piece-json', 'save_content_piece_json');

function save_content_element() {
    global $wpdb;
    unset($_POST['action']);
    $element_details=  maybe_serialize($_POST);

    if(isset($_POST['meta_id'])){
        $meta_id = $_POST['meta_id'];
        $update_element_qry= $wpdb->prepare("update {$wpdb->prefix}postmeta set meta_value = %s where meta_id = %d", array($element_details,$meta_id));
        $wpdb->query($update_element_qry);
    }
    else{
        $insert_element_qry= $wpdb->prepare("insert into {$wpdb->prefix}postmeta values ('',%d,'content_element',%s)", array(0,$element_details));
        $wpdb->query($insert_element_qry);

        $meta_id= $wpdb->insert_id;
    }
    wp_send_json(array('meta_id'=>$meta_id));
}

add_action('wp_ajax_create-element', 'save_content_element');
add_action('wp_ajax_update-element', 'save_content_element');


function fetch_content_element() {
    global $wpdb;

    $meta_id=  $_GET['meta_id'];

    $element_qry=$wpdb->prepare("select meta_value from {$wpdb->prefix}postmeta where meta_id=%d", $meta_id);

    $element_data=$wpdb->get_var($element_qry);
    $element_data= maybe_unserialize($element_data);

    wp_send_json($element_data);
}

add_action('wp_ajax_read-element', 'fetch_content_element');