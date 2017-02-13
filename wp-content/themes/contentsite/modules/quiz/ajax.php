<?php

require_once 'functions.php';

ini_set('memory_limit', '1024M');

function ajax_create_quiz ()
{
    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'term_ids' => $_POST['term_ids'],
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
    $content_pieces = $_POST['content_layout'];
    $count = count($_POST['content_layout']);

    file_put_contents("b.txt", print_r($content_pieces, true));
    file_put_contents("b1.txt", $count);

    if (isset($_POST['changed']) && $_POST['changed'] == 'module_details') {

        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'term_ids' => $_POST['term_ids'],
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
    if (isset($_POST['changed']) && ($_POST['changed']=='content_pieces')) {
        $data = array();
        $data['id'] = $_POST['id'];
        $data['content_layout'] = check_array_length($content_pieces, $count);
        

        file_put_contents("a1.txt", print_r($data, true));
        update_quiz_content_layout($data);
    }

    wp_send_json (array('code' => 'OK', 'data' => array('id' => (int)$_POST['id'])));
}

add_action ('wp_ajax_update-quiz', 'ajax_update_quiz');


function check_array_length($content_pieces, $count){
    if(count($content_pieces) == $count){
        file_put_contents("a2.txt", 'true');
       return $content_pieces;
    }
    else{
        check_array_length($content_pieces, $count);
    }
}