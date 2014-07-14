<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 28/06/14
 * Time: 2:05 PM
 */

require_once 'functions.php';

function ajax_create_content_module() {

    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'term_ids' => $_POST['term_ids'],
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours'],
//        save status
        'post_status' => $_POST['post_status']
    );

    $id = save_content_module($data);

    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $id)));
}

add_action('wp_ajax_create-content-group', 'ajax_create_content_module');

function ajax_update_content_module() {

    global $wpdb;

    if (isset($_POST['changed']) && $_POST['changed']=='module_details') {
        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'term_ids' => $_POST['term_ids'],
            'duration' => $_POST['duration'],
            'minshours' => $_POST['minshours'],
            //        save status
            'post_status'    => $_POST['post_status']
        );
        $content_module = save_content_module($data);
    }

    if (isset($_POST['changed']) && ($_POST['changed']=='content_pieces')) {
        $data = array(
            'id' => $_POST['id'],
            'content_pieces' => $_POST['content_pieces']
        );
        $update_module_content_pieces=update_module_content_pieces($data);
    }
    wp_send_json(array('code' => 'OK', 'data' => array('id'=> (int) $_POST['id'])));
}

add_action('wp_ajax_update-content-group', 'ajax_update_content_module');

function ajax_fetch_content_modules() {

    $args= $_GET;

    $content_modules= get_all_content_modules($args);

    wp_send_json(array('code' => 'OK', 'data' => $content_modules));
}

add_action('wp_ajax_get-content-groups', 'ajax_fetch_content_modules');

function ajax_fetch_single_content_module() {

    $id=$_GET['id'];
    $content_modules= get_single_content_module($id);

    wp_send_json(array('code' => 'OK', 'data' => $content_modules));
}
add_action('wp_ajax_read-content-group', 'ajax_fetch_single_content_module');