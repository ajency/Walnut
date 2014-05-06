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
    
    $postarr=array(
      'post_status'=>'publish',
      'post_type'=>'content_piece',
      'post_title'=> 'test content piece'
    );
    $content_piece= wp_insert_post($postarr); 
    echo $content_piece;
    if($content_piece)
        update_post_meta ($content_piece, 'layout_json',$_POST['json']);
    wp_send_json(array('code' => 'OK', 'data' => $content_groups));
}

add_action('wp_ajax_save-content-piece-json', 'save_content_piece_json');