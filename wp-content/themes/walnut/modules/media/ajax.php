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

    $enc_media_types = array('audio','video');

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

    $path = $baseurl= '';

    // change uploads directory to media-web for list of folders in mediafromftp dropdown
    // so that the other non-media folders aren't displayed in the list
    // doesnt effect the upload process
    if($_GET['page'] =='mediafromftp' && !isset($_REQUEST['adddb']))
        $baseurl = '/media-web';

	#if upload is done thru async-upload
	#change default upload directory based on filetype
	global $pagenow;
	if($pagenow=='async-upload.php'){
		$fileType= get_media_file_type($_REQUEST['name']);
        switch ($fileType) {
            case 'video':
                $path ='/media-web/videos-web';
                break;

            case 'audio':
                $path ='/media-web/audio-web';
                break;

            case 'image':
                $path ='/media-web/images-web';
                break;
        }
	}


    $uploads_dir['path'] = $uploads_dir['path'] . $path;
    $uploads_dir['url'] = $uploads_dir['url'];
    $uploads_dir['basedir'] = $uploads_dir['basedir'];
    $uploads_dir['baseurl'] = $uploads_dir['baseurl']. $baseurl;

    return $uploads_dir;
}

add_filter( 'upload_dir', 'change_uploads_directory', 100, 1 );


function get_media_by_ids(){
    $ids = $_GET['ids'];
    $media = array();
    $enc_media_types = array('audio','video');
    $current_blog_id= get_current_blog_id();
    switch_to_blog(1);
    foreach ($ids as $id){

        $media_file=wp_prepare_attachment_for_js( $id );

        $file_url= $media_file['url'];

        $upload_dir=wp_upload_dir();

        $directory= $upload_dir['basedir'];

        if(file_exists($directory.$file_path) and $media_file)
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
/*
 * function to delete a decrypted file
 * @param string $_POST['source']  temporary decrypted file path
 */
function ajax_decrypt_file_delete(){

    $src_file_info = pathinfo($_POST['source']);

    $user_id = get_current_user_id();

    $temp_path = WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.$user_id.DIRECTORY_SEPARATOR.$mediatype;

    if (file_exists($temp_path.DIRECTORY_SEPARATOR.$src_file_info['filename'])) {
        unlink($temp_path.DIRECTORY_SEPARATOR.$src_file_info['filename']);
            wp_send_json( array(
            'code' => 'OK',
            'data' => 'file deleted successfully'
            ) );
    }
    else{
            wp_send_json( array(
            'code' => 'ERROR',
            'data' => 'file does not exist'
            ) );
    }
}
