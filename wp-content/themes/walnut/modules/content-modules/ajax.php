<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 28/06/14
 * Time: 2:05 PM
 */

require_once 'functions.php';

function ajax_fetch_content_modules() {

    $args= $_REQUEST;

    $content_modules= get_all_content_modules($args);

    wp_send_json(array('code' => 'OK', 'data' => $content_modules));
}

add_action('wp_ajax_get-content-groups', 'ajax_fetch_content_modules');

function ajax_fetch_single_content_module() {

    $id=$_GET['id'];
    $content_module= get_single_content_module($id);

    if(!is_wp_error($content_module))
        wp_send_json (array('code' => 'OK', 'data' => $content_module));
    else
        wp_send_json (array('code' => 'ERROR', 'error_msg' =>$content_module->get_error_message()));
}
add_action('wp_ajax_read-content-group', 'ajax_fetch_single_content_module');