<?php 

require_once 'modules/content-pieces/ajax.php';
require_once 'modules/content-modules/ajax.php';
require_once 'modules/quiz/ajax.php';
require_once 'modules/student-training/ajax.php';
require_once 'functions-openschool-student.php';

add_action('wp_logout','student_go_login');
function student_go_login(){
	wp_redirect(MAIN_SITE."/login" );
	exit();
}



function check_media_import(){
	$path = 'media-web/images-web/4th_maths/4th_perimeter_and_area/perimeter17.png';
	global $wpdb;

            /*$query =$wpdb->prepare( "SELECT wposts.ID FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta
                            WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file'
                            AND wpostmeta.meta_value LIKE '%s' AND wposts.post_type = 'attachment'",
                            $path
                        );*/

            $query =$wpdb->prepare( "SELECT wposts.ID FROM wp_posts wposts, wp_postmeta wpostmeta
                            WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file'
                            AND wpostmeta.meta_value LIKE 'media-web/images-web/4th_maths\\4th_perimeter_and_area\\perimeter1.png' AND wposts.post_type = 'attachment'");


            $attachment_id = $wpdb->get_var($query);
            $attachment_url =  wp_get_attachment_url( $attachment_id );
            $type = get_media_file_type($media_path);
            echo $attachment_url;

}

//add_action('template_redirect','check_media_import');