<?php

add_action( 'wp_ajax_get-textbooks', 'fetch_textbooks' );
add_action( 'wp_ajax_get-chapters', 'fetch_textbooks' );

function fetch_textbooks() {
    
    $args=$_GET;
    
    $defaults = array(
            'parent' => 0,
            'fetch_all' => ($_GET['class_id'])?false:true
        );
    $args = wp_parse_args($args, $defaults);
    $textbooks=get_textbooks($args);
    
    echo(wp_send_json($textbooks));
    die;
}

add_action( 'wp_ajax_read-textbook', 'read_textbook' );

function read_textbook() {
    if(!isset($_GET['term_id']))
        return false;
    
    $textbooks=get_book($_GET['term_id']);
    
    echo(wp_send_json($textbooks));
    die;
}
