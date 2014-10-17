<?php
// require the autoloader
require 'vendor/autoload.php';

if (!isset($content_width))
    $content_width = 604;

require_once 'underscore.php';
require_once 'modules/school/ajax.php';
require_once 'modules/content-pieces/ajax.php';
require_once 'modules/content-modules/ajax.php';
require_once 'modules/textbooks/ajax.php';
require_once 'modules/menus/ajax.php';
require_once 'modules/user/ajax.php';
require_once 'modules/media/ajax.php';
require_once 'modules/divisions/ajax.php';
require_once 'modules/question-response/ajax.php';
require_once 'modules/sync-data/sync-data-ajax.php';
require_once 'modules/communications/functions.php';
require_once 'modules/quiz/ajax.php';
require_once 'custom_configs.php';
require_once 'modules/school/school_data_import.php';


add_theme_support( 'menus' );


//add extra fields to custom taxonomy edit form callback function

function upload_attachment( $file_handler, $post_id, $set_thumb = 'false' ) {

    // check to make sure its a successful upload
    if ($_FILES[$file_handler]['error'] !== UPLOAD_ERR_OK)
        __return_false();

    require_once(ABSPATH . "wp-admin" . '/includes/image.php');
    require_once(ABSPATH . "wp-admin" . '/includes/file.php');
    require_once(ABSPATH . "wp-admin" . '/includes/media.php');

    $attach_id = media_handle_upload( $file_handler, $post_id );

    if ($set_thumb)
        update_post_meta( $post_id, '_thumbnail_id', $attach_id );

    return $attach_id;
}


if (!is_multisite()) {

    // define empty functions for standalone installation to ignore multisite functions
    function switch_to_blog(){}
    function restore_current_blog(){}
    function get_blog_option(){}
    function get_active_blog_for_user(){}
    function get_blog_details(){}

    // function to replace media urls incase of standalone site
    function replace_media_urls($url){

        $url = str_replace(REMOTE_SERVER_URL, get_site_url(), $url);
        $url = str_replace('media-web/videos-web', 'videos', $url);
        $url = str_replace('media-web/audio-web', 'audios', $url);

        return $url;

    }

}

