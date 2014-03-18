<?php
function create_question_post_type() {
	register_post_type('question', array(
	'labels' => array(
	'name' => __('Question'),
	'singular_name' => __('Question'),
	'add_new_item' => 'Add New Question',
	'edit_item' => 'Edit Question',
	'new item' => 'New Question',
	'view_item' => 'View Question',
	'not_found' => 'No Questions found',
	'not_found_in_trash' => 'No Questions found in the trash',
	'search_items' => 'Search Questions'
			),
			'public' => true,
			'has_archive' => true,
			'supports' => array('title', 'editor', 'comments', 'thumbnail')
	)
	);

	register_taxonomy('textbook', 'question', array('labels' => array(
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

	register_taxonomy('question-tags', 'question', array('labels' => array(
	'name' => 'Question Tags',
	'singular_name' => 'Question Tag',
	'add_new_item' => 'Add New Tag',
	'edit_item' => 'Edit Tag',
	'new item' => 'New Tag',
	'view_item' => 'View Tag',
	'not_found' => 'No Tag found',
	'not_found_in_trash' => 'No Tag found in the trash',
	'search_items' => 'Search Question Tag'
			), 'public' => true,
        'show_ui' => true,
	'query_var' => true));
}

add_action('init', 'create_question_post_type');
?>
