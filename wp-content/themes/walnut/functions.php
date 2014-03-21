<?php
if ( ! isset( $content_width ) )
	$content_width = 604;

require_once 'modules/school/functions.php';
require_once 'modules/questions/functions.php';
require_once 'modules/textbooks/ajax.php';
require_once 'modules/textbooks/functions.php';
require_once 'modules/menus/ajax.php';
require_once 'modules/menus/functions.php';
require_once 'modules/user/ajax.php';
require_once 'modules/user/functions.php';

add_theme_support('menus');

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


add_action( 'wp_ajax_nopriv_get-user-profile', 'authenticate_login' );

function authenticate_login() {
	$login_data=$_POST['data'];
	$status=$_POST['ntwkStatus'];
	if($status=='online'){
		$login_check=wp_authenticate($login_data['txtusername'],$login_data['txtpassword']);
		if(is_wp_error($login_check))
			echo(json_encode(array("error"=>"Invalid Username or Password")));
		else{
                    wp_set_auth_cookie( $login_check->ID );
                    echo(json_encode($login_check));
                }
	}
	else
		echo(json_encode(array("error"=>"Connection could not be established. Please try again.")));
	die;
}