<?php
/**
* WordPress Installer
*
* @package WordPress
* @subpackage Administration
*/
if(!is_admin()){
$link = wp_guess_url() . '/wp-admin/installer.php';
wp_redirect( $link );
exit();
}
