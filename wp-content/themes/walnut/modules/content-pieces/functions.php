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


function get_content_pieces($args=array()){
    
    $content_items=get_posts($args);
    
    foreach($content_items as $key=>$val){
       $content_pieces[$key]= $val;
       $content_pieces[$key]->subjects =  get_the_terms($val->ID, 'textbook');
       
       $authordata=get_userdata($val->post_author);
       $content_pieces[$key]->creator =  $authordata->display_name;
    }
    
    return $content_pieces;
}

function save_content_group($data=array()){
    global $wpdb;
    
    $content_data = array(
        'name'              =>$data['name'],
        'term_ids'          =>$data['term_ids'],
        'last_modified_on'  => date('y-m-d H:i:s'),
        'last_modified_by'  => get_current_user_id()
    );
    
    if(isset($data['id'])){
        $content_group=$wpdb->update($wpdb->prefix.'content_collection', $content_data, array('id'=>$data['id']));
        $group_id=$data['id'];
    }
    else{
        $content_data['created_on'] = date('y-m-d H:i:s');
        $content_data['created_by'] = get_current_user_id();
        $content_group=$wpdb->insert($wpdb->prefix.'content_collection', $content_data);  
        $group_id=$wpdb->insert_id;
    }
    if($content_group){
        
        $meta_data=array(
          'collection_id'   => $group_id,
          'meta_key'        => 'description',
          'meta_value'      => $data['description']
        );
        
        if(isset($data['id']))
            $content_meta=$wpdb->update($wpdb->prefix.'collection_meta', $meta_data, array('id'=>$data['id']));
        
        else
            $content_meta=$wpdb->insert($wpdb->prefix.'collection_meta', $meta_data);
        
    }
    
    $group_data=$content_data;
    $group_data['id']=$group_id;
    
    return $group_data;
    
}

?>
