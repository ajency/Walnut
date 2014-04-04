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
?>
