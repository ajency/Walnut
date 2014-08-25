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

add_action( 'wp_ajax_query_attachments', 'query_attachments' );
add_action( 'wp_ajax_nopriv_query_attachments', 'query_attachments' );


function get_blog_media() {
    $id = $_GET ['id'];
    $current_blog_id= get_current_blog_id();
    switch_to_blog(1);

    $media = wp_prepare_attachment_for_js ( $id );
    switch_to_blog($current_blog_id);

    wp_send_json ( array (
        'code' => 'OK',
        'data' => $media
    ) );


}
add_action ( 'wp_ajax_read-media', 'get_blog_media' );





function ajax_update_media() {

    $data = $_POST;

    $media_id = $_POST['id'];

    unset($data['action']);
    unset($data['id']);

    update_media( $data, $media_id );

    wp_send_json( array( 'code' => 'OK', 'data' => array( 'id' => $media_id ) ) );
}

add_action( 'wp_ajax_update-media', 'ajax_update_media' );


function change_uploads_use_yearmonth_folders( $value ) {

    return false;
}

add_filter( 'option_uploads_use_yearmonth_folders', 'change_uploads_use_yearmonth_folders', 100, 1 );

function change_uploads_directory( $uploads_dir ) {

    $folder_name = '/images';

    // Change the default uploads path to videos-web folder if
    // current page is mediafromftp (the plugin)
    // or if requested mediatype is video

    if($_GET['page'] =='mediafromftp' || $_REQUEST['mediaType'] == 'video' || $_REQUEST['mediaType'] == 'audio'){
        if(is_multisite())
            $folder_name= '/media-web';
        else
            $folder_name= '';
    }


    $uploads_dir['path'] = $uploads_dir['path'] . $folder_name;
    $uploads_dir['url'] = $uploads_dir['url'] . $folder_name;
    $uploads_dir['basedir'] = $uploads_dir['basedir'] . $folder_name;
    $uploads_dir['baseurl'] = $uploads_dir['baseurl'] . $folder_name;

    return $uploads_dir;
}

add_filter( 'upload_dir', 'change_uploads_directory', 100, 1 );


function get_media_by_ids(){
    $ids = $_GET['ids'];
    $media = array();
    $current_blog_id= get_current_blog_id();
    switch_to_blog(1);
    foreach ($ids as $id){
        
        $media_file=wp_prepare_attachment_for_js( $id );
        
        $file_url= $media_file['url'];
        
        $upload_dir=wp_upload_dir();
        
        $directory= $upload_dir['basedir'];
        
        if($media_file['type'] === 'video')
            $file_path= $directory.'/videos-web/'.$media_file['filename'];
        else
            $file_path= $directory.'/audio-web/'.$media_file['filename'];
        
        if(file_exists($file_path))
            $media[] = $media_file;
        
        else 
            $media[]= array('error'=>'file doesnt exist','url'=>false);
        
    }
    
    switch_to_blog($current_blog_id);
    
    wp_send_json( array(
        'code' => 'OK',
        'data' => $media
    ) );

}

add_action('wp_ajax_get_media_by_ids','get_media_by_ids');
