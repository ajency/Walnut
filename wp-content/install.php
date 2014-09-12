<?php
/**
* WordPress Installer
*
* @package WordPress
* @subpackage Administration
*/
$link = wp_guess_url() . '/wp-admin/installer.php';
wp_redirect( $link );
exit();
