<?php

add_action( 'wp_ajax_get-content-pieces', 'fetch_content_pieces' );

function fetch_content_pieces() {
    
    $args=$_GET;
    
    $defaults = array(
            'post_type' => 'content-piece'
        );
    
    $args = wp_parse_args($args, $defaults);
    
    $content_pieces=get_content_pieces($args);
    
    echo(wp_send_json($content_pieces));
    die;
}

add_action( 'wp_ajax_create-contentGroup', 'create_content_group' );

function create_content_group() {
    
    global $wpdb;
    
    $data = array(
            'name'              => $_POST['name'],
            'term_ids'          => $term_ids,
            'description'       => maybe_serialize($_POST['description']),
            'term_ids'          => maybe_serialize($_POST['term_ids'])
        );
    
    $content_group=save_content_group($data);
    
    wp_send_json(array('code'=>'OK', 'data'=>$content_group));
}

add_action( 'wp_ajax_update-contentGroup', 'update_content_group' );

function update_content_group() {
    
    global $wpdb;
    
    $data = array(
            'id'                => $_POST['id'],
            'name'              => $_POST['name'],
            'term_ids'          => $term_ids,
            'description'       => maybe_serialize($_POST['description']),
            'term_ids'          => maybe_serialize($_POST['term_ids'])
        );
    
    $content_group=save_content_group($data);
    
    wp_send_json(array('code'=>'OK', 'data'=>$content_group));
}