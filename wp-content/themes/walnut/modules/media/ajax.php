<?php 

include_once 'functions.php';

function query_attachments() {
	
	$query = array ();
    $media_type= 'image';
    if(isset($_REQUEST['mediaType']))
        $media_type=$_REQUEST['mediaType'];
	$query['order'] = $_REQUEST['order'];
	$query['orderby'] = $_REQUEST['orderby'];
	$query['posts_per_page'] = $_REQUEST['posts_per_page'];
	$query['paged'] = $_REQUEST['paged'];
    $query['post_mime_type'] = $media_type;

    $search_string= $_REQUEST['searchStr'];

	$media = get_site_media ( $query, $search_string );
	
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


function ajax_update_media() {

    $data = $_POST;

    $media_id = $_POST[ 'id' ];

    unset( $data[ 'action' ] );
    unset( $data[ 'id' ] );

    update_media( $data, $media_id );

    wp_send_json( array( 'code' => 'OK', 'data' => array( 'id' => $media_id ) ) );
}

add_action( 'wp_ajax_update-media', 'ajax_update_media' );
