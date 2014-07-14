<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:30 PM
 */

require_once 'functions.php';

function ajax_create_quiz ()
{
    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours'],
        'post_status' => $_POST['post_status'],
        'permissions' => $_POST['permissions'],
        'type' => $_POST['type'],
        'quiz_type' => $_POST['quiz_type'],
        'marks' => $_POST['marks'],
        'negMarksEnable' => $_POST['negMarksEnable'],
        'negMarks' => $_POST['negMarks'],
        'message' => $_POST['message']
    );
    $id = save_quiz_module ($data);


//    echo $id ;exit;

    wp_send_json (array('code' => 'OK', 'data' => array('id' => $id)));
}

add_action ('wp_ajax_create-quiz', 'ajax_create_quiz');

function ajax_update_quiz ()
{

    if (isset($_POST['changed']) && $_POST['changed'] == 'quiz_details') {

        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'duration' => $_POST['duration'],
            'minshours' => $_POST['minshours'],
            'post_status' => $_POST['post_status'],
            'permissions' => $_POST['permissions'],
            'type' => $_POST['type'],
            'quiz_type' => $_POST['quiz_type'],
            'marks' => $_POST['marks'],
            'negMarksEnable' => $_POST['negMarksEnable'],
            'negMarks' => $_POST['negMarks'],
            'message' => $_POST['message']
        );

        $id = save_quiz_module ($data);
    }

    wp_send_json (array('code' => 'OK', 'data' => array('id' => $_POST['id'])));
}

add_action ('wp_ajax_update-quiz', 'ajax_update_quiz');

function ajax_fetch_single_quiz ()
{
    $id = $_GET['id'];
    $quiz_module = get_single_quiz_module ($id);

    wp_send_json (array('code' => 'OK', 'data' => $quiz_module));
}

add_action ('wp_ajax_read-quiz', 'ajax_fetch_single_quiz');