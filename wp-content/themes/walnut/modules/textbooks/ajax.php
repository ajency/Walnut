<?php

add_action( 'wp_ajax_get-textbooks', 'fetch_textbooks' );

function fetch_textbooks() {
    $args = array(
            'parent' => 0,
            'fetch_all' => true
        );
    $textbooks=get_textbooks($args);
    
    echo(wp_send_json($textbooks));
    die;
}

