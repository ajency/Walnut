<?php
if ( ! isset( $content_width ) )
	$content_width = 604;

require_once 'modules/school/functions.php';
require_once 'modules/questions/functions.php';
require_once 'modules/textbooks/functions.php';

//add extra fields to custom taxonomy edit form callback function

function upload_attachment($file_handler, $post_id, $setthumb = 'false') {

	// check to make sure its a successful upload
	if ($_FILES[$file_handler]['error'] !== UPLOAD_ERR_OK)
		__return_false();

	require_once(ABSPATH . "wp-admin" . '/includes/image.php');
	require_once(ABSPATH . "wp-admin" . '/includes/file.php');
	require_once(ABSPATH . "wp-admin" . '/includes/media.php');

	$attach_id = media_handle_upload($file_handler, $post_id);

	if ($setthumb)
		update_post_meta($post_id, '_thumbnail_id', $attach_id);
	return $attach_id;
}