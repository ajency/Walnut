<?php

require_once 'functions.php';

//ini_set('memory_limit', '1024M');

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

        if($_POST['content_pieces_length'] == count($_POST['content_layout'])){
            $data = array();
            $data['id'] = $_POST['id'];
            $data['content_layout'] = $_POST['content_layout'];
            update_quiz_content_layout($data);

            $content_data = content_marks_duration($_POST['content_layout']);

            wp_send_json (array('code' => 'OK', 'data' => array('id' => (int)$_POST['id'], 'total_sent_marks'=>$content_data['total_sent_marks'], 'total_sent_duration'=>$content_data['total_sent_duration'], 'total_sent_questions' => count($_POST['content_layout']))));
        }
        else 
            return false;
    }

    wp_send_json (array('code' => 'OK', 'data' => array('id' => (int)$_POST['id'])));
}

add_action ('wp_ajax_update-quiz', 'ajax_update_quiz');
