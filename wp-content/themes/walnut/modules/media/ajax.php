<?php 

include_once 'functions.php';

function query_attachments() {
	
	$query = array ();
	// $query['order'] = $_REQUEST['order'];
	// $query['orderby'] = $_REQUEST['orderby'];
	// $query['posts_per_page'] = $_REQUEST['posts_per_page'];
	// $query['paged'] = $_REQUEST['paged'];
	
	$media = get_site_media ( $query );
	
	wp_send_json ( array (
			'code' => 'OK',
			'data' => $media 
	) );
}
add_action ( 'wp_ajax_query_attachments', 'query_attachments' );
add_action ( 'wp_ajax_nopriv_query_attachments', 'query_attachments' );


function get_media() {
	$id = $_GET ['id'];
	$media = wp_prepare_attachment_for_js ( $id );
	wp_send_json ( array (
			'code' => 'OK',
			'data' => $media 
	) );
}
add_action ( 'wp_ajax_read-media', 'get_media' );