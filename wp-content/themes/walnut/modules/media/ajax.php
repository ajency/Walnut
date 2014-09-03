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
    
    if(in_array($media['type'], $enc_media_types && !is_multisite())){
            $media = modify_media_url($media,$media['type']);
    }

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
    $enc_media_types = array('audio','video');
    $current_blog_id= get_current_blog_id();
    switch_to_blog(1);
    foreach ($ids as $id){

        $media_file=wp_prepare_attachment_for_js( $id );

        if(in_array($media_file['type'], $enc_media_types) && !is_multisite()){
             
            $media_file = modify_media_url($media_file,$media_file['type']); // change the media url to the decrypted file path
        }
        
        $file_url= $media_file['url'];
        
        $upload_dir=wp_upload_dir();
        
        $directory= $upload_dir['basedir'];
        
        if(is_multisite()){
            if($media_file['type'] === 'video')
                $file_path= $directory.'/videos-web/'.$media_file['filename'];
            else
                $file_path= $directory.'/audio-web/'.$media_file['filename'];
        }
        else{
             if($media_file['type'] === 'video')
                $file_path= $directory.'/videos/'.$media_file['filename'];
            else
                $file_path= $directory.'/audios/'.$media_file['filename'];
        }
        
        if(file_exists($file_path) and $media_file)
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
