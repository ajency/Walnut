<?php

require_once 'functions.php';
require_once 'additional-textbook-fields.php';

add_action( 'wp_ajax_get-textbooks', 'fetch_textbooks' );
add_action( 'wp_ajax_get-chapters', 'fetch_textbooks' );

function fetch_textbooks() {
    
    $args=$_GET;
    if( isset($args['page_url']) && $args['page_url'] == 'content-pieces')
      $all='1';
    else if($args['to_fetch'] == 'textbooks')
      $all='2';
    else if($args['to_fetch'] == 'chapters')
      $all='3';
    else
      $all='0';
    
    $defaults['parent']= 0;
    
    if(isset($_GET['parent']))
      $defaults['fetch_all']= true;

    if(isset($_GET['page']))
      $defaults['fetch_all']= true;

    $args = wp_parse_args($args, $defaults);
    $textbooks=get_textbooks($args, $all);

    if(isset($_GET['page']))
      return $textbooks;
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
    $current_blog = get_current_blog_id();
    switch_to_blog(1);
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
   switch_to_blog($current_blog);
   wp_send_json($textbook_names);
}

add_action( 'wp_ajax_get-all-classes', 'get_all_classes' );

function get_all_classes(){

  global $wpdb;

  $class_id = [];

  $class_id = $wpdb->get_col("SELECT DISTINCT class_id FROM {$wpdb->prefix}class_divisions order by class_id asc");

  wp_send_json($class_id);
}

add_action( 'wp_ajax_get-admin-capability', 'get_admin_capability' );

function get_admin_capability(){

  $current_blog = get_current_blog_id();
  if ($current_blog == 1)
    $isAdmin = true;
  else
    $isAdmin = false;

  wp_send_json($isAdmin);
}