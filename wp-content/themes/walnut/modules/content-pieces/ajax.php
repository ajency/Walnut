<?php

require_once 'functions.php';

function ajax_get_content_pieces() {

    $args = $_REQUEST;

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