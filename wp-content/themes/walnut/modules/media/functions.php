<?php 

function get_site_media($query, $search_string=''){

    global $wpdb;

	if ( ! current_user_can( 'upload_files' ) )
		return array('code' => 'ERROR','message' => 'Dont\'t have enough permission');

	$query = array_intersect_key( $query, array_flip( array(
		's', 'order', 'orderby', 'posts_per_page', 'paged', 'post_mime_type',
		'post_parent', 'post__in', 'post__not_in',
	) ) );

    if(trim($search_string) != ''){

        $post_ids_qry = $wpdb->prepare(
            "SELECT ID from {$wpdb->base_prefix}posts where
                post_mime_type like %s
                and post_title like %s",
            array(
                "%".$query['post_mime_type']."%",
                "%$search_string%"));

        $post_ids = $wpdb->get_results($post_ids_qry, ARRAY_A);
        $post_ids = __u::flatten($post_ids);
        if(sizeof($post_ids)>0){
            $query['post__in'] = $post_ids;
        }
        else{
           return false;
        }
    }

	$query['post_type'] = 'attachment';
	$query['post_status'] = 'inherit';

	if ( current_user_can( get_post_type_object( 'attachment' )->cap->read_private_posts ) )
		$query['post_status'] .= ',private';
	
	$query = apply_filters( 'ajax_query_attachments_args', $query );

	$query = new WP_Query( $query );

	$posts = array_map( 'wp_prepare_attachment_for_js', $query->posts );
	$posts = array_filter( $posts );

	return $posts;	
}

function update_media( $data, $media_id = 0 ) {

    global $wpdb;

    $post = get_post($media_id, ARRAY_A);

    if ( 'attachment' != $post['post_type'] )
        wp_send_json_error();

    $post['post_title'] = $data['title'];

    $post['post_excerpt'] = $data['caption'];

    $post['post_content'] = $data['description'];

    $alt = wp_unslash( $data['alt'] );
    if ( $alt != get_post_meta( $media_id, '_wp_attachment_image_alt', true ) ) {
        $alt = wp_strip_all_tags( $alt, true );
        update_post_meta( $media_id, '_wp_attachment_image_alt', wp_slash( $alt ) );
    }

    wp_update_post( $post );

    return $media_id;

}

function media_encrypt_files() {
    // current page is mediafromftp (the plugin)
    if($_GET['page'] =='mediafromftp' || $_REQUEST['mediaType'] == 'video' || $_REQUEST['mediaType'] == 'audio'){
        if(isset($_POST['new_url_attaches']) && !empty($_POST['new_url_attaches'])){
            encrypt_media_files($_POST['new_url_attaches']);
        }
        
    }
 
}

add_filter( 'admin_init', 'media_encrypt_files', 100);

function encrypt_media_files($media_files){
    
    #setting memory limit to infinite for videos conversion.
    ini_set('memory_limit', '-1');
    ini_set('max_memory_limit', '-1');

    $mediatype =array('audios','videos');
    foreach($media_files as $filepath){
        $parse_file_path = parse_url($filepath);
        $pathinfo = explode('/', $parse_file_path['path']);
        $count_pathinfo = count($pathinfo);

        if($pathinfo[$count_pathinfo-2] == 'audio-web'){
           $enc_media_type = $mediatype[0];
        }
        elseif($pathinfo[$count_pathinfo-2] == 'videos-web'){
           $enc_media_type = $mediatype[1];   
        }
        
        if(in_array($enc_media_type, $mediatype)){
        $filename = WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'media-web'
                .DIRECTORY_SEPARATOR.$pathinfo[$count_pathinfo-2].DIRECTORY_SEPARATOR.$pathinfo[$count_pathinfo-1];
        
        $filename_enc = WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.$enc_media_type
                .DIRECTORY_SEPARATOR.$pathinfo[$count_pathinfo-1];
        
        aes_file_encrypt($filename,$filename_enc,$enc_media_type);
        }
    }
}

function aes_file_encrypt($orig_file,$encfile,$mediatype){
    $inputKey = "kal/dvjBWAaD8+fl0a1b1JljOJtdv6G6"; //unique key to be used for AES encryption and decryption
    
    $file_data = file_get_contents($orig_file);

    $enc = mcrypt_encrypt(MCRYPT_RIJNDAEL_128,
          $inputKey, $file_data, MCRYPT_MODE_ECB);
   
    if (!file_exists(WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.$mediatype)) {
        mkdir(WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.$mediatype, 0777, true);
    }
    
    $nfile = fopen($encfile, "w") ;
    fwrite($nfile, $enc);
    fclose($nfile);
}



/*
 * function to decrypt a file 
 * 
 * @param string $src_url  source url as stored in posts table 
 * @param string $mediatype media type  audios|videos
 * 
 * @return url $temp_url ur of the decrypted file
 */
function aes_file_decrypt($src_url,$mediatype){
    
    $src_file_info = pathinfo($src_url);
    
    $src_file_path = WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.$mediatype.DIRECTORY_SEPARATOR.$src_file_info['basename'];
            
    $temp_path = WP_CONTENT_DIR.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.$mediatype;
    
    if (!file_exists($temp_path)) {   
        mkdir($temp_path, 0777, true);
    }

    $temp_user_path = $temp_path.DIRECTORY_SEPARATOR.get_current_user_id();
    if (!file_exists($temp_user_path)) {   
        mkdir($temp_user_path, 0777, true);
    }
    $inputKey = "kal/dvjBWAaD8+fl0a1b1JljOJtdv6G6"; //unique key to be used for AES encryption and decryption
    
    $file_data = file_get_contents($src_file_path);

    $dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128,
          $inputKey, $file_data, MCRYPT_MODE_ECB);
   
    
    $nfile = fopen($temp_user_path.DIRECTORY_SEPARATOR.$src_file_info['basename'], "w") ;
    fwrite($nfile, $dec);
    fclose($nfile);
    
    $wp_upload_dir = wp_upload_dir();
    $temp_url = str_replace("images", "", $wp_upload_dir['baseurl']);
    
    $temp_url = $temp_url.'/tmp/'.$mediatype.'/'.get_current_user_id().'/'.$src_file_info['basename'];
    return $temp_url;
       
}


function modify_media_url($mediaresponse,$media_type){
    $temp_media_folder = array('audio'=>'audios','video'=>'videos');
    
    $mediaresponse['url'] =  aes_file_decrypt($mediaresponse['url'],$temp_media_folder[$media_type]);
    
    return $mediaresponse;
}