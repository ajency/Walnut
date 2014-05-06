<?php

require_once 'functions.php';

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
    
    wp_send_json($textbooks);
}

add_action( 'wp_ajax_read-textbook', 'read_textbook' );

function read_textbook() {
    if(!isset($_GET['term_id']))
        return false;
    
    $textbooks=get_book($_GET['term_id']);
    
    wp_send_json($textbooks);
}

add_action( 'wp_ajax_get-chapter-subsections', 'fetch_chapter_subsections' );

function fetch_chapter_subsections() {
    
    $args=$_GET;
    
    $defaults = array(
            'all_children'=> true
        );
    $args = wp_parse_args($args, $defaults);
    $subsections=get_chapter_subsections($args);
    
    wp_send_json($subsections);
}

add_action( 'wp_ajax_get-textbook-names', 'get_textbook_names' );
function get_textbook_names(){
    $args = array(
        'include'=> $_GET['term_ids'],
        'hide_empty'=> false
        );
   $textbooks= get_terms('textbook', $args);
   
   $i=0;
   foreach($textbooks as $t){
       $textbook_names[$i]['id']=$t->term_id;       
       $textbook_names[$i]['name']=$t->name;
       $i++;
   }
   
   wp_send_json($textbook_names);
}
