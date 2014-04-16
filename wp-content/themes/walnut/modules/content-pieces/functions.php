<?php

function create_content_piece_post_type() {
    register_post_type('content-piece', array(
        'labels' => array(
            'name' => __('Content Piece'),
            'singular_name' => __('Content Piece'),
            'add_new_item' => 'Add New Content Piece',
            'edit_item' => 'Edit Content Piece',
            'new item' => 'New Content Piece',
            'view_item' => 'View Content Pieces',
            'not_found' => 'No Content Piece found',
            'not_found_in_trash' => 'No Content Pieces found in the trash',
            'search_items' => 'Search Content Pieces'
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'comments', 'thumbnail')
            )
    );

    register_taxonomy('textbook', 'content-piece', array('labels' => array(
            'name' => 'Textbook',
            'singular_name' => 'Textbook',
            'add_new_item' => 'Add New Textbook',
            'edit_item' => 'Edit Textbook',
            'new item' => 'New Textbook',
            'view_item' => 'View Textbooks',
            'not_found' => 'No Textbook found',
            'not_found_in_trash' => 'No Textbooks found in the trash',
            'search_items' => 'Search Textbooks'
        ), 'public' => true,
        'hierarchical' => true,
        'show_ui' => true,
        'query_var' => true));

    register_taxonomy('content-piece-tags', 'content-piece', array('labels' => array(
            'name' => 'Content Piece Tags',
            'singular_name' => 'Content Piece Tag',
            'add_new_item' => 'Add New Tag',
            'edit_item' => 'Edit Tag',
            'new item' => 'New Tag',
            'view_item' => 'View Tag',
            'not_found' => 'No Tag found',
            'not_found_in_trash' => 'No Tag found in the trash',
            'search_items' => 'Search Content Piece Tag'
        ), 'public' => true,
        'show_ui' => true,
        'query_var' => true));
}

add_action('init', 'create_content_piece_post_type');

function get_content_pieces($args = array()) {
    
    if(isset($args['ids'])){
        $ids = implode(',',$args['ids']);
        $args['post__in'] = $args['ids'];
    }
    
    
    $args['numberposts'] = -1;
    $args['fields'] = 'ids';
    
    $content_items = get_posts($args);
    
    $content_pieces=array();
    
    foreach ($content_items as $id) {
        $content_pieces[]= get_single_content_piece($id);
    }

    return $content_pieces;
}

function get_single_content_piece($id){
    
    $content_piece= get_post($id);
    
    $subject_ids = array();
    
    $subjects = get_the_terms($id, 'textbook');
    
    //FETCHING LIST OF TEXTBOOKS RELATED TO THE CONTENT PIECE
    foreach ($subjects as $sub) {
        
        $subject_ids[] = $sub->term_id;
        
        while ($sub->parent >0){
            $sub = get_term($sub->parent, 'textbook');
            $subject_ids[] = $sub->term_id;
        }
    }
    //print_r($subject_ids);
    $content_piece->subjects = $subject_ids;
    $authordata = get_userdata($content_piece->post_author);
    $content_piece->creator = $authordata->display_name;
    $content_type = get_post_meta($id, 'content_type', true);
    $content_piece->content_type = ($content_type) ? $content_type : '--';
        
   return $content_piece;
}

function save_content_group($data = array()) {
    global $wpdb;

    $content_data = array(
        'name' => $data['name'],
        'term_ids' => $data['term_ids'],
        'last_modified_on' => date('y-m-d H:i:s'),
        'last_modified_by' => get_current_user_id()
    );

    if (isset($data['id'])) {
        $content_group = $wpdb->update($wpdb->prefix . 'content_collection', $content_data, array('id' => $data['id']));
        $group_id = $data['id'];
    } else {
        $content_data['created_on'] = date('y-m-d H:i:s');
        $content_data['created_by'] = get_current_user_id();
        $content_group = $wpdb->insert($wpdb->prefix . 'content_collection', $content_data);
        $group_id = $wpdb->insert_id;
    }
    if ($content_group) {

        $meta_data = array(
            'collection_id' => $group_id,
            'meta_key' => 'description',
            'meta_value' => $data['description']
        );

        if (isset($data['id']))
            $content_meta = $wpdb->update($wpdb->prefix . 'collection_meta', $meta_data, array('id' => $data['id']));
        else
            $content_meta = $wpdb->insert($wpdb->prefix . 'collection_meta', $meta_data);
    }

    return $group_id;
}

function update_group_content_pieces($data= array()){
    global $wpdb;
    $content_pieces = maybe_serialize($data['content_pieces']);
    
    $exists = $wpdb->get_results("select id from {$wpdb->prefix}collection_meta where collection_id=".$data['id']." 
        and meta_key='content_pieces'");
    
    if($exists){
        $content_pieces_qry = "update {$wpdb->prefix}collection_meta set
            meta_value='" . $content_pieces . "' where collection_id=".$data['id']."
            and meta_key='content_pieces'";
    }

    else{
        $content_pieces_qry = "insert into {$wpdb->prefix}collection_meta 
            (collection_id, meta_key, meta_value) values (".$data['id'].",'content_pieces', '" . $content_pieces . "')";
    }
    
    $wpdb->query($content_pieces_qry);
}

function get_all_content_groups($args=array()){
    
    global $wpdb;
    
    $content_groups = $wpdb->get_results("select id from {$wpdb->prefix}content_collection");
    
    $content_data=array();
    
    foreach($content_groups as $item)
        $content_data[]=  get_single_content_group($item->id);
    
    
    return $content_data;
}

function get_single_content_group($id){
    
    global $wpdb;
    
    $fetch_query="select * from {$wpdb->prefix}content_collection where id=".$id;
    $data = $wpdb->get_results($fetch_query);
    
    foreach ($data as $item){
        $data=$item;
        $data->term_ids= maybe_unserialize ($data->term_ids);        
    }
    
    $description= $wpdb->get_results("select * from 
    {$wpdb->prefix}collection_meta where collection_id=".$id, ARRAY_A);

    $data->description=$data->content_pieces=array();

    foreach($description as $key=>$value){
       if ($value['meta_key']=='description' || $value['meta_key']=='content_pieces' ){
           $meta_val = maybe_unserialize ($value['meta_value']);
           $data->$value['meta_key']= $meta_val;
       }
    }
    return $data;
    
}
?>
