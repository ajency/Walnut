<?php

require_once 'functions.php';

function ajax_create_student_training_module() {

    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'term_ids' => $_POST['term_ids'],
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours'],
        'type' => 'student-training',
        'post_status' => $_POST['post_status']
    );

    $id = save_content_module($data);

    wp_send_json(array('code' => 'OK', 'data' => array('id'=> $id)));
}

add_action('wp_ajax_create-student-training-module', 'ajax_create_student_training_module');

function ajax_update_student_training_module() {

    global $wpdb;

    if (isset($_POST['changed']) && $_POST['changed']=='module_details') {
        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'term_ids' => $_POST['term_ids'],
            'duration' => $_POST['duration'],
            'minshours' => $_POST['minshours'],
            'type' => 'student-training',
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

add_action('wp_ajax_update-student-training-module', 'ajax_update_student_training_module');