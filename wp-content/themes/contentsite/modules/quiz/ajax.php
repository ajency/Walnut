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


    //file_put_contents("b.txt", print_r(maybe_serialize($_POST['content_layout']), true));

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
        check_array_length();
    }

    wp_send_json (array('code' => 'OK', 'data' => array('id' => (int)$_POST['id'])));
}

add_action ('wp_ajax_update-quiz', 'ajax_update_quiz');


function check_array_length(){
    $data = array();
    $data['id'] = $_REQUEST['id'];
    // //$data['content_layout'] = maybe_serialize($_POST['content_layout']);
    $data['content_layout'] = $_REQUEST['content_layout'];
 
    file_put_contents("a1.txt", print_r($_REQUEST['content_layout'], true));

    if(count($data['content_layout']) == count($_REQUEST['content_layout']) ){
        file_put_contents("a2.txt", 'true');
        return update_quiz_content_layout($data);
    }
    else{
        file_put_contents("a3.txt", 'false');
        check_array_length();
    }
}