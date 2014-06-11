<?php 

function get_site_media($query, $media_type='image'){

	if ( ! current_user_can( 'upload_files' ) )
		return array('code' => 'ERROR','message' => 'Dont\'t have enough permission');

	$query = array_intersect_key( $query, array_flip( array(
		's', 'order', 'orderby', 'posts_per_page', 'paged', 'post_mime_type',
		'post_parent', 'post__in', 'post__not_in',
	) ) );

	$query['post_type'] = 'attachment';
    $query['post_mime_type'] = $media_type;
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