<?php

function ajax_fetch_student_trainig_modules() {

    $args= $_REQUEST;

    $content_modules= get_all_content_modules($args,'student-training');
    
    wp_send_json(array('code' => 'OK', 'data' => $content_modules));
}

add_action('wp_ajax_get-student-training-modules', 'ajax_fetch_student_trainig_modules');

function ajax_fetch_single_student_trainig_module() {

    $id=$_GET['id'];
    $content_module= get_single_content_module($id);

    if(!is_wp_error($content_module))
        wp_send_json (array('code' => 'OK', 'data' => $content_module));
    else
        wp_send_json (array('code' => 'ERROR', 'error_msg' =>$content_module->get_error_message()));
}
add_action('wp_ajax_read-student-training-module', 'ajax_fetch_single_student_trainig_module');