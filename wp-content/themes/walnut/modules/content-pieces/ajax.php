<?php

require_once 'functions.php';

function ajax_get_content_pieces() {

    $args = $_REQUEST;

    $defaults = array(
        'post_type' => 'content-piece'
    );

    $args = wp_parse_args($args, $defaults);

    $content_pieces = get_content_pieces($args);

    file_put_contents("a.txt", print_r($content_pieces, true));

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

    if(!isset($_GET['chapterID']))
        return wp_send_json(array('error'=>'chapterID is a required request parameter'));

    $direction = (isset($_GET['direction']))?$_GET['direction']:'current';

    $chapterID= $_GET['chapterID'];

    if(in_array($direction,array('next','prev')))
        $chapterID = get_adjacent_chapter($chapterID,$direction);

    if(!$chapterID) return wp_send_json(array('status'=>'over', 'items'=>array()));

    $args = array(
        'post_type' => 'content-piece',
        'textbook'  => $chapterID,
        'post_status'=> 'pending'
    );

    $content_pieces = get_content_pieces($args);
    foreach($content_pieces as $item){
        $textbook = get_term($item->term_ids['textbook'],'textbook');
        $item->textbookName = $item->chapterName= '';
        $item->textbookID = $item->chapterID = 0;
        if(!is_wp_error( $textbook )){
            $item->textbookName = $textbook->name;
            $item->textbookID = $item->term_ids['textbook'];
        }
        $chapter =  get_term($item->term_ids['chapter'],'textbook');
        if(!is_wp_error( $chapter )){
            $item->chapterName = $chapter->name;
            $item->chapterID = $item->term_ids['chapter'];
        }
    }
    wp_send_json(array(
        'status'=>'pending',
        'chapterID'=>$chapterID,
        'items'=>$content_pieces));

}
add_action('wp_ajax_get-adjacent-content-pieces', 'ajax_get_adjacent_content_pieces');
