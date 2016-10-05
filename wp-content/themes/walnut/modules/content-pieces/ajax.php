<?php

require_once 'functions.php';

function ajax_get_content_pieces() {

    $args = $_REQUEST;

    $defaults = array(
        'post_type' => 'content-piece'
    );
    if(isset($args['ids']) || isset($args['content_type']))
        $filtered = '0';
    else
        $filtered = '1';

    $args = wp_parse_args($args, $defaults);

    $content_pieces = get_content_pieces($args, $filtered);

    wp_send_json($content_pieces);
}

add_action('wp_ajax_get-content-pieces', 'ajax_get_content_pieces');

function ajax_get_single_content_piece() {

    $id=$_GET['ID'];
    $content_pieces = get_single_content_piece($id);

    wp_send_json($content_pieces);
}

add_action('wp_ajax_read-content-piece', 'ajax_get_single_content_piece');

function ajax_get_adjacent_content_pieces(){
    
    if(!isset($_GET['ID']))
        return new WP_Error('Invalid_Arguments', __('ID is a required request parameter') );
    global $wpdb;
    
    $current_post= get_post($_GET['ID']);
    
    $direction = (isset($_GET['direction']))? $_GET['direction']:'next';
    
    if($direction == 'next'){
        $orderDir = 'asc';
        $operator = '>=';
        $lastItemDir='desc'; //to find last item we need in descending order limit 1
    }
    else{
        $orderDir = 'desc';
        $operator = '<=';
        $lastItemDir='asc'; //to find first item we need in asc order limit 1
    }
    
    $lastItemQry = $wpdb->prepare(
                    "SELECT ID FROM `{$wpdb->base_prefix}posts` "
                    . "WHERE post_status = 'pending' AND "
                    . "post_modified $operator %s order by post_modified $lastItemDir limit 1",
                   $current_post->post_modified
            );
                    
    $lastItem= $wpdb->get_var($lastItemQry);

    $query = $wpdb->prepare(
                    "SELECT ID FROM `{$wpdb->base_prefix}posts` "
                    . "WHERE post_status = 'pending' AND "
                    . "post_modified $operator %s order by post_modified $orderDir limit 120",
                   $current_post->post_modified
            );
                    
    $ids= $wpdb->get_col($query);
    
    $args=array(
        'ids'=>$ids,
        'post_type'=>'content-piece'
    );
    $content_pieces= get_content_pieces($args);
    
    foreach($content_pieces as $item){
        $textbook = get_term($item->term_ids['textbook'],'textbook');
        if(!is_wp_error( $textbook ))
            $item->textbookName = $textbook->name;
        
        $chapter =  get_term($item->term_ids['chapter'],'textbook');        
        if(!is_wp_error( $chapter ))
            $item->chapterName = $chapter->name;
    }

    $status=($lastItem == __u::last($ids))?'over':'pending';
    
    wp_send_json(array('status'=>$status,'items'=>$content_pieces));
}
add_action('wp_ajax_get-adjacent-content-pieces', 'ajax_get_adjacent_content_pieces');
