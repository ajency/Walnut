<?php

add_action( 'wp_ajax_get-textbooks', 'fetch_textbooks' );

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

