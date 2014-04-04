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
?>
